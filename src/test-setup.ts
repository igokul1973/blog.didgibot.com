// Vitest setup file for Angular testing

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        removeListener: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        addEventListener: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        removeEventListener: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        dispatchEvent: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    })
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {} // eslint-disable-line @typescript-eslint/no-empty-function
    unobserve() {} // eslint-disable-line @typescript-eslint/no-empty-function
    disconnect() {} // eslint-disable-line @typescript-eslint/no-empty-function
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {} // eslint-disable-line @typescript-eslint/no-empty-function
    observe() {} // eslint-disable-line @typescript-eslint/no-empty-function
    unobserve() {} // eslint-disable-line @typescript-eslint/no-empty-function
    disconnect() {} // eslint-disable-line @typescript-eslint/no-empty-function
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
