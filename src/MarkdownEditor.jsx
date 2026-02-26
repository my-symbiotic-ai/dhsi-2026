import { useRef, useEffect } from 'react'
import { EditorView, keymap, placeholder as cmPlaceholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from '@codemirror/language'

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '0.95rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    minHeight: '160px',
  },
  '&.cm-focused': {
    outline: 'none',
    borderColor: '#4a6fa5',
  },
  '.cm-content': {
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    padding: '0.6rem 0.75rem',
    lineHeight: '1.6',
    minHeight: '140px',
  },
  '.cm-line': {
    padding: '0',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-placeholder': {
    color: '#aaa',
    fontStyle: 'italic',
  },
})

function MarkdownEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        editorTheme,
        cmPlaceholder(placeholder || 'Write your markdown here...'),
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
    // Only create editor on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync external value changes into the editor (e.g. when loading a note)
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (value !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      })
    }
  }, [value])

  return <div ref={containerRef} className="cm-editor-wrapper" />
}

export default MarkdownEditor
