/**
 * UI Controls Module
 * Handles size controls, scale controls, background color, and event binding
 */

const MIN_SIZE = 100;
const MAX_SIZE = 2000;
const MIN_SCALE = 25;
const MAX_SCALE = 200;

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
        alert('尺寸必須在 100-2000px 範圍內，且必須為整數');
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
        alert('請選擇有效的顏色');
        event.target.value = '#ffffff'; // Reset to white
        return;
    }
    
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
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateSizeInput,
        validateColorInput,
        handleSizeChange,
        handleSizeBlur,
        handleScaleChange,
        updateScaleDisplay,
        handleColorChange,
        bindControlEvents,
        initializeControls
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.validateSizeInput = validateSizeInput;
    window.validateColorInput = validateColorInput;
    window.handleSizeChange = handleSizeChange;
    window.handleSizeBlur = handleSizeBlur;
    window.handleScaleChange = handleScaleChange;
    window.updateScaleDisplay = updateScaleDisplay;
    window.handleColorChange = handleColorChange;
    window.bindControlEvents = bindControlEvents;
    window.initializeControls = initializeControls;
}