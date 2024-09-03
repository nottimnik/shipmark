import { markdown as mark, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorView, ViewUpdate } from '@codemirror/view' // Import ViewUpdate
import { Split } from '@geoffcox/react-splitter'
import { tags as t } from '@lezer/highlight'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { createTheme } from '@uiw/codemirror-themes'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useMemo, useState } from 'react'
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
  const [font, setFont] = useState(16)

  const myTheme = useMemo(
    () =>
      createTheme({
        theme: 'dark',
        settings: {
          background: '#121212',
          backgroundImage: '#121212',
          foreground: 'white',

          selection: '#242424 ',
          selectionMatch: '#242424 ',
          lineHighlight: '#242424 ',
          gutterBackground: '#121212',
          gutterForeground: 'white',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial",
          fontSize: `${font}px`
        },
        styles: [
          { tag: t.comment, color: '#d5d9df' },
          { tag: t.heading, color: 'rgb(48, 186, 120)' },
          { tag: t.contentSeparator, color: 'rgb(255, 255, 0)' },
          { tag: t.list, color: 'rgb(255, 174, 215)' },
          { tag: t.quote, color: 'rgb(64,128,128)' },
          { tag: t.emphasis, color: 'rgb(167, 167, 167)' },
          { tag: t.strong, color: 'rgb(167, 167, 167)' },
          { tag: t.link, color: 'rgb(128, 128, 255)' },
          { tag: t.monospace, color: 'rgb(167, 167, 167)' },
          { tag: t.strikethrough, color: 'rgb(167, 167, 167)' }
        ]
      }),
    [font]
  )

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

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setMarkdown(value)
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
          <CodeMirror
            extensions={[mark({ base: markdownLanguage }), EditorView.lineWrapping]}
            style={{
              width: '100%',
              height: 'calc(100% - 25px)', // Full height
              backgroundColor: '#121212',
              resize: 'none',
              outline: 'none', // Removes the focus outline.
              whiteSpace: 'pre-wrap', // Ensure text wraps within the editor
              wordBreak: 'break-word',
              fontSize: 16,
              overflowY: 'auto'
            }}
            value={markdown}
            theme={myTheme}
            onBlur={handleBlur}
            onChange={handleChange} // Use the modified handleChange function here
          />

          {/* <textarea
            style={{
              width: '100%',
              backgroundColor: '#121212',
              height: 'calc(100% - 25px)', // Adjust height considering the navbar
              resize: 'none',
              outline: 'none', // Removes the focus outline.
              padding: 10
            }}

            value={markdown}
            onBlur={handleBlur}
          /> */}
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
