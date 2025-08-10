/**
 * Download Manager Module
 * Handles image download functionality including canvas creation, rendering, and file generation
 */

/**
 * Generates filename with timestamp
 * @returns {string} - Filename in format image-with-bg-{timestamp}.png
 */
function generateFilename() {
    const timestamp = Date.now();
    return `image-with-bg-${timestamp}.png`;
}

/**
 * Creates a new canvas for download with specified dimensions
 * @param {Object} settings - Canvas settings object
 * @returns {HTMLCanvasElement} - New canvas element
 */
function createDownloadCanvas(settings) {
    const canvas = document.createElement('canvas');
    canvas.width = settings.width;
    canvas.height = settings.height;
    return canvas;
}

/**
 * Renders image to download canvas with background and scaling
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {HTMLImageElement} image - Image to render
 * @param {Object} settings - Render settings
 */
async function renderToDownloadCanvas(canvas, image, settings) {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, settings.width, settings.height);
    
    // Draw background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, settings.width, settings.height);
    
    // Calculate scaled dimensions
    const scaleFactor = settings.scale / 100;
    const scaledWidth = Math.round(image.width * scaleFactor);
    const scaledHeight = Math.round(image.height * scaleFactor);
    
    // Calculate center position
    const x = Math.round((settings.width - scaledWidth) / 2);
    const y = Math.round((settings.height - scaledHeight) / 2);
    
    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
}

/**
 * Converts canvas to blob
 * @param {HTMLCanvasElement} canvas - Canvas to convert
 * @returns {Promise<Blob>} - Promise resolving to blob
 */
function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to convert canvas to blob'));
            }
        }, 'image/png');
    });
}

/**
 * Triggers download of blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename for download
 */
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    
    // Trigger download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Handles download button click event
 * Main function that orchestrates the entire download process
 */
async function handleDownloadClick() {
    try {
        // Check if image is uploaded
        const uploadedImage = window.getUploadedImage ? window.getUploadedImage() : null;
        const imageElement = window.getImageElement ? window.getImageElement() : null;
        
        if (!uploadedImage || !imageElement) {
            alert('Please upload an image first.');
            return;
        }
        
        // Get current settings from UI
        const settings = window.getCanvasSettings ? window.getCanvasSettings() : {
            width: 800,
            height: 600,
            scale: 100,
            backgroundColor: '#ffffff'
        };
        
        // Create download canvas
        const canvas = createDownloadCanvas(settings);
        
        // Render to canvas
        await renderToDownloadCanvas(canvas, imageElement, settings);
        
        // Convert to blob
        const blob = await canvasToBlob(canvas);
        
        // Generate filename and trigger download
        const filename = generateFilename();
        triggerDownload(blob, filename);
        
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
}

/**
 * Binds download button event
 */
function bindDownloadEvent() {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadClick);
    }
}

/**
 * Initializes download functionality
 */
function initializeDownload() {
    bindDownloadEvent();
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateFilename,
        createDownloadCanvas,
        renderToDownloadCanvas,
        canvasToBlob,
        triggerDownload,
        handleDownloadClick,
        bindDownloadEvent,
        initializeDownload
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.generateFilename = generateFilename;
    window.createDownloadCanvas = createDownloadCanvas;
    window.renderToDownloadCanvas = renderToDownloadCanvas;
    window.canvasToBlob = canvasToBlob;
    window.triggerDownload = triggerDownload;
    window.handleDownloadClick = handleDownloadClick;
    window.bindDownloadEvent = bindDownloadEvent;
    window.initializeDownload = initializeDownload;
}