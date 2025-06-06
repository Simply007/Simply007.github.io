import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'

import 'prismjs/components/prism-java'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'

const CodeHighlighter = ({ language, code }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className="code-highlighter box">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeHighlighter
