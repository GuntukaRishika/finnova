import { useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaFileImage, FaTimes, FaSearch } from 'react-icons/fa'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff']
const MAX_SIZE_BYTES = 10 * 1024 * 1024

function ReceiptUploadStep({ onScan, isScanning, error }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [localError, setLocalError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const applyFile = (candidate) => {
    if (!candidate) return
    if (!ALLOWED_TYPES.includes(candidate.type)) {
      setLocalError('Unsupported file type. Please upload a JPEG, PNG, WEBP, BMP, or TIFF image.')
      return
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setLocalError('File is too large. Maximum size is 10MB.')
      return
    }
    setLocalError('')
    setFile(candidate)
  }

  const handleInputChange = (e) => applyFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    applyFile(e.dataTransfer.files?.[0])
  }

  const handleRemove = () => {
    setFile(null)
    setLocalError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleScan = () => {
    if (file) onScan(file)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Scan a bill or receipt</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload a photo of your bill and we&apos;ll extract the merchant, amount, date, and GST automatically.
      </p>

      {(error || localError) && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error || localError}</p>
      )}

      <div className="mt-6">
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
              isDragging ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <FaCloudUploadAlt className="text-4xl text-slate-400" />
            <div>
              <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WEBP, BMP or TIFF · up to 10MB</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/bmp,image/tiff"
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="h-48 w-full rounded-2xl border border-slate-200 object-cover sm:w-48"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FaFileImage className="text-slate-400" />
                <span className="truncate">{file.name}</span>
                <span className="text-slate-400">· {(file.size / 1024 / 1024).toFixed(2)}MB</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaSearch />
                  {isScanning ? 'Scanning receipt...' : 'Scan receipt'}
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isScanning}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaTimes /> Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceiptUploadStep
