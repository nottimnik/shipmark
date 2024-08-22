import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { Titlebar, TitlebarColor } from 'custom-electron-titlebar'
import { contextBridge, ipcRenderer, nativeImage } from 'electron'
import path from 'path'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args)
  })

  // Title bar implementation
  window.addEventListener('DOMContentLoaded', () => {
    const options = {
      icon: nativeImage.createFromPath(path.join(__dirname, './../../resources/icon.png')),
      iconSize: 26,
      backgroundColor: TitlebarColor.fromHex('#121212')
    }

    new Titlebar(options)
  })
  console.log(__dirname)
} catch (error) {
  console.error(error)
}
