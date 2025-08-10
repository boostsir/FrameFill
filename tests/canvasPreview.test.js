/**
 * Canvas Preview Functionality Tests
 * Following TDD: RED → GREEN → REFACTOR
 */

const fs = require('fs');
const path = require('path');

// Load the HTML template
const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');

beforeEach(() => {
    document.body.innerHTML = html;
    
    // Reset global variables
    global.uploadedImage = null;
    global.imageElement = null;
});

describe('Canvas Preview Functionality', () => {
    test('should have preview canvas element', () => {
        const canvas = document.getElementById('preview-canvas');
        expect(canvas).toBeTruthy();
        expect(canvas.tagName).toBe('CANVAS');
        expect(canvas.width).toBe(800);
        expect(canvas.height).toBe(600);
    });

    test('should update preview when image is uploaded', async () => {
        // This test will fail initially (RED phase)
        const { updatePreview } = require('../src/js/canvasRenderer');
        const { handleImageUpload } = require('../src/js/imageProcessor');
        
        const mockFile = new File(['fake-image-data'], 'test.jpg', { type: 'image/jpeg' });
        const mockEvent = { target: { files: [mockFile] } };
        
        // Mock canvas context
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        await handleImageUpload(mockEvent);
        updatePreview();
        
        expect(mockContext.fillRect).toHaveBeenCalled();
        expect(mockContext.drawImage).toHaveBeenCalled();
    });

    test('should clear canvas and draw background', () => {
        // This test will fail initially (RED phase)
        const { drawBackground } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        drawBackground('#ff0000', 800, 600);
        
        expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
        expect(mockContext.fillStyle).toBe('#ff0000');
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    test('should calculate scaled image dimensions', () => {
        // This test will fail initially (RED phase)
        const { calculateScaledDimensions } = require('../src/js/canvasRenderer');
        
        const originalWidth = 200;
        const originalHeight = 150;
        const scale = 50; // 50%
        
        const result = calculateScaledDimensions(originalWidth, originalHeight, scale);
        
        expect(result.scaledWidth).toBe(100);
        expect(result.scaledHeight).toBe(75);
    });

    test('should calculate center position for image', () => {
        // This test will fail initially (RED phase)
        const { calculateCenterPosition } = require('../src/js/canvasRenderer');
        
        const canvasWidth = 800;
        const canvasHeight = 600;
        const imageWidth = 200;
        const imageHeight = 150;
        
        const result = calculateCenterPosition(canvasWidth, canvasHeight, imageWidth, imageHeight);
        
        expect(result.x).toBe(300); // (800 - 200) / 2
        expect(result.y).toBe(225); // (600 - 150) / 2
    });

    test('should draw image at center position with scaling', () => {
        // This test will fail initially (RED phase)
        const { drawImageOnCanvas } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            drawImage: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        const mockImage = {
            width: 200,
            height: 150
        };
        
        drawImageOnCanvas(mockImage, 100, 800, 600); // 100% scale
        
        expect(mockContext.drawImage).toHaveBeenCalledWith(
            mockImage,
            300, // x position (centered)
            225, // y position (centered)
            200, // scaled width
            150  // scaled height
        );
    });

    test('should get canvas settings from UI controls', () => {
        // This test will fail initially (RED phase)
        const { getCanvasSettings } = require('../src/js/canvasRenderer');
        
        // Set up UI control values
        document.getElementById('width-input').value = '1000';
        document.getElementById('height-input').value = '800';
        document.getElementById('scale-slider').value = '75';
        document.getElementById('bg-color').value = '#00ff00';
        
        const settings = getCanvasSettings();
        
        expect(settings.width).toBe(1000);
        expect(settings.height).toBe(800);
        expect(settings.scale).toBe(75);
        expect(settings.backgroundColor).toBe('#00ff00');
    });

    test('should update canvas dimensions when size changes', () => {
        // This test will fail initially (RED phase)
        const { updateCanvasDimensions } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        
        updateCanvasDimensions(1200, 900);
        
        expect(canvas.width).toBe(1200);
        expect(canvas.height).toBe(900);
    });

    test('should handle missing image gracefully', () => {
        // This test will fail initially (RED phase)
        const { updatePreview } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        // Mock missing image functions
        window.getImageElement = jest.fn(() => null);
        window.getUploadedImage = jest.fn(() => null);
        
        // Should not throw error when no image is uploaded
        expect(() => updatePreview()).not.toThrow();
        
        // Should still draw background
        expect(mockContext.fillRect).toHaveBeenCalled();
        expect(mockContext.drawImage).not.toHaveBeenCalled();
    });
});