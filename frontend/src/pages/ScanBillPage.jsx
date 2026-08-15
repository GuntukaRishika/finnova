import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { saveExpenseFromScan, scanReceipt } from '../api/receiptScanApi'
import { getCategories } from '../api/categoryApi'
import ReceiptUploadStep from '../components/scan/ReceiptUploadStep'
import ReceiptReviewForm from '../components/scan/ReceiptReviewForm'

function ScanBillPage() {
  const [categories, setCategories] = useState([])
  const [step, setStep] = useState('upload') // 'upload' | 'review' | 'done'
  const [scanResult, setScanResult] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedExpense, setSavedExpense] = useState(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleScan = async (file) => {
    setIsScanning(true)
    setScanError('')
    try {
      setPreviewUrl(URL.createObjectURL(file))
      const result = await scanReceipt(file)
      setScanResult(result)
      setStep('review')
    } catch (err) {
      setScanError(err.response?.data?.message || 'Could not read this receipt. Please try a clearer photo.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleConfirm = async (data) => {
    setIsSaving(true)
    setSaveError('')
    try {
      const expense = await saveExpenseFromScan(scanResult.id, data)
      setSavedExpense(expense)
      setStep('done')
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Could not save this expense entry.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setPreviewUrl(null)
    setScanResult(null)
    setSavedExpense(null)
    setScanError('')
    setSaveError('')
    setStep('upload')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">Scan Bill</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Turn a receipt photo into an expense</h1>
        <p className="mt-2 text-slate-600">
          Upload a bill, let OCR read the merchant, amount, date and GST, then confirm before saving.
        </p>
      </div>

      <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
        <li className={step === 'upload' ? 'text-rose-600' : ''}>1. Upload</li>
        <span>→</span>
        <li className={step === 'review' ? 'text-rose-600' : ''}>2. Review &amp; edit</li>
        <span>→</span>
        <li className={step === 'done' ? 'text-rose-600' : ''}>3. Saved</li>
      </ol>

      {step === 'upload' && <ReceiptUploadStep onScan={handleScan} isScanning={isScanning} error={scanError} />}

      {step === 'review' && (
        <ReceiptReviewForm
          scanResult={scanResult}
          previewUrl={previewUrl}
          categories={categories}
          onConfirm={handleConfirm}
          onDiscard={handleReset}
          isSaving={isSaving}
          error={saveError}
        />
      )}

      {step === 'done' && savedExpense && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FaCheckCircle className="mx-auto text-4xl text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Expense saved</h2>
          <p className="mt-2 text-slate-600">
            {savedExpense.description || 'Your expense'} of{' '}
            <span className="font-semibold text-slate-900">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(savedExpense.amount)}
            </span>{' '}
            has been added.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl bg-rose-600 px-5 py-3 font-medium text-white transition hover:bg-rose-700"
            >
              Scan another receipt
            </button>
            <Link
              to="/expense"
              className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
            >
              View expenses
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScanBillPage
