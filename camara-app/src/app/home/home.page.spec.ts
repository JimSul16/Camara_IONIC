import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { signal } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const mockPhoto: UserPhoto = {
    id: 'test_1',
    filepath: 'IMG_test.jpeg',
    webviewPath: 'data:image/jpeg;base64,12345',
    name: 'IMG_test.jpeg',
    timestamp: 123456789,
    dateFormatted: '15/10/2026',
    sizeKb: 200,
    format: 'jpeg'
  };

  const mockPhotosSignal = signal<UserPhoto[]>([mockPhoto]);
  const mockCountSignal = signal<number>(1);
  const mockStorageSignal = signal<number>(200);

  const mockPhotoService = {
    photos: mockPhotosSignal,
    photoCount: mockCountSignal,
    totalStorageKb: mockStorageSignal,
    addNewToGallery: vi.fn().mockResolvedValue(mockPhoto),
    deletePhoto: vi.fn().mockResolvedValue(true),
    loadSaved: vi.fn().mockResolvedValue(undefined)
  };

  const mockActionSheetCtrl = {
    create: vi.fn().mockResolvedValue({
      present: vi.fn().mockResolvedValue(undefined)
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: ActionSheetController, useValue: mockActionSheetCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Obsidian Lens HomePage component', () => {
    expect(component).toBeTruthy();
  });

  it('should detect the recent photo from the photo service', () => {
    expect(component.recentPhoto).toEqual(mockPhoto);
  });

  it('should open and close the photo detail modal', () => {
    component.openDetail(mockPhoto);
    expect(component.selectedPhoto()).toEqual(mockPhoto);

    component.closeDetail();
    expect(component.selectedPhoto()).toBeNull();
  });

  it('should prompt for deletion and open the confirmation alert', () => {
    component.promptDelete(mockPhoto);
    expect(component.photoToDelete()).toEqual(mockPhoto);
    expect(component.isAlertOpen()).toBe(true);
  });

  it('should invoke addNewToGallery when takePhoto is called', async () => {
    await component.takePhoto();
    expect(mockPhotoService.addNewToGallery).toHaveBeenCalled();
  });
});
