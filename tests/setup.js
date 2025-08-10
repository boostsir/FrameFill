// Jest setup for DOM testing
Object.defineProperty(window, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    constructor() {
      this.width = 0;
      this.height = 0;
    }
    
    getContext() {
      return {
        fillStyle: '',
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        clearRect: jest.fn()
      };
    }
    
    toBlob(callback, type, quality) {
      const blob = new Blob(['fake-image-data'], { type: type || 'image/png' });
      setTimeout(() => callback(blob), 0);
    }
  }
});

// Mock FileReader
global.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onerror = null;
  }
  
  readAsDataURL(file) {
    setTimeout(() => {
      if (this.onload) {
        this.result = 'data:image/png;base64,fake-base64-data';
        this.onload({ target: this });
      }
    }, 0);
  }
};

// Mock Image constructor
global.Image = class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = '';
    this.width = 100;
    this.height = 100;
  }
  
  set src(value) {
    this._src = value;
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
  
  get src() {
    return this._src;
  }
};

// Mock URL.createObjectURL and revokeObjectURL
global.URL = {
  createObjectURL: jest.fn(() => 'blob:fake-url'),
  revokeObjectURL: jest.fn()
};