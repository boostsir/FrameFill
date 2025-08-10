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
        
        // Mock canvas context
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn(),
            filter: 'none',
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        // Mock image functions
        window.getImageElement = jest.fn(() => ({
            width: 200,
            height: 150
        }));
        window.getUploadedImage = jest.fn(() => 'mock-data-url');
        window.getBackgroundType = jest.fn(() => 'color');
        window.getBorderSettings = jest.fn(() => ({ width: 10, color: '#ffffff' }));
        
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

describe('Image Blur Background Functionality', () => {
    test('should create blurred background from image', () => {
        // This test will fail initially (RED phase)
        const { createBlurredBackground } = require('../src/js/canvasRenderer');
        
        const mockImage = {
            width: 300,
            height: 200
        };
        
        const result = createBlurredBackground(mockImage, 800, 600);
        
        expect(result).toBeTruthy();
        expect(result.canvas).toBeTruthy();
        expect(result.scale).toBeGreaterThan(1); // Should be enlarged
    });

    test('should calculate blur background scale to cover canvas', () => {
        // This test will fail initially (RED phase)  
        const { calculateBlurScale } = require('../src/js/canvasRenderer');
        
        // Image smaller than canvas
        let scale = calculateBlurScale(400, 300, 800, 600);
        expect(scale).toBe(2); // Should scale to cover canvas
        
        // Image larger than canvas  
        scale = calculateBlurScale(1200, 900, 800, 600);
        expect(scale).toBeCloseTo(0.67, 1); // Should scale to cover canvas
        
        // Image with different aspect ratio
        scale = calculateBlurScale(200, 600, 800, 400);
        expect(scale).toBe(4); // Should scale width to cover
    });

    test('should draw blurred background on canvas', () => {
        // This test will fail initially (RED phase)
        const { drawBlurredBackground } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        let filterValue = 'none';
        const mockContext = {
            get filter() { return filterValue; },
            set filter(value) { filterValue = value; },
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        const mockImage = {
            width: 400,
            height: 300
        };
        
        drawBlurredBackground(mockImage, 800, 600);
        
        expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
        expect(mockContext.drawImage).toHaveBeenCalled();
        expect(filterValue).toBe('none'); // Should reset filter after drawing
    });

    test('should handle background type switching', () => {
        // This test will fail initially (RED phase)
        const { drawBackgroundByType } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        let filterValue = 'none';
        const mockContext = {
            get filter() { return filterValue; },
            set filter(value) { filterValue = value; },
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        const mockImage = {
            width: 400,
            height: 300
        };
        
        // Test color background
        drawBackgroundByType('color', '#ff0000', mockImage, 800, 600);
        expect(mockContext.fillStyle).toBe('#ff0000');
        expect(mockContext.fillRect).toHaveBeenCalled();
        
        // Test image background
        jest.clearAllMocks();
        drawBackgroundByType('image', '#ff0000', mockImage, 800, 600);
        expect(mockContext.drawImage).toHaveBeenCalled();
    });
});

describe('Border Rendering Functionality', () => {
    test('should draw border around image', () => {
        // This test will fail initially (RED phase)
        const { drawImageBorder } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        const imagePosition = { x: 100, y: 50 };
        const imageSize = { width: 200, height: 150 };
        const borderSettings = { width: 10, color: '#ffffff' };
        
        drawImageBorder(imagePosition, imageSize, borderSettings);
        
        expect(mockContext.strokeStyle).toBe('#ffffff');
        expect(mockContext.lineWidth).toBe(10);
        expect(mockContext.strokeRect).toHaveBeenCalledWith(
            95,  // x - borderWidth/2
            45,  // y - borderWidth/2  
            210, // width + borderWidth
            160  // height + borderWidth
        );
    });

    test('should not draw border when width is 0', () => {
        // This test will fail initially (RED phase)
        const { drawImageBorder } = require('../src/js/canvasRenderer');
        
        const canvas = document.getElementById('preview-canvas');
        const mockContext = {
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        
        canvas.getContext = jest.fn(() => mockContext);
        
        const imagePosition = { x: 100, y: 50 };
        const imageSize = { width: 200, height: 150 };
        const borderSettings = { width: 0, color: '#ffffff' };
        
        drawImageBorder(imagePosition, imageSize, borderSettings);
        
        expect(mockContext.strokeRect).not.toHaveBeenCalled();
    });

    test('should calculate border-adjusted image position', () => {
        // This test will fail initially (RED phase)
        const { calculateImagePositionWithBorder } = require('../src/js/canvasRenderer');
        
        const canvasWidth = 800;
        const canvasHeight = 600;
        const imageWidth = 200;
        const imageHeight = 150;
        const borderWidth = 10;
        
        const result = calculateImagePositionWithBorder(
            canvasWidth, canvasHeight, imageWidth, imageHeight, borderWidth
        );
        
        // Should account for border when centering
        expect(result.x).toBe(300); // Still centered
        expect(result.y).toBe(225); // Still centered
        expect(result.adjustedWidth).toBe(200);
        expect(result.adjustedHeight).toBe(150);
    });
});