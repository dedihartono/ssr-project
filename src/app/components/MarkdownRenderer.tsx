import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import { FiCopy, FiCheck } from 'react-icons/fi'

interface MarkdownRendererProps {
  markdown: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({})

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopied((prev) => ({ ...prev, [index]: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, [index]: false })), 2000)
  }

  const renderCodeBlock = ({
    children,
    index,
  }: {
    children: React.ReactNode
    index: number
  }) => (
    <div className="relative group">
      <pre>
        <code>{children}</code>
      </pre>
      <button
        onClick={() => handleCopy(children?.toString() || '', index)}
        className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied[index] ? <FiCheck /> : <FiCopy />}
      </button>
    </div>
  )

  return (
    <ReactMarkdown
      children={markdown}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        code({
          inline,
          className,
          children,
          ...props
        }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeIndex = Math.random() // Generate a unique index for each code block

          return !inline && match ? (
            <div className="markdown-codeblock">
              {renderCodeBlock({ children, index: codeIndex })}
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
    />
  )
}

export default MarkdownRenderer
