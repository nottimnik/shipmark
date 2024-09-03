import { DeleteNoteButton, NewNoteButton } from '@/components'
import { ComponentProps } from 'react'
import SortButton from './Button/SortButton'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />

      <div className="flex">
        <SortButton />
        <DeleteNoteButton />
      </div>
    </div>
  )
}
