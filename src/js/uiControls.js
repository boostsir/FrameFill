/**
 * UI Controls Module
 * Handles size controls, scale controls, background color, and event binding
 */

const MIN_SIZE = 100;
const MAX_SIZE = 2000;
const MIN_SCALE = 25;
const MAX_SCALE = 200;
const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 50;

/**
 * Validates size input (width/height)
 * @param {number} value - Size value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateSizeInput(value) {
    // Check if it's a valid number
    if (isNaN(value) || value !== Math.floor(value)) {
        return false; // Not an integer
    }
    
    // Check range
    return value >= MIN_SIZE && value <= MAX_SIZE;
}

/**
 * Validates hex color input
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid hex color, false otherwise
 */
function validateColorInput(color) {
    // Check for # prefix
    if (!color.startsWith('#')) {
        return false;
    }
    
    // Remove # and check hex format
    const hexColor = color.slice(1);
    
    // Valid lengths: 3 or 6
    if (hexColor.length !== 3 && hexColor.length !== 6) {
        return false;
    }
    
    // Check if all characters are valid hex
    const hexPattern = /^[0-9A-Fa-f]+$/;
    return hexPattern.test(hexColor);
}

/**
 * Handles size input changes (width/height) - for real-time preview updates
 * @param {Event} event - Input change event
 */
function handleSizeChange(event) {
    const value = parseInt(event.target.value);
    
    // Only update preview if we have a valid number in the acceptable range
    // Don't show alert while user is still typing, but also don't update preview for invalid values
    if (!isNaN(value) && validateSizeInput(value)) {
        // Update preview if function exists
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }
}

/**
 * Handles size input validation when user finishes editing (blur event)
 * @param {Event} event - Input blur event
 */
function handleSizeBlur(event) {
    const value = parseInt(event.target.value);
    
    if (!validateSizeInput(value)) {
        alert('Size must be between 100-2000px and must be an integer.');
        // Reset to previous valid value or default
        event.target.value = event.target.id === 'width-input' ? 800 : 600;
        
        // Update preview after reset
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }
}

/**
 * Handles scale slider changes
 * @param {Event} event - Input change event
 */
function handleScaleChange(event) {
    const value = parseInt(event.target.value);
    
    // Update scale display
    updateScaleDisplay(value);
    
    // Update preview if function exists
    if (typeof window.updatePreview === 'function') {
        window.updatePreview();
    }
}

/**
 * Updates scale display text
 * @param {number} value - Scale percentage value
 */
function updateScaleDisplay(value) {
    const scaleDisplay = document.getElementById('scale-display');
    if (scaleDisplay) {
        scaleDisplay.textContent = `${value}%`;
    }
}

/**
 * Handles background color changes
 * @param {Event} event - Input change event
 */
function handleColorChange(event) {
    const color = event.target.value;
    
    // HTML color input should always provide valid colors, but validate anyway
    if (!validateColorInput(color)) {
        alert('Please select a valid color.');
        event.target.value = '#ffffff'; // Reset to white
        return;
    }
    
    // Update preview if function exists
    if (typeof window.updatePreview === 'function') {
        window.updatePreview();
    }
}

/**
 * Validates border width input
 * @param {number} value - Border width value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateBorderWidth(value) {
    if (isNaN(value) || value !== Math.floor(value)) {
        return false; // Not an integer
    }
    
    return value >= MIN_BORDER_WIDTH && value <= MAX_BORDER_WIDTH;
}

/**
 * Gets current background type from radio buttons
 * @returns {string} - 'color' or 'image'
 */
function getBackgroundType() {
    const colorRadio = document.getElementById('bg-type-color');
    const imageRadio = document.getElementById('bg-type-image');
    
    if (colorRadio && colorRadio.checked) {
        return 'color';
    } else if (imageRadio && imageRadio.checked) {
        return 'image';
    }
    
    return 'color'; // Default fallback
}

/**
 * Toggles visibility of background controls based on type
 * @param {string} type - Background type ('color' or 'image')
 */
function toggleBackgroundControls(type) {
    const colorControls = document.getElementById('bg-color-controls');
    
    if (colorControls) {
        if (type === 'color') {
            colorControls.style.display = '';
        } else {
            colorControls.style.display = 'none';
        }
    }
}

/**
 * Handles background type change (radio button selection)
 * @param {Event} event - Input change event
 */
function handleBackgroundTypeChange(event) {
    const selectedType = event.target.value;
    
    // Toggle controls visibility
    toggleBackgroundControls(selectedType);
    
    // Update preview if function exists
    if (typeof window.updatePreview === 'function') {
        window.updatePreview();
    }
}

/**
 * Gets current border settings
 * @returns {Object} Object with width and color properties
 */
function getBorderSettings() {
    const borderWidthInput = document.getElementById('border-width');
    const borderColorInput = document.getElementById('border-color');
    
    return {
        width: parseInt(borderWidthInput ? borderWidthInput.value : 10),
        color: borderColorInput ? borderColorInput.value : '#ffffff'
    };
}

/**
 * Handles border width changes
 * @param {Event} event - Input change event
 */
function handleBorderWidthChange(event) {
    const value = parseInt(event.target.value);
    
    // Only update preview if we have a valid number in the acceptable range
    if (!isNaN(value) && validateBorderWidth(value)) {
        // Update preview if function exists
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }
}

/**
 * Handles border width validation when user finishes editing (blur event)
 * @param {Event} event - Input blur event
 */
function handleBorderWidthBlur(event) {
    const value = parseInt(event.target.value);
    
    if (!validateBorderWidth(value)) {
        alert('Border width must be between 0-50px and must be an integer.');
        event.target.value = '10'; // Reset to default
        
        // Update preview after reset
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }
}

/**
 * Handles border color changes
 * @param {Event} event - Input change event
 */
function handleBorderColorChange(event) {
    // Update preview if function exists
    if (typeof window.updatePreview === 'function') {
        window.updatePreview();
    }
}

/**
 * Binds all control events to their respective elements
 */
function bindControlEvents() {
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const scaleSlider = document.getElementById('scale-slider');
    const bgColorInput = document.getElementById('bg-color');
    const bgTypeColorRadio = document.getElementById('bg-type-color');
    const bgTypeImageRadio = document.getElementById('bg-type-image');
    const borderWidthInput = document.getElementById('border-width');
    const borderColorInput = document.getElementById('border-color');
    
    if (widthInput) {
        widthInput.addEventListener('input', handleSizeChange);  // Real-time preview
        widthInput.addEventListener('blur', handleSizeBlur);    // Validation on blur
    }
    
    if (heightInput) {
        heightInput.addEventListener('input', handleSizeChange); // Real-time preview
        heightInput.addEventListener('blur', handleSizeBlur);   // Validation on blur
    }
    
    if (scaleSlider) {
        scaleSlider.addEventListener('input', handleScaleChange);
        // Initialize scale display
        updateScaleDisplay(parseInt(scaleSlider.value));
    }
    
    if (bgColorInput) {
        bgColorInput.addEventListener('input', handleColorChange);
    }
    
    if (bgTypeColorRadio) {
        bgTypeColorRadio.addEventListener('change', handleBackgroundTypeChange);
    }
    
    if (bgTypeImageRadio) {
        bgTypeImageRadio.addEventListener('change', handleBackgroundTypeChange);
    }
    
    if (borderWidthInput) {
        borderWidthInput.addEventListener('input', handleBorderWidthChange);
        borderWidthInput.addEventListener('blur', handleBorderWidthBlur);
    }
    
    if (borderColorInput) {
        borderColorInput.addEventListener('input', handleBorderColorChange);
    }
}

/**
 * Initialize all UI controls
 */
function initializeControls() {
    bindControlEvents();
    
    // Set initial scale display
    const scaleSlider = document.getElementById('scale-slider');
    if (scaleSlider) {
        updateScaleDisplay(parseInt(scaleSlider.value));
    }
    
    // Initialize background controls visibility
    const initialType = getBackgroundType();
    toggleBackgroundControls(initialType);
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateSizeInput,
        validateColorInput,
        validateBorderWidth,
        handleSizeChange,
        handleSizeBlur,
        handleScaleChange,
        updateScaleDisplay,
        handleColorChange,
        getBackgroundType,
        toggleBackgroundControls,
        handleBackgroundTypeChange,
        getBorderSettings,
        handleBorderWidthChange,
        handleBorderColorChange,
        bindControlEvents,
        initializeControls
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.validateSizeInput = validateSizeInput;
    window.validateColorInput = validateColorInput;
    window.validateBorderWidth = validateBorderWidth;
    window.handleSizeChange = handleSizeChange;
    window.handleSizeBlur = handleSizeBlur;
    window.handleScaleChange = handleScaleChange;
    window.updateScaleDisplay = updateScaleDisplay;
    window.handleColorChange = handleColorChange;
    window.getBackgroundType = getBackgroundType;
    window.toggleBackgroundControls = toggleBackgroundControls;
    window.handleBackgroundTypeChange = handleBackgroundTypeChange;
    window.getBorderSettings = getBorderSettings;
    window.handleBorderWidthChange = handleBorderWidthChange;
    window.handleBorderColorChange = handleBorderColorChange;
    window.bindControlEvents = bindControlEvents;
    window.initializeControls = initializeControls;
}