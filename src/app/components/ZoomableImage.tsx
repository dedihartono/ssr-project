import { useState } from "react"

interface ZoomableImageProps {
  src: string
  alt: string
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openFullscreen = (): void => {
    setIsOpen(true)
  }

  const closeFullscreen = (): void => {
    setIsOpen(false)
  }

  return (
    <div>
      {/* Zoom on Hover */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-md max-w-xs mb-4 transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
        onClick={openFullscreen}
      />

      {/* Fullscreen Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeFullscreen}
        >
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={closeFullscreen}
            >
              &times;
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ZoomableImage
