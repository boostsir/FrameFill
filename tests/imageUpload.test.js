/**
 * Image Upload Functionality Tests
 * Following TDD: RED → GREEN → REFACTOR
 */

const fs = require('fs');
const path = require('path');

// Load the HTML template and extract DOM structure for testing
const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
document.body.innerHTML = html;

// Mock the JavaScript modules we'll create
let ImageUploader;

beforeEach(() => {
    document.body.innerHTML = html;
    
    // Reset global variables
    global.uploadedImage = null;
    global.imageElement = null;
});

describe('Image Upload Functionality', () => {
    test('should have image upload input element', () => {
        const uploadInput = document.getElementById('image-upload');
        expect(uploadInput).toBeTruthy();
        expect(uploadInput.type).toBe('file');
        expect(uploadInput.accept).toBe('image/*');
    });

    test('should validate image file type', async () => {
        // This test will fail initially (RED phase)
        const { validateImageFile } = require('../src/js/imageProcessor');
        
        // Create mock files
        const validImageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
        
        expect(validateImageFile(validImageFile)).toBe(true);
        expect(validateImageFile(invalidFile)).toBe(false);
    });

    test('should validate image file size (max 5MB)', async () => {
        // This test will fail initially (RED phase)
        const { validateImageFile } = require('../src/js/imageProcessor');
        
        // Mock large file (6MB)
        const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
        // Mock normal file (2MB)
        const normalFile = new File(['x'.repeat(2 * 1024 * 1024)], 'normal.jpg', { type: 'image/jpeg' });
        
        expect(validateImageFile(largeFile)).toBe(false);
        expect(validateImageFile(normalFile)).toBe(true);
    });

    test('should process valid image file upload', async () => {
        // This test will fail initially (RED phase)
        const { handleImageUpload, getUploadedImage, getImageElement } = require('../src/js/imageProcessor');
        
        const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
        const mockEvent = { target: { files: [mockFile] } };
        
        await handleImageUpload(mockEvent);
        
        // Should set uploaded image data
        expect(getUploadedImage()).toBeTruthy();
        expect(getImageElement()).toBeTruthy();
    });

    test('should enable download button after image upload', async () => {
        // This test will fail initially (RED phase)
        const { handleImageUpload } = require('../src/js/imageProcessor');
        
        const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
        const mockEvent = { target: { files: [mockFile] } };
        
        const downloadBtn = document.getElementById('download-btn');
        expect(downloadBtn.disabled).toBe(true);
        
        await handleImageUpload(mockEvent);
        
        expect(downloadBtn.disabled).toBe(false);
    });

    test('should enable preview download button after image upload', async () => {
        const { handleImageUpload } = require('../src/js/imageProcessor');
        
        const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
        const mockEvent = { target: { files: [mockFile] } };
        
        // Mock the enablePreviewDownloadButton function
        window.enablePreviewDownloadButton = jest.fn();
        
        const previewDownloadBtn = document.getElementById('preview-download-btn');
        
        // Initially disabled
        expect(previewDownloadBtn.disabled).toBe(true);
        
        await handleImageUpload(mockEvent);
        
        // Should call enablePreviewDownloadButton
        expect(window.enablePreviewDownloadButton).toHaveBeenCalled();
    });

    test('should show error alert for invalid file', async () => {
        // This test will fail initially (RED phase)
        const { handleImageUpload } = require('../src/js/imageProcessor');
        
        // Mock alert function
        window.alert = jest.fn();
        
        const invalidFile = new File(['text'], 'test.txt', { type: 'text/plain' });
        const mockEvent = { target: { files: [invalidFile] } };
        
        await handleImageUpload(mockEvent);
        
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Please select a valid image file'));
    });

    test('should show error alert for oversized file', async () => {
        // This test will fail initially (RED phase)
        const { handleImageUpload } = require('../src/js/imageProcessor');
        
        // Mock alert function
        window.alert = jest.fn();
        
        const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
        const mockEvent = { target: { files: [largeFile] } };
        
        await handleImageUpload(mockEvent);
        
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('File size exceeds 5MB limit'));
    });
});