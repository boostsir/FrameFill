/**
 * Canvas Rendering Module
 * Handles canvas drawing, image positioning, and preview updates
 */

/**
 * Gets current canvas settings from UI controls
 * @returns {Object} Settings object with width, height, scale, backgroundColor, backgroundType, border
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
        backgroundColor: bgColorInput ? bgColorInput.value : '#ffffff',
        backgroundType: window.getBackgroundType ? window.getBackgroundType() : 'color',
        border: window.getBorderSettings ? window.getBorderSettings() : { width: 10, color: '#ffffff' }
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
 * Calculates scale factor for blurred background to cover entire canvas
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {number} Scale factor
 */
function calculateBlurScale(imageWidth, imageHeight, canvasWidth, canvasHeight) {
    const scaleX = canvasWidth / imageWidth;
    const scaleY = canvasHeight / imageHeight;
    
    // Use the larger scale to ensure the image covers the entire canvas
    return Math.max(scaleX, scaleY);
}

/**
 * Creates blurred background from image
 * @param {HTMLImageElement} image - Source image
 * @param {number} canvasWidth - Target canvas width
 * @param {number} canvasHeight - Target canvas height
 * @returns {Object} Object with canvas and scale properties
 */
function createBlurredBackground(image, canvasWidth, canvasHeight) {
    const scale = calculateBlurScale(image.width, image.height, canvasWidth, canvasHeight);
    
    return {
        canvas: image, // We'll apply blur filter during drawing
        scale: scale
    };
}

/**
 * Draws blurred background on canvas
 * @param {HTMLImageElement} image - Source image
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 */
function drawBlurredBackground(image, canvasWidth, canvasHeight) {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Apply blur filter
    ctx.filter = 'blur(10px)';
    
    // Calculate scale to cover entire canvas
    const scale = calculateBlurScale(image.width, image.height, canvasWidth, canvasHeight);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    
    // Center the scaled image
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2;
    
    // Draw the blurred background
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Reset filter
    ctx.filter = 'none';
}

/**
 * Draws background based on type (color or blurred image)
 * @param {string} backgroundType - 'color' or 'image'
 * @param {string} backgroundColor - Background color for color type
 * @param {HTMLImageElement} image - Image for blur background
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 */
function drawBackgroundByType(backgroundType, backgroundColor, image, canvasWidth, canvasHeight) {
    if (backgroundType === 'image' && image) {
        drawBlurredBackground(image, canvasWidth, canvasHeight);
    } else {
        drawBackground(backgroundColor, canvasWidth, canvasHeight);
    }
}

/**
 * Calculates image position accounting for border
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @param {number} imageWidth - Image width
 * @param {number} imageHeight - Image height
 * @param {number} borderWidth - Border width
 * @returns {Object} Object with x, y, adjustedWidth, adjustedHeight
 */
function calculateImagePositionWithBorder(canvasWidth, canvasHeight, imageWidth, imageHeight, borderWidth) {
    // Border doesn't change the centering calculation, just affects where border is drawn
    return {
        x: Math.round((canvasWidth - imageWidth) / 2),
        y: Math.round((canvasHeight - imageHeight) / 2),
        adjustedWidth: imageWidth,
        adjustedHeight: imageHeight
    };
}

/**
 * Draws border around image
 * @param {Object} imagePosition - Object with x and y coordinates
 * @param {Object} imageSize - Object with width and height
 * @param {Object} borderSettings - Object with width and color
 */
function drawImageBorder(imagePosition, imageSize, borderSettings) {
    if (borderSettings.width === 0) return; // No border
    
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set border style
    ctx.strokeStyle = borderSettings.color;
    ctx.lineWidth = borderSettings.width;
    
    // Calculate border rectangle (centered on the image edge)
    const x = imagePosition.x - borderSettings.width / 2;
    const y = imagePosition.y - borderSettings.width / 2;
    const width = imageSize.width + borderSettings.width;
    const height = imageSize.height + borderSettings.width;
    
    // Draw border
    ctx.strokeRect(x, y, width, height);
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
    
    // Draw background based on type
    drawBackgroundByType(
        settings.backgroundType, 
        settings.backgroundColor, 
        imageElement, 
        settings.width, 
        settings.height
    );
    
    // Draw image if both image element and uploaded image data are available
    if (imageElement && uploadedImage) {
        // Calculate image dimensions and position
        const { scaledWidth, scaledHeight } = calculateScaledDimensions(
            imageElement.width, 
            imageElement.height, 
            settings.scale
        );
        
        const imagePosition = calculateCenterPosition(
            settings.width, 
            settings.height, 
            scaledWidth, 
            scaledHeight
        );
        
        // Draw the image
        drawImageOnCanvas(imageElement, settings.scale, settings.width, settings.height);
        
        // Draw border if specified
        if (settings.border.width > 0) {
            drawImageBorder(
                imagePosition, 
                { width: scaledWidth, height: scaledHeight }, 
                settings.border
            );
        }
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
        calculateBlurScale,
        createBlurredBackground,
        drawBlurredBackground,
        drawBackgroundByType,
        calculateImagePositionWithBorder,
        drawImageBorder,
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
    window.calculateBlurScale = calculateBlurScale;
    window.createBlurredBackground = createBlurredBackground;
    window.drawBlurredBackground = drawBlurredBackground;
    window.drawBackgroundByType = drawBackgroundByType;
    window.calculateImagePositionWithBorder = calculateImagePositionWithBorder;
    window.drawImageBorder = drawImageBorder;
    window.drawImageOnCanvas = drawImageOnCanvas;
    window.updatePreview = updatePreview;
}