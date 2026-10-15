import { TestBed } from '@angular/core/testing';
import { PhotoService, UserPhoto } from './photo.service';
import { Platform } from '@ionic/angular';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: null }),
    set: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('@capacitor/filesystem', () => ({
  Filesystem: {
    deleteFile: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue({ uri: 'file:///data/user/0/mock' }),
    readFile: vi.fn().mockResolvedValue({ data: 'mockbase64data' })
  },
  Directory: {
    Data: 'DATA'
  }
}));

vi.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: vi.fn()
  },
  CameraResultType: { Uri: 'uri' },
  CameraSource: { Camera: 'CAMERA', Photos: 'PHOTOS' }
}));

describe('PhotoService', () => {
  let service: PhotoService;

  const mockPlatform = {
    is: vi.fn().mockReturnValue(false)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoService,
        { provide: Platform, useValue: mockPlatform }
      ]
    });
    service = TestBed.inject(PhotoService);
  });

  it('should be created and start with 0 photos', () => {
    expect(service).toBeTruthy();
    expect(service.photoCount()).toBe(0);
    expect(service.photos()).toEqual([]);
  });

  it('should compute total storage size correctly', () => {
    expect(service.totalStorageKb()).toBe(0);
  });

  it('should successfully handle deleting a photo and update reactive signals', async () => {
    const mockPhoto: UserPhoto = {
      id: 'photo_123',
      filepath: 'IMG_123.jpeg',
      webviewPath: 'data:image/jpeg;base64,abc',
      name: 'IMG_123.jpeg',
      timestamp: 12345678,
      dateFormatted: '15 oct 2026',
      sizeKb: 150,
      format: 'jpeg'
    };

    // Inject state
    (service as any)._photos.set([mockPhoto]);
    expect(service.photoCount()).toBe(1);

    const deleted = await service.deletePhoto(mockPhoto);
    expect(deleted).toBe(true);
    expect(service.photoCount()).toBe(0);
  });
});
