export interface TaskCategory {
  id: string
  name: string
  color: string
  bgColor: string
  borderColor: string
  icon?: string
}

export const TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
    icon: '🍳'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
    icon: '🚿'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-300 dark:border-purple-700',
    icon: '🛏️'
  },
  {
    id: 'living_room',
    name: 'Living Room',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-300 dark:border-green-700',
    icon: '🛋️'
  },
  {
    id: 'office',
    name: 'Office',
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    icon: '💻'
  },
  {
    id: 'shed',
    name: 'Shed/Garage',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-700',
    icon: '🔧'
  },
  {
    id: 'garden',
    name: 'Garden/Yard',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    icon: '🌱'
  },
  {
    id: 'other',
    name: 'Other/General',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-300 dark:border-gray-600',
    icon: '📋'
  }
]

export const getCategoryById = (categoryId: string): TaskCategory => {
  return TASK_CATEGORIES.find(cat => cat.id === categoryId) || TASK_CATEGORIES[0]
}

export const getCategoryColors = (categoryId: string) => {
  const category = getCategoryById(categoryId)
  return {
    text: category.color,
    bg: category.bgColor,
    border: category.borderColor
  }
}