import { useState } from "react"
import type { BudgetCategory, Expense } from "./types"

export function useBudget() {
  const [income, setIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "expenses", name: "Fixed Expenses", percentage: 60, allocated: 0, spent: 0, color: "bg-blue-500" },
    { id: "wants", name: "Wants", percentage: 10, allocated: 0, spent: 0, color: "bg-purple-500" },
    { id: "save", name: "Save/Invest", percentage: 10, allocated: 0, spent: 0, color: "bg-green-500" },
    { id: "debt", name: "Debt", percentage: 10, allocated: 0, spent: 0, color: "bg-orange-500" },
    { id: "donations", name: "Donations & Giving", percentage: 10, allocated: 0, spent: 0, color: "bg-pink-500" },
  ])

  const handleIncomeChange = (value: string) => {
    const incomeValue = parseFloat(value) || 0
    setIncome(incomeValue)
    
    const updatedCategories = categories.map(cat => ({
      ...cat,
      allocated: (incomeValue * cat.percentage) / 100
    }))
    setCategories(updatedCategories)
  }

  const addExpense = (name: string, amount: number, categoryId: string) => {
    const expense: Expense = {
      id: Date.now().toString(),
      name,
      amount,
      categoryId
    }

    setExpenses([...expenses, expense])
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, spent: cat.spent + amount }
      }
      return cat
    })
    setCategories(updatedCategories)
  }

  const updateExpense = (expenseId: string, name: string, newAmount: number) => {
    const expense = expenses.find(e => e.id === expenseId)
    if (!expense) return

    const oldAmount = expense.amount

    const updatedExpenses = expenses.map(e => 
      e.id === expenseId 
        ? { ...e, name, amount: newAmount }
        : e
    )
    setExpenses(updatedExpenses)

    const updatedCategories = categories.map(cat => {
      if (cat.id === expense.categoryId) {
        return { ...cat, spent: cat.spent - oldAmount + newAmount }
      }
      return cat
    })
    setCategories(updatedCategories)
  }

  const deleteExpense = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId)
    if (!expense) return

    setExpenses(expenses.filter(e => e.id !== expenseId))
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === expense.categoryId) {
        return { ...cat, spent: cat.spent - expense.amount }
      }
      return cat
    })
    setCategories(updatedCategories)
  }

  const reallocateFunds = (fromId: string, toId: string, amount: number) => {
    const fromCategory = categories.find(c => c.id === fromId)
    
    if (!fromCategory || fromCategory.allocated - fromCategory.spent < amount) {
      return false
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === fromId) {
        return { ...cat, allocated: cat.allocated - amount }
      }
      if (cat.id === toId) {
        return { ...cat, allocated: cat.allocated + amount }
      }
      return cat
    })

    setCategories(updatedCategories)
    return true
  }

  const getExpensesByCategory = (categoryId: string) => {
    return expenses.filter(e => e.categoryId === categoryId)
  }

  return {
    income,
    expenses,
    categories,
    handleIncomeChange,
    addExpense,
    updateExpense,
    deleteExpense,
    reallocateFunds,
    getExpensesByCategory
  }
}
