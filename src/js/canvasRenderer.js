/**
 * Canvas Rendering Module
 * Handles canvas drawing, image positioning, and preview updates
 */

/**
 * Gets current canvas settings from UI controls
 * @returns {Object} Settings object with width, height, scale, backgroundColor
 */
function getCanvasSettings() {
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const scaleSlider = document.getElementById('scale-slider');
    const bgColorInput = document.getElementById('bg-color');
    
    return {
        width: parseInt(widthInput ? widthInput.value : 800),
        height: parseInt(heightInput ? heightInput.value : 600),
        scale: parseInt(scaleSlider ? scaleSlider.value : 100),
        backgroundColor: bgColorInput ? bgColorInput.value : '#ffffff'
    };
}

/**
 * Updates canvas dimensions
 * @param {number} width - New canvas width
 * @param {number} height - New canvas height
 */
function updateCanvasDimensions(width, height) {
    const canvas = document.getElementById('preview-canvas');
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
}

/**
 * Draws background color on canvas
 * @param {string} color - Background color (hex format)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
function drawBackground(color, width, height) {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fill with background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Calculates scaled image dimensions
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} scale - Scale percentage (25-200)
 * @returns {Object} Object with scaledWidth and scaledHeight
 */
function calculateScaledDimensions(originalWidth, originalHeight, scale) {
    const scaleFactor = scale / 100;
    return {
        scaledWidth: Math.round(originalWidth * scaleFactor),
        scaledHeight: Math.round(originalHeight * scaleFactor)
    };
}

/**
 * Calculates center position for image on canvas
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @param {number} imageWidth - Image width
 * @param {number} imageHeight - Image height
 * @returns {Object} Object with x and y coordinates
 */
function calculateCenterPosition(canvasWidth, canvasHeight, imageWidth, imageHeight) {
    return {
        x: Math.round((canvasWidth - imageWidth) / 2),
        y: Math.round((canvasHeight - imageHeight) / 2)
    };
}

/**
 * Draws image on canvas at center position with scaling
 * @param {HTMLImageElement} image - Image element to draw
 * @param {number} scale - Scale percentage
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 */
function drawImageOnCanvas(image, scale, canvasWidth, canvasHeight) {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate scaled dimensions
    const { scaledWidth, scaledHeight } = calculateScaledDimensions(image.width, image.height, scale);
    
    // Calculate center position
    const { x, y } = calculateCenterPosition(canvasWidth, canvasHeight, scaledWidth, scaledHeight);
    
    // Draw the image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
}

/**
 * Updates the preview canvas with current settings
 * Main function that orchestrates the canvas rendering
 */
function updatePreview() {
    const settings = getCanvasSettings();
    const imageElement = window.getImageElement ? window.getImageElement() : null;
    const uploadedImage = window.getUploadedImage ? window.getUploadedImage() : null;
    
    // Update canvas dimensions
    updateCanvasDimensions(settings.width, settings.height);
    
    // Draw background
    drawBackground(settings.backgroundColor, settings.width, settings.height);
    
    // Draw image if both image element and uploaded image data are available
    if (imageElement && uploadedImage) {
        drawImageOnCanvas(imageElement, settings.scale, settings.width, settings.height);
    }
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCanvasSettings,
        updateCanvasDimensions,
        drawBackground,
        calculateScaledDimensions,
        calculateCenterPosition,
        drawImageOnCanvas,
        updatePreview
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.getCanvasSettings = getCanvasSettings;
    window.updateCanvasDimensions = updateCanvasDimensions;
    window.drawBackground = drawBackground;
    window.calculateScaledDimensions = calculateScaledDimensions;
    window.calculateCenterPosition = calculateCenterPosition;
    window.drawImageOnCanvas = drawImageOnCanvas;
    window.updatePreview = updatePreview;
}