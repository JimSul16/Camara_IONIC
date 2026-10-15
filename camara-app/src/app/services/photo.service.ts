import { Injectable, signal, computed } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
  id: string;
  filepath: string;
  webviewPath: string;
  name: string;
  timestamp: number;
  dateFormatted: string;
  sizeKb: number;
  format: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly PHOTO_STORAGE_KEY = 'obsidian_lens_photos_v1';
  
  // Reactive Signal state
  private _photos = signal<UserPhoto[]>([]);
  public readonly photos = computed(() => this._photos());
  public readonly photoCount = computed(() => this._photos().length);
  public readonly totalStorageKb = computed(() => 
    this._photos().reduce((acc, p) => acc + (p.sizeKb || 0), 0)
  );

  constructor(private platform: Platform) {
    this.loadSaved();
  }

  /**
   * Load saved photos from Preferences & Filesystem
   */
  public async loadSaved(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.PHOTO_STORAGE_KEY });
      const storedPhotos: UserPhoto[] = value ? JSON.parse(value) : [];

      if (!this.platform.is('hybrid')) {
        // When running on the Web, read each file from the Filesystem into base64 data
        for (const photo of storedPhotos) {
          try {
            const readFile = await Filesystem.readFile({
              path: photo.filepath,
              directory: Directory.Data
            });
            photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
          } catch (readErr) {
            console.warn(`Could not read file from web storage: ${photo.filepath}`, readErr);
          }
        }
      }

      this._photos.set(storedPhotos);
    } catch (err) {
      console.error('Error loading saved photos from storage', err);
      this._photos.set([]);
    }
  }

  /**
   * Capture a new photo with the camera or gallery picker
   */
  public async addNewToGallery(source: CameraSource = CameraSource.Camera): Promise<UserPhoto | null> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: source,
        quality: 90,
        allowEditing: false,
        saveToGallery: true
      });

      const savedImageFile = await this.savePicture(capturedPhoto);
      this._photos.update(current => [savedImageFile, ...current]);
      
      await Preferences.set({
        key: this.PHOTO_STORAGE_KEY,
        value: JSON.stringify(this._photos())
      });

      return savedImageFile;
    } catch (error: any) {
      // User cancelled capture or permission denied
      if (error?.message !== 'User cancelled photos app' && error?.message !== 'User cancelled') {
        console.error('Error capturing photo:', error);
      }
      return null;
    }
  }

  /**
   * Delete a photo from both filesystem and stored preferences
   */
  public async deletePhoto(photo: UserPhoto): Promise<boolean> {
    try {
      // Delete file from device filesystem
      await Filesystem.deleteFile({
        path: photo.filepath,
        directory: Directory.Data
      });

      // Update state and persistence
      this._photos.update(current => current.filter(p => p.id !== photo.id));
      await Preferences.set({
        key: this.PHOTO_STORAGE_KEY,
        value: JSON.stringify(this._photos())
      });
      return true;
    } catch (error) {
      console.error(`Error deleting photo ${photo.filepath}:`, error);
      // Still remove from state if file already removed physically
      this._photos.update(current => current.filter(p => p.id !== photo.id));
      await Preferences.set({
        key: this.PHOTO_STORAGE_KEY,
        value: JSON.stringify(this._photos())
      });
      return false;
    }
  }

  /**
   * Save picture to physical filesystem (Directory.Data)
   */
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(photo);
    const now = new Date();
    const timestamp = now.getTime();
    const fileName = `IMG_${timestamp}.jpeg`;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Approximate size in KB based on base64 length
    const approxSizeKb = Math.round((base64Data.length * 3 / 4) / 1024);

    const dateFormatted = new Intl.DateTimeFormat('es-EC', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(now);

    if (this.platform.is('hybrid')) {
      // Mobile WebView display path
      return {
        id: `photo_${timestamp}`,
        filepath: fileName,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        name: fileName,
        timestamp,
        dateFormatted,
        sizeKb: approxSizeKb,
        format: photo.format || 'jpeg'
      };
    } else {
      // Web browser preview path
      return {
        id: `photo_${timestamp}`,
        filepath: fileName,
        webviewPath: photo.webPath || `data:image/jpeg;base64,${base64Data}`,
        name: fileName,
        timestamp,
        dateFormatted,
        sizeKb: approxSizeKb,
        format: photo.format || 'jpeg'
      };
    }
  }

  /**
   * Helper to convert Photo into base64 string
   */
  private async readAsBase64(photo: Photo): Promise<string> {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      return typeof file.data === 'string' ? file.data : '';
    } else {
      // Web: fetch URI and convert to base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out the data:image/...;base64, prefix for Filesystem.writeFile
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
}
