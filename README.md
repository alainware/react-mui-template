# Material UI Template

This project contains sample components that implement Material UI library for React (Vite + TypeScript).

## Author

| Author                     |
| -------------------------- |
| Irving Alain Aguilar Perez |

## Index

- [Material UI Template](#material-ui-template)
  - [Author](#author)
  - [Index](#index)
  - [Installation](#installation)
  - [Path Aliases](#path-aliases)

## Installation

First, create a new React (Vite + TS) project.

```bash
npm create vite@latest .
```

Then install the MUI dependencies.

```bash
npm i @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
```

> [!NOTE]
> You should delete `App.css` and `index.css` files as we will not use them in the future (just be sure to delete the references to those file too).

Finally, install the Roboto font into the project and add the CssBaseline component at `main.tsx`.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App.tsx'
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline enableColorScheme />
    <App />
  </StrictMode>,
)
```

You can check if the MUI library is working properly by using the following `App.tsx` example:

```tsx
export default function App () {
  return (
    <>
      <h1>Hello world!</h1>
    </>
  )
}
```

Run the project so you can visualize your first MUI-styled component.

```bash
npm run dev
```

## Path Aliases

This step is not mandatory, but if you want to follow good practices and prevent making a mess with the imports in your application, then you need to apply the following changes to `vite.config.ts` and `tsconfig.app.json`.

Add the following lines to `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
})

```

Add the following lines to `tsconfig.app.json` within `compilerOptions`:

```json
/* Path Aliases */
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

Finally, restart the IDE's TypeScript server (or just restart the IDE) so the changes can take effect.

Now you will have clean imports in your application.

```tsx
// @ = ./src
import { NAV_ITEMS } from "@/config/navigation";
import { BOTTOM_NAV_HEIGHT } from "@/constants/layout";
```