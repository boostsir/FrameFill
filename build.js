/**
 * Build Script - Creates single HTML file from modular source
 * Combines HTML, CSS, and JavaScript into one deployable file
 */

const fs = require('fs');
const path = require('path');

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return '';
    }
}

function buildSingleHTML() {
    console.log('Building single HTML file...');
    
    // Read HTML template
    const htmlTemplate = readFile(path.join(__dirname, 'src/index.html'));
    
    // Read CSS files (if any)
    const customCSS = readFile(path.join(__dirname, 'src/css/style.css'));
    
    // Read all JavaScript modules in order
    const imageProcessor = readFile(path.join(__dirname, 'src/js/imageProcessor.js'));
    const canvasRenderer = readFile(path.join(__dirname, 'src/js/canvasRenderer.js'));
    const uiControls = readFile(path.join(__dirname, 'src/js/uiControls.js'));
    const downloadManager = readFile(path.join(__dirname, 'src/js/downloadManager.js'));
    const app = readFile(path.join(__dirname, 'src/js/app.js'));
    
    // Combine all JavaScript
    const combinedJS = `
// Image Background Tool - Combined JavaScript
// Generated on ${new Date().toISOString()}

${imageProcessor}

${canvasRenderer}

${uiControls}

${downloadManager}

${app}
`;
    
    // Create the final HTML by injecting scripts and styles
    let finalHTML = htmlTemplate;
    
    // Add custom CSS if it exists
    if (customCSS) {
        const cssInjection = `
    <style>
        ${customCSS}
    </style>`;
        finalHTML = finalHTML.replace('</head>', cssInjection + '\n</head>');
    }
    
    // Add combined JavaScript before closing body tag
    const jsInjection = `
    <script>
        ${combinedJS}
    </script>`;
    
    finalHTML = finalHTML.replace('</body>', jsInjection + '\n</body>');
    
    // Create dist directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }
    
    // Write final HTML file
    const outputPath = path.join(distDir, 'index.html');
    fs.writeFileSync(outputPath, finalHTML);
    
    console.log(`✅ Build complete! File created at: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

// Run build if this script is executed directly
if (require.main === module) {
    buildSingleHTML();
}

module.exports = buildSingleHTML;