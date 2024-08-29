// src/electron.d.ts
export interface ElectronAPI {
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
