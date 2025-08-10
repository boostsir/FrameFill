# Image Background Tool 🎨

A simple, powerful tool to add backgrounds to your images. Built with vanilla JavaScript and UIKit, following strict TDD methodology.

## 🌟 Features

- **Upload Images**: Support for JPG, PNG, GIF, WebP (up to 5MB)
- **Custom Sizing**: Set output dimensions (100-2000px)
- **Image Scaling**: Scale images from 25% to 200%
- **Background Colors**: Choose any solid color background
- **Real-time Preview**: See changes instantly
- **Download**: Export as PNG with timestamped filename

## 🚀 Live Demo

Visit the live demo: [https://your-username.github.io/image-filler](https://your-username.github.io/image-filler)

## 📦 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run tests (TDD approach)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build the application
npm run build

# Serve locally for testing
npm run serve
```

### Testing

This project follows strict **Test-Driven Development (TDD)**:
- 43 comprehensive tests
- 90%+ code coverage
- Red → Green → Refactor cycle

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for TDD
npm run test:coverage      # Coverage report
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The project includes GitHub Actions for automatic deployment to GitHub Pages:

1. **Push to main branch** → Automatically triggers deployment
2. **Tests run first** → Deployment only happens if tests pass
3. **Builds and deploys** → Updates GitHub Pages automatically

### Manual Deployment

#### Option 1: Using the deploy script
```bash
npm run deploy
```

#### Option 2: Manual build and upload
```bash
npm run deploy:manual
# Then upload dist/index.html to your hosting service
```

### GitHub Pages Setup

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" / root

2. **First-time setup**:
   ```bash
   # Make sure you're on main branch
   git checkout main
   
   # Run the deploy script
   npm run deploy
   ```

3. **Subsequent deployments**:
   - Just push to main branch
   - GitHub Actions will handle the rest automatically

## 🏗️ Architecture

### Development Structure
```
├── src/
│   ├── js/
│   │   ├── app.js              # Main application
│   │   ├── imageProcessor.js   # Image upload & validation
│   │   ├── canvasRenderer.js   # Canvas drawing & preview
│   │   ├── uiControls.js       # UI controls & events
│   │   └── downloadManager.js  # Download functionality
│   └── index.html              # HTML template
├── tests/                      # Comprehensive test suite
├── dist/                       # Built single HTML file
└── .github/workflows/          # GitHub Actions
```

### Production Build
- **Single HTML file**: `dist/index.html` (~25KB)
- **Zero dependencies** (except UIKit CDN)
- **Pure client-side** - no backend required
- **Works offline** once loaded

## 🧪 TDD Methodology

This project strictly follows Test-Driven Development:

1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green
4. **Repeat**: Continue the cycle

### Test Coverage
- Image upload and validation
- Canvas rendering and preview
- UI controls and interactions
- Download functionality
- Error handling

## 🛠️ Tech Stack

- **HTML5** + **CSS3** + **Vanilla JavaScript ES6**
- **UIKit 3.x** - CSS Framework (CDN)
- **Canvas API** - Image processing
- **File API** - File upload handling
- **Jest** + **jsdom** - Testing framework
- **GitHub Actions** - CI/CD pipeline

## 🔧 Development Scripts

```bash
npm test                # Run tests
npm run test:watch     # TDD watch mode
npm run test:coverage  # Coverage report
npm run build          # Build single HTML file
npm run serve          # Local development server
npm run deploy         # Deploy to GitHub Pages
```

## 📝 Contributing

1. **Fork the repository**
2. **Follow TDD**: Write tests first!
3. **Keep it simple**: This is an MVP
4. **Test everything**: Maintain 80%+ coverage
5. **Submit PR**: Include test results

## 📄 License

MIT License - feel free to use this project however you'd like!

---

**Built with ❤️ using Test-Driven Development**