import '@mdxeditor/editor/style.css'
import 'katex/dist/katex.min.css' // Import KaTeX CSS for proper styling

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
