import {
  ActionButtonsRow,
  Content,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar
} from '@/components'
import { useRef } from 'react'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <RootLayout>
        <Sidebar className="p-2" style={{ backgroundColor: '#202020' }}>
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>

        <Content
          ref={contentContainerRef}
          className="border-l  border-l-white/20"
          style={{ backgroundColor: '#202020' }}
        >
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
