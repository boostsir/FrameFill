/**
 * UI Controls Functionality Tests
 * Testing size controls, scale controls, and background color
 * Following TDD: RED → GREEN → REFACTOR
 */

const fs = require('fs');
const path = require('path');

// Load the HTML template
const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');

beforeEach(() => {
    document.body.innerHTML = html;
});

describe('Size Controls Functionality', () => {
    test('should have width and height input elements', () => {
        const widthInput = document.getElementById('width-input');
        const heightInput = document.getElementById('height-input');
        
        expect(widthInput).toBeTruthy();
        expect(heightInput).toBeTruthy();
        expect(widthInput.type).toBe('number');
        expect(heightInput.type).toBe('number');
        expect(widthInput.min).toBe('100');
        expect(widthInput.max).toBe('2000');
        expect(heightInput.min).toBe('100');
        expect(heightInput.max).toBe('2000');
    });

    test('should validate size input ranges', () => {
        // This test will fail initially (RED phase)
        const { validateSizeInput } = require('../src/js/uiControls');
        
        expect(validateSizeInput(150)).toBe(true);   // Valid
        expect(validateSizeInput(2000)).toBe(true);  // Valid max
        expect(validateSizeInput(100)).toBe(true);   // Valid min
        expect(validateSizeInput(50)).toBe(false);   // Too small
        expect(validateSizeInput(2500)).toBe(false); // Too large
        expect(validateSizeInput(-10)).toBe(false);  // Negative
        expect(validateSizeInput(1.5)).toBe(false);  // Decimal
    });

    test('should handle width input change', () => {
        // This test will fail initially (RED phase)
        const { handleSizeChange } = require('../src/js/uiControls');
        
        const widthInput = document.getElementById('width-input');
        
        // Mock updatePreview function
        window.updatePreview = jest.fn();
        
        widthInput.value = '1000';
        const event = { target: widthInput };
        
        handleSizeChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should handle height input change', () => {
        // This test will fail initially (RED phase)
        const { handleSizeChange } = require('../src/js/uiControls');
        
        const heightInput = document.getElementById('height-input');
        
        // Mock updatePreview function
        window.updatePreview = jest.fn();
        
        heightInput.value = '800';
        const event = { target: heightInput };
        
        handleSizeChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should not show alert during input changes for invalid values', () => {
        const { handleSizeChange } = require('../src/js/uiControls');
        
        const widthInput = document.getElementById('width-input');
        window.alert = jest.fn();
        window.updatePreview = jest.fn();
        
        widthInput.value = '50'; // Too small
        const event = { target: widthInput };
        
        handleSizeChange(event);
        
        // Should NOT show alert during typing
        expect(window.alert).not.toHaveBeenCalled();
        // Should NOT update preview for invalid values
        expect(window.updatePreview).not.toHaveBeenCalled();
    });

    test('should validate and show alert on blur for invalid size values', () => {
        const { handleSizeBlur } = require('../src/js/uiControls');
        
        const widthInput = document.getElementById('width-input');
        window.alert = jest.fn();
        window.updatePreview = jest.fn();
        
        widthInput.value = '50'; // Too small
        const event = { target: widthInput };
        
        handleSizeBlur(event);
        
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Size must be between 100-2000px'));
        expect(widthInput.value).toBe('800'); // Reset to default
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should update preview for valid values during input', () => {
        const { handleSizeChange } = require('../src/js/uiControls');
        
        const widthInput = document.getElementById('width-input');
        window.updatePreview = jest.fn();
        
        widthInput.value = '1000'; // Valid
        const event = { target: widthInput };
        
        handleSizeChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });
});

describe('Scale Controls Functionality', () => {
    test('should have scale slider element', () => {
        const scaleSlider = document.getElementById('scale-slider');
        const scaleDisplay = document.getElementById('scale-display');
        
        expect(scaleSlider).toBeTruthy();
        expect(scaleDisplay).toBeTruthy();
        expect(scaleSlider.type).toBe('range');
        expect(scaleSlider.min).toBe('25');
        expect(scaleSlider.max).toBe('200');
        expect(scaleSlider.step).toBe('5');
        expect(scaleSlider.value).toBe('100');
    });

    test('should handle scale slider change', () => {
        // This test will fail initially (RED phase)
        const { handleScaleChange } = require('../src/js/uiControls');
        
        const scaleSlider = document.getElementById('scale-slider');
        const scaleDisplay = document.getElementById('scale-display');
        
        // Mock updatePreview function
        window.updatePreview = jest.fn();
        
        scaleSlider.value = '150';
        const event = { target: scaleSlider };
        
        handleScaleChange(event);
        
        expect(scaleDisplay.textContent).toBe('150%');
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should update scale display when slider moves', () => {
        // This test will fail initially (RED phase)
        const { updateScaleDisplay } = require('../src/js/uiControls');
        
        const scaleDisplay = document.getElementById('scale-display');
        
        updateScaleDisplay(75);
        expect(scaleDisplay.textContent).toBe('75%');
        
        updateScaleDisplay(200);
        expect(scaleDisplay.textContent).toBe('200%');
    });
});

describe('Background Color Controls Functionality', () => {
    test('should have background color input element', () => {
        const bgColorInput = document.getElementById('bg-color');
        
        expect(bgColorInput).toBeTruthy();
        expect(bgColorInput.type).toBe('color');
        expect(bgColorInput.value).toBe('#ffffff');
    });

    test('should handle background color change', () => {
        // This test will fail initially (RED phase)
        const { handleColorChange } = require('../src/js/uiControls');
        
        const bgColorInput = document.getElementById('bg-color');
        
        // Mock updatePreview function
        window.updatePreview = jest.fn();
        
        bgColorInput.value = '#ff0000';
        const event = { target: bgColorInput };
        
        handleColorChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should validate hex color format', () => {
        // This test will fail initially (RED phase)
        const { validateColorInput } = require('../src/js/uiControls');
        
        expect(validateColorInput('#ffffff')).toBe(true);
        expect(validateColorInput('#ff0000')).toBe(true);
        expect(validateColorInput('#123abc')).toBe(true);
        expect(validateColorInput('ffffff')).toBe(false); // Missing #
        expect(validateColorInput('#gggggg')).toBe(false); // Invalid hex
        expect(validateColorInput('#fff')).toBe(true);     // Short form
    });
});

describe('Background Type Selection', () => {
    test('should have background type radio buttons', () => {
        // This test will fail initially (RED phase)
        const colorRadio = document.getElementById('bg-type-color');
        const imageRadio = document.getElementById('bg-type-image');
        
        expect(colorRadio).toBeTruthy();
        expect(imageRadio).toBeTruthy();
        expect(colorRadio.type).toBe('radio');
        expect(imageRadio.type).toBe('radio');
        expect(colorRadio.name).toBe('bg-type');
        expect(imageRadio.name).toBe('bg-type');
        expect(colorRadio.checked).toBe(true); // Default to color
    });

    test('should handle background type change', () => {
        // This test will fail initially (RED phase)
        const { handleBackgroundTypeChange } = require('../src/js/uiControls');
        
        const colorRadio = document.getElementById('bg-type-color');
        const imageRadio = document.getElementById('bg-type-image');
        
        window.updatePreview = jest.fn();
        
        // Switch to image background
        imageRadio.checked = true;
        const event = { target: imageRadio };
        
        handleBackgroundTypeChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should get current background type', () => {
        // This test will fail initially (RED phase)
        const { getBackgroundType } = require('../src/js/uiControls');
        
        const colorRadio = document.getElementById('bg-type-color');
        const imageRadio = document.getElementById('bg-type-image');
        
        colorRadio.checked = true;
        expect(getBackgroundType()).toBe('color');
        
        colorRadio.checked = false;
        imageRadio.checked = true;
        expect(getBackgroundType()).toBe('image');
    });

    test('should show/hide color picker based on background type', () => {
        // This test will fail initially (RED phase)
        const { toggleBackgroundControls } = require('../src/js/uiControls');
        
        const colorControls = document.getElementById('bg-color-controls');
        
        toggleBackgroundControls('color');
        expect(colorControls.style.display).not.toBe('none');
        
        toggleBackgroundControls('image');
        expect(colorControls.style.display).toBe('none');
    });
});

describe('Border Controls Functionality', () => {
    test('should have border width and color inputs', () => {
        // This test will fail initially (RED phase)
        const borderWidthInput = document.getElementById('border-width');
        const borderColorInput = document.getElementById('border-color');
        
        expect(borderWidthInput).toBeTruthy();
        expect(borderColorInput).toBeTruthy();
        expect(borderWidthInput.type).toBe('number');
        expect(borderColorInput.type).toBe('color');
        expect(borderWidthInput.value).toBe('10'); // Default width
        expect(borderColorInput.value).toBe('#ffffff'); // Default color
    });

    test('should validate border width input', () => {
        // This test will fail initially (RED phase)
        const { validateBorderWidth } = require('../src/js/uiControls');
        
        expect(validateBorderWidth(0)).toBe(true);   // No border
        expect(validateBorderWidth(10)).toBe(true);  // Valid
        expect(validateBorderWidth(50)).toBe(true);  // Valid max
        expect(validateBorderWidth(-1)).toBe(false); // Negative
        expect(validateBorderWidth(51)).toBe(false); // Too large
        expect(validateBorderWidth(5.5)).toBe(false); // Decimal
    });

    test('should handle border width change', () => {
        // This test will fail initially (RED phase)
        const { handleBorderWidthChange } = require('../src/js/uiControls');
        
        const borderWidthInput = document.getElementById('border-width');
        window.updatePreview = jest.fn();
        
        borderWidthInput.value = '20';
        const event = { target: borderWidthInput };
        
        handleBorderWidthChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should handle border color change', () => {
        // This test will fail initially (RED phase)
        const { handleBorderColorChange } = require('../src/js/uiControls');
        
        const borderColorInput = document.getElementById('border-color');
        window.updatePreview = jest.fn();
        
        borderColorInput.value = '#ff0000';
        const event = { target: borderColorInput };
        
        handleBorderColorChange(event);
        
        expect(window.updatePreview).toHaveBeenCalled();
    });

    test('should get border settings', () => {
        // This test will fail initially (RED phase)
        const { getBorderSettings } = require('../src/js/uiControls');
        
        const borderWidthInput = document.getElementById('border-width');
        const borderColorInput = document.getElementById('border-color');
        
        borderWidthInput.value = '15';
        borderColorInput.value = '#0000ff';
        
        const settings = getBorderSettings();
        expect(settings.width).toBe(15);
        expect(settings.color).toBe('#0000ff');
    });
});

describe('Event Binding', () => {
    test('should bind all control events', () => {
        // This test will fail initially (RED phase)
        const { bindControlEvents } = require('../src/js/uiControls');
        
        // Mock addEventListener
        const widthInput = document.getElementById('width-input');
        const heightInput = document.getElementById('height-input');
        const scaleSlider = document.getElementById('scale-slider');
        const bgColorInput = document.getElementById('bg-color');
        
        widthInput.addEventListener = jest.fn();
        heightInput.addEventListener = jest.fn();
        scaleSlider.addEventListener = jest.fn();
        bgColorInput.addEventListener = jest.fn();
        
        bindControlEvents();
        
        expect(widthInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
        expect(widthInput.addEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
        expect(heightInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
        expect(heightInput.addEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
        expect(scaleSlider.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
        expect(bgColorInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    });
});