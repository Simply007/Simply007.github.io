import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

import 'prismjs/components/prism-java'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-powershell'

const CodeHighlighter = ({ language, code }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className="code-highlighter">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeHighlighter
