import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonAlert,
  IonSpinner,
  ActionSheetController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  camera,
  cameraOutline,
  images,
  imagesOutline,
  trash,
  trashOutline,
  expandOutline,
  closeOutline,
  flashOutline,
  hardwareChipOutline,
  timeOutline,
  discOutline,
  sparklesOutline,
  checkmarkCircle,
  informationCircleOutline
} from 'ionicons/icons';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonModal,
    IonAlert,
    IonSpinner
  ]
})
export class HomePage {
  public photoService = inject(PhotoService);
  private actionSheetCtrl = inject(ActionSheetController);

  // Component Signals
  public isCapturing = signal<boolean>(false);
  public isShutterActive = signal<boolean>(false);
  public selectedPhoto = signal<UserPhoto | null>(null);
  public photoToDelete = signal<UserPhoto | null>(null);
  public isAlertOpen = signal<boolean>(false);

  // Alert configuration
  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.isAlertOpen.set(false);
        this.photoToDelete.set(null);
      }
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {
        const photo = this.photoToDelete();
        if (photo) {
          this.executeDelete(photo);
        }
      }
    }
  ];

  constructor() {
    addIcons({
      camera,
      cameraOutline,
      images,
      imagesOutline,
      trash,
      trashOutline,
      expandOutline,
      closeOutline,
      flashOutline,
      hardwareChipOutline,
      timeOutline,
      discOutline,
      sparklesOutline,
      checkmarkCircle,
      informationCircleOutline
    });
  }

  /**
   * Trigger photo capture from hardware camera
   */
  public async takePhoto(): Promise<void> {
    this.triggerShutterAnimation();
    this.isCapturing.set(true);
    try {
      await this.photoService.addNewToGallery(CameraSource.Camera);
    } finally {
      this.isCapturing.set(false);
    }
  }

  /**
   * Present action sheet to let the user select between live camera or device gallery
   */
  public async openCaptureOptions(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'DISPARADOR OBSIDIAN',
      subHeader: 'Selecciona la fuente de imagen',
      cssClass: 'obsidian-action-sheet',
      buttons: [
        {
          text: 'Tomar Fotografía (Cámara)',
          icon: 'camera-outline',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Seleccionar de Galería',
          icon: 'images-outline',
          handler: () => {
            this.pickFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  /**
   * Pick photo from device gallery
   */
  public async pickFromGallery(): Promise<void> {
    this.isCapturing.set(true);
    try {
      await this.photoService.addNewToGallery(CameraSource.Photos);
    } finally {
      this.isCapturing.set(false);
    }
  }

  /**
   * Open full screen zoom modal
   */
  public openDetail(photo: UserPhoto): void {
    this.selectedPhoto.set(photo);
  }

  /**
   * Close modal
   */
  public closeDetail(): void {
    this.selectedPhoto.set(null);
  }

  /**
   * Request confirmation before permanent deletion
   */
  public promptDelete(photo: UserPhoto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.photoToDelete.set(photo);
    this.isAlertOpen.set(true);
  }

  /**
   * Perform deletion
   */
  private async executeDelete(photo: UserPhoto): Promise<void> {
    await this.photoService.deletePhoto(photo);
    if (this.selectedPhoto()?.id === photo.id) {
      this.closeDetail();
    }
    this.photoToDelete.set(null);
    this.isAlertOpen.set(false);
  }

  /**
   * Shutter button tactile micro-animation
   */
  private triggerShutterAnimation(): void {
    this.isShutterActive.set(true);
    setTimeout(() => {
      this.isShutterActive.set(false);
    }, 300);
  }

  public get recentPhoto(): UserPhoto | null {
    const list = this.photoService.photos();
    return list.length > 0 ? list[0] : null;
  }
}
