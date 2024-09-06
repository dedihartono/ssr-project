"use client"

import { useState, DragEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link" // Import Link from Next.js
import ZoomableImage from "./ZoomableImage"
import MarkdownRenderer from "./MarkdownRenderer"
import { FiEye, FiRefreshCw, FiUpload } from "react-icons/fi"
import UploadArea from "./UploadArea"

export const FileUploadDesign = () => {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null) // To store preview URL
  const [fileId, setFileId] = useState<string | null>(null) // To store file ID
  const [fileEnter, setFileEnter] = useState<boolean>(false)
  const [passphraseCode, setPassphraseCode] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false) // To track if passphrase is copied
  const router = useRouter() // Hook to programmatically navigate

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setFileEnter(true)
  }

  const handleDragLeave = () => setFileEnter(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setFileEnter(false)

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i]
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            setFile(file)
            setFilePreview(URL.createObjectURL(file)) // Create preview URL
          }
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i]
        setFile(file)
        setFilePreview(URL.createObjectURL(file)) // Create preview URL
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
      setFilePreview(URL.createObjectURL(files[0])) // Create preview URL
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://api.minitool.my.id/cloud/upload", {
        method: "POST",
        headers: {
          "x-api-key": "NhiW2McX0lb/0gEUfBltogeLDEQ=",
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { passphraseCode, _id, location } = data.files[0]
        console.log(_id)
        setPassphraseCode(passphraseCode)
        setFileId(_id || "")
      } else {
        console.error("File upload failed", response.statusText)
      }
    } catch (error) {
      console.error("File upload failed", error)
    }
  }

  const handleNewUpload = () => {
    setFilePreview(null)
    setFile(null)
  }

  const handleCopyPassphrase = () => {
    if (passphraseCode) {
      navigator.clipboard.writeText(passphraseCode).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
      })
    }
  }

  const markdownContent = `

  \`\`\`bash
    ${passphraseCode}
  \`\`\`
`

  return (
    <div className="container px-4 max-w-2xl mx-auto">
      <UploadArea
        fileEnter={fileEnter}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
      />
      <div className="flex justify-between items-center">
        {/* Image on the left */}
        <div className="flex-1">
          <ZoomableImage
            src={
              "https://th.bing.com/th/id/OIP.2bJ9_f9aKoGCME7ZIff-ZwHaJ4?rs=1&pid=ImgDetMain"
            }
            alt="File preview"
          />
        </div>

        {/* Buttons on the right */}
        <div className="flex flex-col items-center gap-x-4 flex-1">
          <button
            onClick={handleUpload}
            className="px-4 mt-4 flex items-center uppercase py-2 tracking-widest outline-none bg-blue-600 text-white rounded hover:bg-blue-700 transform hover:scale-105 transition duration-300"
          >
            <FiUpload className="mr-2" /> {/* Upload Icon */}
            Upload
          </button>

          <Link
            href={`/preview/${fileId}`} // Link to preview page
            className="px-4 mt-4 flex items-center uppercase py-2 tracking-widest outline-none bg-green-600 text-white rounded hover:bg-green-700 transform hover:scale-105 transition duration-300"
          >
            <FiEye className="mr-2" /> {/* Eye Icon */}
            Preview
          </Link>

          <button
            onClick={handleNewUpload}
            className="px-4 mt-4 flex items-center uppercase py-2 tracking-widest outline-none bg-blue-600 text-white rounded hover:bg-blue-700 transform hover:scale-105 transition duration-300"
          >
            <FiRefreshCw className="mr-2" /> {/* Refresh Icon */}
            New Upload
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p>Passphrase for deleting the image: </p>
        <div className="container mx-auto p-4">
          <MarkdownRenderer
            markdown={`

\`\`\`bash
  ${passphraseCode}
\`\`\`
`}
          />
        </div>
      </div>
    </div>
  )
}

export default FileUploadDesign
