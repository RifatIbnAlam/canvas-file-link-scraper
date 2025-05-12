# Canvasclump

Canvasclump is a chrome extension that allows users to select links on canvas file page. This extension only works for USU pages at this time. Inspired by [LinkClump](https://github.com/benblack86/linkclump).

## Installation

Clone the repository, open it, and run:

```bash
npm run build
```

Open the dist folder in chrome as a unpacked extension.

## Usage

The hotkey for the Canvasclump is CTRL+SHIFT+U or click on the extension icon and press the get links button. Users can change settings and can see a list of previously copied links.

## External Libraries Used

1. [@formkit/auto-animate](https://www.npmjs.com/package/@formkit/auto-animate): Used for list animations.
2. [lucide-react](https://www.npmjs.com/package/lucide-react): Icon library
3. [react](https://www.npmjs.com/package/react): Javascript library for building user interfaces.
4. [react-dom](https://www.npmjs.com/package/react-dom): Entry point for react to access DOM.
5. [react-router-dom](https://www.npmjs.com/package/react-router-dom): Router for react, used when building applications with multiple pages.
6. [use-chrome-storage](https://www.npmjs.com/package/use-chrome-storage): React hook to access google chrome plugin storage easily.

### Development External Libraries Used

1. [@types/chrome](https://www.npmjs.com/package/@types/chrome): Typescript types for chrome.
2. [@types/react](https://www.npmjs.com/package/@types/react): Typescript types for react.
3. [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): Typescript types for react-dom.
4. [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react): Plugin to support local vite react development
5. [autoprefixer](https://www.npmjs.com/package/autoprefixer): Postcss plugin to parse css.
6. [postcss](https://www.npmjs.com/package/postcss): Transforms css with js plugins.
7. [tailwindcss](https://www.npmjs.com/package/tailwindcss): Utility first CSS framework.
8. [typescript](https://www.npmjs.com/package/typescript): Language that adds optional types to javascript.
9. [vite](https://www.npmjs.com/package/vite): Local development server and build tool for web development.

## Process

There are two parts to this extension - the frontend UI that the user interfaces with and the extension code that runs in the background and on the webpage. When the extension is run a `background.js` file is loaded. This file listens for the hotkey `CMD-SHIFT-U` and runs the `getLinks()` on that webpage. The data is then saved inside of chrome extension sync storage which is saved across chrome sessions.

## Version

### 1.0.0

All initial functionality added.

### 1.1.0

Changed hot key to `CMD-SHIFT-U` and some small UI updates.
