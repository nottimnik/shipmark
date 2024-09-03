import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

// Function to load notes from the context
// Notes are sorted by the most recent edit time
const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // Sort notes by most recently edited first
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

// Atom representing the list of notes, loaded asynchronously
const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

// Unwrap the async atom to get the resolved value of the notes
export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

// Atom to store the index of the currently selected note, or null if none is selected
export const selectedNoteIndexAtom = atom<number | null>(null)

// Atom that loads the content of the selected note asynchronously
const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  // If no note is selected or notes are not loaded, return null
  if (selectedNoteIndex == null || !notes) return null

  // Get the selected note
  const selectedNote = notes[selectedNoteIndex]

  // Load the content of the selected note
  const noteContent = await window.context.readNote(selectedNote.title)

  // Return the selected note along with its content
  return {
    ...selectedNote,
    content: noteContent
  }
})

// Unwrap the async atom to get the resolved value of the selected note
export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  // If the selected note is null, return a default empty note
  (prev) =>
    prev ?? {
      title: '',
      content: '',
      lastEditTime: Date.now()
    }
)

// Atom to save the currently selected note with new content
export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  // If no note is selected or notes are not loaded, return early
  if (!selectedNote || !notes) return

  // Save the new content to disk
  await window.context.writeNote(selectedNote.title, newContent)

  // Update the last edit time of the saved note
  set(
    notesAtom,
    notes.map((note) => {
      // Update the last edit time of the note that was saved
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }

      // Return the note unchanged if it's not the one being saved
      return note
    })
  )
})

// Atom to create a new empty note
export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  // If notes are not loaded, return early
  if (!notes) return

  // Create a new note and get its title
  const title = await window.context.createNote()

  // If the note creation failed, return early
  if (!title) return

  // Create a new note object
  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  // Add the new note to the list and set it as the selected note
  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  // Set the index of the newly created note as the selected one
  set(selectedNoteIndexAtom, 0)
})

// Atom to delete the currently selected note
export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  // If no note is selected or notes are not loaded, return early
  if (!selectedNote || !notes) return

  // Delete the selected note from disk
  const isDeleted = await window.context.deleteNote(selectedNote.title)

  // If the note deletion failed, return early
  if (!isDeleted) return

  // Remove the deleted note from the list of notes
  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  // Deselect any note after deletion
  set(selectedNoteIndexAtom, null)
})
