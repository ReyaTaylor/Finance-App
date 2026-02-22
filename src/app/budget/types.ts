export interface Expense {
  id: string
  name: string
  amount: number
  categoryId: string
}

export interface BudgetCategory {
  id: string
  name: string
  percentage: number
  allocated: number
  spent: number
  color: string
}
