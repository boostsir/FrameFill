/**
 * Main Application Controller
 * Initializes all modules and binds events
 */

/**
 * Handles drag and drop functionality for image upload
 */
function initializeDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const imageUpload = document.getElementById('image-upload');
    const uploadPrompt = document.getElementById('upload-prompt');
    const canvas = document.getElementById('preview-canvas');
    
    if (!dropZone || !imageUpload) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, handleDragEnter, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, handleDragLeave, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle click to upload
    dropZone.addEventListener('click', () => {
        imageUpload.click();
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleDragEnter(e) {
        dropZone.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        // Only remove if we're actually leaving the drop zone
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        dropZone.classList.remove('drag-over');
        
        if (files.length > 0) {
            // Create a fake event object to work with existing handleImageUpload
            const fakeEvent = {
                target: {
                    files: files
                }
            };
            
            if (typeof handleImageUpload === 'function') {
                handleImageUpload(fakeEvent).then(() => {
                    // Hide upload prompt and show canvas
                    if (uploadPrompt && canvas) {
                        uploadPrompt.style.display = 'none';
                        canvas.style.display = 'block';
                    }
                }).catch(error => {
                    console.error('Upload failed:', error);
                });
            }
        }
    }
}

/**
 * Shows the upload prompt (when no image is loaded)
 */
function showUploadPrompt() {
    const uploadPrompt = document.getElementById('upload-prompt');
    const canvas = document.getElementById('preview-canvas');
    
    if (uploadPrompt && canvas) {
        uploadPrompt.style.display = 'block';
        canvas.style.display = 'none';
    }
}

/**
 * Hides the upload prompt (when image is loaded)
 */
function hideUploadPrompt() {
    const uploadPrompt = document.getElementById('upload-prompt');
    const canvas = document.getElementById('preview-canvas');
    
    if (uploadPrompt && canvas) {
        uploadPrompt.style.display = 'none';
        canvas.style.display = 'block';
    }
}

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
    
    // Initialize drag and drop functionality
    initializeDragAndDrop();
    
    // Bind image upload event
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload && typeof handleImageUpload === 'function') {
        imageUpload.addEventListener('change', (event) => {
            handleImageUpload(event).then(() => {
                hideUploadPrompt();
            }).catch(error => {
                console.error('Upload failed:', error);
            });
        });
    }
    
    // Initialize canvas with default background
    if (typeof updatePreview === 'function') {
        updatePreview();
    }
    
    // Show upload prompt initially
    showUploadPrompt();
    
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