# AI CEO Executive Command Center — Windows Desktop Packaging (MSIX) Guide

This guide details the step-by-step process of converting and packaging your **AI CEO Executive Command Center** into an enterprise-grade Windows Desktop App and installing it on any Windows 10/11 operating system via the official **MSIX** packaging pipeline.

Because compile containers are sandboxed and do not run on native Windows kernels, you cannot output Windows Binary Installers (`.msix` and `.exe`) directly from a web server environment. Instead, you can do this easily on any local development computer using either model below: **The Microsoft PWA Builder Pipeline** or **The Local Electron/Tauri Packagers**.

---

## 🏛️ Method 1: The Microsoft PWABuilder Pipeline (Highly Recommended)
Microsoft maintains **PWABuilder.com**, an official storefront packager that turns modern React/Vite progressive web apps directly into native **MSIX Windows Store Installers** instantly! This is the most industry-standard development cycle used by leading web dashboard startups.

### Step 1: Export your Code from AI Studio
1. Open the **AI Studio Settings / File menu** in the upper-right corner of the browser interface.
2. Select **Export as ZIP** or click the **Export to GitHub** action to secure your project folder.
3. Extract the ZIP workspace on your local desktop machine.

### Step 2: Build the Static React Assets
1. Open your local terminal, navigate to the extracted directory, and run the dependencies installation:
   ```bash
   npm install
   ```
2. Build the optimized production SPA assets:
   ```bash
   npm run build
   ```
   *This bundle is completed instantly inside the local `/dist` directory.*

### Step 3: Run or Deploy Your Web App
PWABuilder packages active URLs into MSIX installers. You can use any of the following hosts:
* **Option A**: Upload your `/dist` static folder to free hosting suites like **Vercel**, **Netlify**, or **GitHub Pages**.
* **Option B**: If running locally, start your dev server:
  ```bash
  npm run dev
  ```

### Step 4: Generate the MSIX Installer on PWABuilder
1. Go to **[https://www.pwabuilder.com/](https://www.pwabuilder.com/)**.
2. Enter your deployed URL (e.g., `https://your-custom-ai-ceo.vercel.app` or local tunnel address) and click **Start**.
3. PWABuilder will automatically ingest the `manifest.json` we prepared for you.
4. Review the details, choose **Build my Windows App**, and customize your App Name to `AI CEO Command Center`.
5. Click **Download** to obtain the official zip archive containing:
   * **`AI_CEO.msix`**: Public installation bundle.
   * **`install.ps1`**: Direct local installer bypassing app store validations.

---

## 💻 Method 2: Local Electron-Builder Compilation
If you wish to package your desktop app completely offline on your local machine to generate custom `.msix` files directly in your development command line:

### Step 1: Install Electron & Packager Tools
Install the development packaging libraries locally in your project folder:
```bash
npm install -D electron electron-builder
```

### Step 2: Create simple Desktop Entrypoint (`electron-main.js`)
Create a fast main-thread script in your root directory named `electron-main.js` to serve your assets:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: "AI CEO Executive Command Center",
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load compiled production React index
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### Step 3: Map `electron-builder` in your `package.json`
Update your local `package.json` with the desktop configuration script:
```json
"build": {
  "appId": "com.aiceo.commandcenter",
  "productName": "AICEO",
  "win": {
    "target": "msix",
    "publisherName": "AI CEO Inc."
  },
  "directories": {
    "output": "dist-desktop"
  }
}
```

### Step 4: Execute Native Compilation
Generate your native desktop system assets:
```bash
npx electron-builder build --windows msix
```
*Your pristine physical `.msix` installer will populate inside the newly compiled `dist-desktop/` folder!*
