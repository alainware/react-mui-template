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

## Installation

First, create a new React (Vite + TS) project.

```bash
npm create vite@latest .
```

Then install the MUI dependencies.

```bash
npm i @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
```

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