/**
 * Download Functionality Tests
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

describe('Download Functionality', () => {
    test('should have download button element', () => {
        const downloadBtn = document.getElementById('download-btn');
        
        expect(downloadBtn).toBeTruthy();
        expect(downloadBtn.tagName).toBe('BUTTON');
        expect(downloadBtn.disabled).toBe(true); // Should be disabled initially
    });

    test('should generate filename with timestamp', () => {
        // This test will fail initially (RED phase)
        const { generateFilename } = require('../src/js/downloadManager');
        
        const filename = generateFilename();
        
        expect(filename).toMatch(/^image-with-bg-\d{13}\.png$/);
        expect(filename.startsWith('image-with-bg-')).toBe(true);
        expect(filename.endsWith('.png')).toBe(true);
    });

    test('should create download canvas with correct dimensions', () => {
        // This test will fail initially (RED phase)
        const { createDownloadCanvas } = require('../src/js/downloadManager');
        
        const settings = {
            width: 1000,
            height: 800,
            backgroundColor: '#ff0000',
            scale: 150
        };
        
        const canvas = createDownloadCanvas(settings);
        
        expect(canvas.width).toBe(1000);
        expect(canvas.height).toBe(800);
        expect(canvas.tagName).toBe('CANVAS');
    });

    test('should render image to download canvas', async () => {
        // This test will fail initially (RED phase)
        const { renderToDownloadCanvas } = require('../src/js/downloadManager');
        
        // Create mock image
        const mockImage = {
            width: 200,
            height: 150
        };
        
        const settings = {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff',
            scale: 100
        };
        
        const canvas = document.createElement('canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        canvas.getContext = jest.fn(() => mockContext);
        
        await renderToDownloadCanvas(canvas, mockImage, settings);
        
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        expect(mockContext.drawImage).toHaveBeenCalledWith(
            mockImage,
            300, // centered x
            225, // centered y
            200, // scaled width
            150  // scaled height
        );
    });

    test('should convert canvas to blob', async () => {
        // This test will fail initially (RED phase)
        const { canvasToBlob } = require('../src/js/downloadManager');
        
        const canvas = document.createElement('canvas');
        const mockBlob = new Blob(['fake-data'], { type: 'image/png' });
        
        // Mock toBlob method
        canvas.toBlob = jest.fn((callback) => {
            setTimeout(() => callback(mockBlob), 0);
        });
        
        const result = await canvasToBlob(canvas);
        
        expect(result).toBe(mockBlob);
        expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    });

    test('should create download link and trigger download', () => {
        // This test will fail initially (RED phase)
        const { triggerDownload } = require('../src/js/downloadManager');
        
        const mockBlob = new Blob(['fake-data'], { type: 'image/png' });
        const filename = 'test-image.png';
        
        // Mock URL.createObjectURL
        const mockUrl = 'blob:test-url';
        global.URL.createObjectURL = jest.fn(() => mockUrl);
        global.URL.revokeObjectURL = jest.fn();
        
        // Mock document.createElement and click
        const mockLink = {
            href: '',
            download: '',
            click: jest.fn()
        };
        const originalCreateElement = document.createElement;
        document.createElement = jest.fn(() => mockLink);
        
        triggerDownload(mockBlob, filename);
        
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
        expect(mockLink.href).toBe(mockUrl);
        expect(mockLink.download).toBe(filename);
        expect(mockLink.click).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
        
        // Restore original createElement
        document.createElement = originalCreateElement;
    });

    test('should handle download button click with uploaded image', async () => {
        // This test will fail initially (RED phase)
        const { handleDownloadClick } = require('../src/js/downloadManager');
        
        // Mock uploaded image
        const mockImage = { width: 200, height: 150 };
        window.getUploadedImage = jest.fn(() => 'data:image/png;base64,fake-data');
        window.getImageElement = jest.fn(() => mockImage);
        
        // Mock canvas settings function
        window.getCanvasSettings = jest.fn(() => ({
            width: 800,
            height: 600,
            scale: 100,
            backgroundColor: '#ffffff'
        }));
        
        // Mock createElement to return canvas with mocked context
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn()
        };
        
        const mockCanvas = {
            width: 0,
            height: 0,
            getContext: jest.fn(() => mockContext),
            toBlob: jest.fn((callback) => {
                const mockBlob = new Blob(['fake-data'], { type: 'image/png' });
                setTimeout(() => callback(mockBlob), 0);
            })
        };
        
        // Mock document.createElement
        const originalCreateElement = document.createElement;
        document.createElement = jest.fn((tagName) => {
            if (tagName === 'canvas') {
                return mockCanvas;
            } else if (tagName === 'a') {
                return { href: '', download: '', click: jest.fn() };
            }
            return originalCreateElement.call(document, tagName);
        });
        
        // Mock URL functions
        global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
        global.URL.revokeObjectURL = jest.fn();
        
        // Mock alert to avoid jsdom error
        window.alert = jest.fn();
        
        await handleDownloadClick();
        
        expect(mockContext.drawImage).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        
        // Restore createElement
        document.createElement = originalCreateElement;
    });

    test('should not download when no image is uploaded', async () => {
        // This test will fail initially (RED phase)
        const { handleDownloadClick } = require('../src/js/downloadManager');
        
        // Mock no uploaded image
        global.getUploadedImage = jest.fn(() => null);
        global.getImageElement = jest.fn(() => null);
        
        // Mock alert
        window.alert = jest.fn();
        
        await handleDownloadClick();
        
        expect(window.alert).toHaveBeenCalledWith('請先上傳圖片');
    });

    test('should bind download button event', () => {
        // This test will fail initially (RED phase)
        const { bindDownloadEvent } = require('../src/js/downloadManager');
        
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener = jest.fn();
        
        bindDownloadEvent();
        
        expect(downloadBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    test('should handle canvas to blob errors gracefully', async () => {
        // This test will fail initially (RED phase)
        const { canvasToBlob } = require('../src/js/downloadManager');
        
        const canvas = document.createElement('canvas');
        
        // Mock toBlob to simulate failure
        canvas.toBlob = jest.fn((callback) => {
            setTimeout(() => callback(null), 0);
        });
        
        await expect(canvasToBlob(canvas)).rejects.toThrow('Failed to convert canvas to blob');
    });
});