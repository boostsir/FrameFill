/**
 * Main Application Tests
 * Following TDD: RED → GREEN → REFACTOR
 */

const fs = require('fs');
const path = require('path');

// Load the HTML template
const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');

beforeEach(() => {
    document.body.innerHTML = html;
    
    // Mock console.log to avoid test output
    console.log = jest.fn();
});

describe('Main Application', () => {
    test('should initialize app when DOM is loaded', () => {
        const { initializeApp } = require('../src/js/app');
        
        // Mock all initialization functions
        window.initializeControls = jest.fn();
        window.initializeDownload = jest.fn();
        window.handleImageUpload = jest.fn();
        window.updatePreview = jest.fn();
        
        initializeApp();
        
        expect(window.initializeControls).toHaveBeenCalled();
        expect(window.initializeDownload).toHaveBeenCalled();
        expect(window.updatePreview).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Image Background Tool initialized successfully');
    });

    test('should bind image upload event listener', () => {
        const { initializeApp } = require('../src/js/app');
        
        const imageUpload = document.getElementById('image-upload');
        imageUpload.addEventListener = jest.fn();
        
        // Mock functions
        window.initializeControls = jest.fn();
        window.initializeDownload = jest.fn();
        window.handleImageUpload = jest.fn(() => Promise.resolve());
        window.updatePreview = jest.fn();
        
        initializeApp();
        
        expect(imageUpload.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    test('should handle missing functions gracefully', () => {
        const { initializeApp } = require('../src/js/app');
        
        // Don't define any functions
        delete window.initializeControls;
        delete window.initializeDownload;
        delete window.handleImageUpload;
        delete window.updatePreview;
        
        // Should not throw errors
        expect(() => initializeApp()).not.toThrow();
    });
});