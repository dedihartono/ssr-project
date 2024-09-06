"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import ZoomableImage from "./ZoomableImage"
import { FiArrowLeft, FiTrash2 } from "react-icons/fi" // Import icons
import Swal from "sweetalert2" // Import SweetAlert2

export const FilePreview = () => {
  const { id } = useParams<{ id: string }>()
  const [file, setFile] = useState<Blob | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`https://api.minitool.my.id/cloud/${id}`, {
          method: "GET",
          headers: {
            "x-api-key": "NhiW2McX0lb/0gEUfBltogeLDEQ=",
          },
        })

        if (response.ok) {
          const data = await response.json()
          const fileBlob = await fetch(
            `https://api.minitool.my.id/cloud/files/${data?.file?.path}`,
            {
              method: "GET",
              headers: {
                "x-api-key": "NhiW2McX0lb/0gEUfBltogeLDEQ=",
              },
            }
          ).then((res) => res.blob())
          setFile(fileBlob)
          setFileType(data?.file?.type || "application/octet-stream")
          setFileUrl(URL.createObjectURL(fileBlob))
        } else {
          setError("File not found or failed to load.")
        }
      } catch (error) {
        setError("An error occurred while fetching the file.")
      }
    }

    if (id) {
      fetchFile()
    }
  }, [id])

  const handleDelete = async () => {
    const { value: passphraseCode } = await Swal.fire({
      title: "Confirm Deletion",
      text: "Please enter the passphrase code to confirm deletion:",
      input: "text",
      inputPlaceholder: "Enter passphrase code",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a passphrase code!"
        }
      },
    })

    if (passphraseCode) {
      try {
        const response = await fetch(
          `https://api.minitool.my.id/cloud/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": "NhiW2McX0lb/0gEUfBltogeLDEQ=",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ passphraseCode }),
          }
        )

        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "File has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            router.push("/") // Redirect to the home page or another page
          })
        } else {
          const errorData = await response.json()
          Swal.fire({
            title: "Error!",
            text: `Failed to delete file: ${errorData.message}`,
            icon: "error",
            confirmButtonText: "OK",
          })
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting the file.",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    }
  }

  return (
    <div className="container px-4 max-w-2xl mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      {fileUrl && fileType && (
        <div className="flex justify-between items-center mt-5">
          <div className="flex-1">
            {fileType.startsWith("image/") ? (
              <ZoomableImage src={fileUrl} alt="File preview" />
            ) : fileType.startsWith("video/") ? (
              <video controls className="rounded-md w-full max-w-xs h-full">
                <source src={fileUrl} type={fileType} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Preview not available for this file type.</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-y-4 flex-shrink-0">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 flex items-center uppercase tracking-widest outline-none bg-gray-600 text-white rounded hover:bg-gray-700 transform hover:scale-105 transition duration-300"
            >
              <FiArrowLeft className="mr-2" /> {/* Back Icon */}
              Back
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 flex items-center uppercase tracking-widest outline-none bg-red-600 text-white rounded hover:bg-red-700 transform hover:scale-105 transition duration-300"
            >
              <FiTrash2 className="mr-2" /> {/* Trash Icon */}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilePreview
