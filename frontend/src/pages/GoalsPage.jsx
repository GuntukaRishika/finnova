import { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { addGoal, contributeToGoal, deleteGoal, getGoals, updateGoal } from '../api/goalApi'
import GoalForm from '../components/goal/GoalForm'
import GoalList from '../components/goal/GoalList'

function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const [editingGoal, setEditingGoal] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const formRef = useRef(null)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    getGoals()
      .then((data) => {
        if (!isCancelled) setGoals(data)
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [refreshKey])

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, data)
      } else {
        await addGoal(data)
      }
      setEditingGoal(null)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save this goal.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNew = () => {
    setEditingGoal(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    await deleteGoal(id)
    setRefreshKey((key) => key + 1)
  }

  const handleContribute = async (id, amount) => {
    await contributeToGoal(id, amount)
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Savings goals</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Track what you're saving for</h1>
          <p className="mt-2 text-slate-600">Set a target, log contributions, and watch your progress add up.</p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          <FaPlus /> New goal
        </button>
      </div>

      <div ref={formRef}>
        <GoalForm
          editingGoal={editingGoal}
          onSubmit={handleSubmit}
          onCancel={() => setEditingGoal(null)}
          isSubmitting={isSubmitting}
          error={formError}
        />
      </div>

      <GoalList
        goals={goals}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onContribute={handleContribute}
      />
    </div>
  )
}

export default GoalsPage
