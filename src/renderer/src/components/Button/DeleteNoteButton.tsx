import { ActionButtonProps } from '@/components'
import { deleteNoteAtom } from '@/store'
import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps) => {
  const deleteNote = useSetAtom(deleteNoteAtom)

  const handleDelete = async () => {
    await deleteNote()
  }

  return (
    <button
      className="inline-flex justify-center w-full px-3 py-2 text-white font-medium rounded-md focus:outline-none hover:bg-zinc-600/50"
      onClick={handleDelete}
      {...props}
    >
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </button>
  )
}
