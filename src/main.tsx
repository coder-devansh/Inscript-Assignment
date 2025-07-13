import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExcelToolbar from './components/ExcelToolbar'
import Spreadsheet from './components/ExcelTable'
import App from './App'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
    

  </StrictMode>,
)
