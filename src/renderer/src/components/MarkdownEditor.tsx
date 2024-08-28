import { Split } from '@geoffcox/react-splitter'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { useEffect, useState } from 'react'
import { MdError } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import style from './../assets/markdown-styles.module.css'

export const MarkdownEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [markdown, setMarkdown] = useState('')
  const [saved, setSaved] = useState('Saved')
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (selectedNote) {
      if (selectedNote.content) {
        setMarkdown(selectedNote.content)
        setTitle(selectedNote.title)
      }
    }
  }, [selectedNote?.title])

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl (or Cmd) + S is pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        setSaved('Saving...')
        event.preventDefault() // Prevent the default save dialog
        handleAutoSaving(markdown) // Call your custom function

        setSaved('Saved')
      }
    }

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    setSaved('Auto Saving..')
    // Handle auto-saving every 3 seconds
    const intervalId = setInterval(() => {
      handleAutoSaving(markdown)
      setSaved('Saved')
    }, 1000)

    // Cleanup function to clear the interval when selectedNote.title changes or the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [markdown, selectedNote?.title]) // Dependencies array

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value)
  }

  if (!selectedNote) {
    return (
      <div
        style={{
          fontSize: 22,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: 150
        }}
      >
        <MdError size={100} />
        No notes selected...
      </div>
    )
  }

  return (
    <div style={{ height: '100%', marginTop: 0 }}>
      <Split>
        <div
          style={{
            width: '100%',
            backgroundColor: '#121212',
            height: '100%',
            paddingTop: 0,
            marginTop: 0
          }}
        >
          {/* Fixed Navbar */}
          <div
            style={{
              height: '25px',
              marginTop: 0,
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#282828',
              position: 'sticky', // Makes the navbar stick to the top
              top: 0, // Sticks to the top of the container
              zIndex: 10 // Ensures it's above other content
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 0,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                maxWidth: 'calc(100% - 100px)', // Ensures space for the right span
                overflow: 'hidden' // Ensures content doesn't overflow the container
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgb(9, 136, 66)',
                  borderBottomRightRadius: '10px',
                  borderTopRightRadius: 10,
                  padding: '2px 5px',
                  borderTopLeftRadius: 0,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Code Editor
              </span>

              <span
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '0 10px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: '200px',
                  textOverflow: 'ellipsis'
                }}
              >
                {title}.md
              </span>
            </div>

            <span
              style={{
                textAlign: 'right',
                paddingLeft: '10px',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: 'white',
                color: 'black',
                paddingRight: 10
              }}
            >
              {saved}
            </span>
          </div>

          {/* Main Content Area */}
          <textarea
            style={{
              width: '100%',
              backgroundColor: '#121212',
              height: 'calc(100% - 25px)', // Adjust height considering the navbar
              resize: 'none',
              outline: 'none', // Removes the focus outline.
              padding: 10
            }}
            value={markdown}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div
          style={{
            flex: 1,
            height: '100%',

            overflowX: 'scroll',
            overflowY: 'auto',
            backgroundColor: '#0d1117'
          }}
        >
          <div
            style={{
              height: '25px',
              marginTop: 0,
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#282828',
              position: 'sticky', // Makes the navbar stick to the top
              top: 0, // Sticks to the top of the container
              zIndex: 10 // Ensures it's above other content
            }}
          >
            <span
              style={{
                backgroundColor: 'rgb(9, 136, 66)',
                borderBottomRightRadius: '10px',
                borderTopRightRadius: 10,
                padding: '1px 5px',
                borderTopLeftRadius: 0
              }}
            >
              Markdown Viewer
            </span>
          </div>

          <div
            style={{
              flex: 1,
              height: 'calc(100% - 25px)',
              overflowX: 'auto',
              overflowY: 'auto',
              backgroundColor: '#0d1117'
            }}
          >
            <ReactMarkdown
              children={markdown}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              className={style['markdown-body']}
            />
          </div>
        </div>
      </Split>
    </div>
  )
}
