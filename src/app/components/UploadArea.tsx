import { FiUpload } from 'react-icons/fi' // Import the upload icon

const UploadArea = ({
  fileEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange
}: {
  fileEnter: boolean
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${
        fileEnter ? 'border-4 border-blue-500' : 'border-2 border-gray-300'
      } mx-auto bg-white flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
        fileEnter ? 'bg-gray-100' : ''
      }`}
    >
      <label
        htmlFor="file"
        className="h-full flex flex-col items-center justify-center text-center p-4 cursor-pointer"
      >
        <FiUpload className="text-4xl text-blue-600 mb-2" /> {/* Upload Icon */}
        <p className="text-gray-700">Click to upload or drag and drop</p>
      </label>
      <input
        id="file"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default UploadArea
