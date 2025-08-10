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
        
        expect(window.alert).toHaveBeenCalledWith('Please upload an image first.');
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

    test('should render blur background when backgroundType is image', async () => {
        // This test will fail initially (RED phase) - BUG REPRODUCTION
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
            backgroundType: 'image', // This should render blur background
            scale: 100,
            border: { width: 10, color: '#ffffff' }
        };
        
        const canvas = document.createElement('canvas');
        let filterValue = 'none';
        const mockContext = {
            get filter() { return filterValue; },
            set filter(value) { filterValue = value; },
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn(),
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        canvas.getContext = jest.fn(() => mockContext);
        
        await renderToDownloadCanvas(canvas, mockImage, settings);
        
        // Currently this will fail because renderToDownloadCanvas ignores backgroundType
        // It should call drawImage twice: once for blur background, once for main image
        expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
        
        // Should also draw border
        expect(mockContext.strokeRect).toHaveBeenCalled();
    });

    test('should render color background when backgroundType is color', async () => {
        // This test will pass as current implementation handles color backgrounds
        const { renderToDownloadCanvas } = require('../src/js/downloadManager');
        
        // Create mock image
        const mockImage = {
            width: 200,
            height: 150
        };
        
        const settings = {
            width: 800,
            height: 600,
            backgroundColor: '#ff0000',
            backgroundType: 'color', 
            scale: 100,
            border: { width: 0, color: '#ffffff' } // No border
        };
        
        const canvas = document.createElement('canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn(),
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        canvas.getContext = jest.fn(() => mockContext);
        
        await renderToDownloadCanvas(canvas, mockImage, settings);
        
        // Should fill background with color
        expect(mockContext.fillStyle).toBe('#ff0000');
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        
        // Should draw image once
        expect(mockContext.drawImage).toHaveBeenCalledTimes(1);
        
        // Should not draw border
        expect(mockContext.strokeRect).not.toHaveBeenCalled();
    });

    test('should include border in download when border width > 0', async () => {
        // This test will fail initially (RED phase) - BUG REPRODUCTION
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
            backgroundType: 'color',
            scale: 100,
            border: { width: 15, color: '#0000ff' }
        };
        
        const canvas = document.createElement('canvas');
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            drawImage: jest.fn(),
            clearRect: jest.fn(),
            strokeStyle: '',
            lineWidth: 0,
            strokeRect: jest.fn()
        };
        canvas.getContext = jest.fn(() => mockContext);
        
        await renderToDownloadCanvas(canvas, mockImage, settings);
        
        // Should draw border
        expect(mockContext.strokeStyle).toBe('#0000ff');
        expect(mockContext.lineWidth).toBe(15);
        expect(mockContext.strokeRect).toHaveBeenCalled();
    });

    test('should have both download buttons in HTML', () => {
        const mainDownloadBtn = document.getElementById('download-btn');
        const previewDownloadBtn = document.getElementById('preview-download-btn');
        const previewDownloadSection = document.getElementById('preview-download-section');
        
        expect(mainDownloadBtn).toBeTruthy();
        expect(previewDownloadBtn).toBeTruthy();
        expect(previewDownloadSection).toBeTruthy();
        
        // Both download buttons should be visible but disabled initially
        expect(previewDownloadSection.style.display).not.toBe('none');
        expect(previewDownloadBtn.disabled).toBe(true);
        expect(mainDownloadBtn.disabled).toBe(true);
    });

    test('should enable preview download button', () => {
        const { enablePreviewDownloadButton } = require('../src/js/downloadManager');
        
        const previewDownloadBtn = document.getElementById('preview-download-btn');
        
        // Initially disabled
        expect(previewDownloadBtn.disabled).toBe(true);
        
        enablePreviewDownloadButton();
        
        // Should be enabled now
        expect(previewDownloadBtn.disabled).toBe(false);
    });

    test('should disable preview download button', () => {
        const { disablePreviewDownloadButton } = require('../src/js/downloadManager');
        
        const previewDownloadBtn = document.getElementById('preview-download-btn');
        
        // First enable it
        previewDownloadBtn.disabled = false;
        
        disablePreviewDownloadButton();
        
        // Should be disabled now
        expect(previewDownloadBtn.disabled).toBe(true);
    });

    test('should bind both download buttons to click event', () => {
        const { bindDownloadEvent } = require('../src/js/downloadManager');
        
        const mainDownloadBtn = document.getElementById('download-btn');
        const previewDownloadBtn = document.getElementById('preview-download-btn');
        
        mainDownloadBtn.addEventListener = jest.fn();
        previewDownloadBtn.addEventListener = jest.fn();
        
        bindDownloadEvent();
        
        expect(mainDownloadBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        expect(previewDownloadBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
});