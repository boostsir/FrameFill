/**
 * Image Processing Module
 * Handles image upload, validation, and processing
 */

// Global variables
let uploadedImage = null;
let imageElement = null;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates image file type and size
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateImageFile(file) {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return false;
    }
    
    // Check file size (5MB limit)
    if (file.size > MAX_FILE_SIZE) {
        return false;
    }
    
    return true;
}

/**
 * Handles image file upload
 * @param {Event} event - The file input change event
 */
async function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate the file
    if (!validateImageFile(file)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
        } else if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds 5MB limit. Please select a smaller file.');
        }
        return;
    }
    
    try {
        // Read the file as data URL
        const dataUrl = await readFileAsDataURL(file);
        
        // Create image element
        imageElement = new Image();
        
        return new Promise((resolve, reject) => {
            imageElement.onload = () => {
                uploadedImage = dataUrl;
                
                // Enable download button
                const downloadBtn = document.getElementById('download-btn');
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                }
                
                // Trigger preview update if function exists
                if (typeof updatePreview === 'function') {
                    updatePreview();
                }
                
                resolve();
            };
            
            imageElement.onerror = () => {
                alert('Image loading failed. Please try another file.');
                reject(new Error('Image load failed'));
            };
            
            imageElement.src = dataUrl;
        });
        
    } catch (error) {
        alert('File reading failed. Please try again.');
        console.error('File reading error:', error);
    }
}

/**
 * Reads file as data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} - Promise resolving to data URL
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('FileReader error'));
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Gets the current uploaded image
 * @returns {string|null} - Data URL of uploaded image or null
 */
function getUploadedImage() {
    return uploadedImage;
}

/**
 * Gets the current image element
 * @returns {HTMLImageElement|null} - Image element or null
 */
function getImageElement() {
    return imageElement;
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateImageFile,
        handleImageUpload,
        readFileAsDataURL,
        getUploadedImage,
        getImageElement
    };
}

// Make functions available globally for browser use
if (typeof window !== 'undefined') {
    window.validateImageFile = validateImageFile;
    window.handleImageUpload = handleImageUpload;
    window.readFileAsDataURL = readFileAsDataURL;
    window.getUploadedImage = getUploadedImage;
    window.getImageElement = getImageElement;
    
    // Set global variables accessible
    window.uploadedImage = uploadedImage;
    window.imageElement = imageElement;
}