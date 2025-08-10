/**
 * Main Application Controller
 * Initializes all modules and binds events
 */

/**
 * Initializes the entire application
 */
function initializeApp() {
    // Initialize all modules
    if (typeof initializeControls === 'function') {
        initializeControls();
    }
    
    if (typeof initializeDownload === 'function') {
        initializeDownload();
    }
    
    // Bind image upload event
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload && typeof handleImageUpload === 'function') {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Initialize canvas with default background
    if (typeof updatePreview === 'function') {
        updatePreview();
    }
    
    console.log('Image Background Tool initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp
    };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.initializeApp = initializeApp;
}