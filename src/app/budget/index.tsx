import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, ArrowRightLeft, Pencil, Check, X as XIcon } from "lucide-react"

interface Expense {
  id: string
  name: string
  amount: number
  categoryId: string
}

interface BudgetCategory {
  id: string
  name: string
  percentage: number
  allocated: number
  spent: number
  color: string
}

export function BudgetPage() {
  const [income, setIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "expenses", name: "Fixed Expenses", percentage: 60, allocated: 0, spent: 0, color: "bg-blue-500" },
    { id: "wants", name: "Wants", percentage: 10, allocated: 0, spent: 0, color: "bg-purple-500" },
    { id: "save", name: "Save/Invest", percentage: 10, allocated: 0, spent: 0, color: "bg-green-500" },
    { id: "debt", name: "Debt", percentage: 10, allocated: 0, spent: 0, color: "bg-orange-500" },
    { id: "donations", name: "Donations & Giving", percentage: 10, allocated: 0, spent: 0, color: "bg-pink-500" },
  ])

  const [newExpense, setNewExpense] = useState({ name: "", amount: "", categoryId: "" })
  const [reallocationFrom, setReallocationFrom] = useState("")
  const [reallocationTo, setReallocationTo] = useState("")
  const [reallocationAmount, setReallocationAmount] = useState("")
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isReallocationDialogOpen, setIsReallocationDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ name: "", amount: "" })

  const handleIncomeChange = (value: string) => {
    const incomeValue = parseFloat(value) || 0
    setIncome(incomeValue)
    
    const updatedCategories = categories.map(cat => ({
      ...cat,
      allocated: (incomeValue * cat.percentage) / 100
    }))
    setCategories(updatedCategories)
  }

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.categoryId) return

    const expense: Expense = {
      id: Date.now().toString(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      categoryId: newExpense.categoryId
    }

    setExpenses([...expenses, expense])
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === newExpense.categoryId) {
        return { ...cat, spent: cat.spent + expense.amount }
      }
      return cat
    })
    setCategories(updatedCategories)

    setNewExpense({ name: "", amount: "", categoryId: "" })
    setIsExpenseDialogOpen(false)
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

  const startEditExpense = (expense: Expense) => {
    setEditingExpense(expense.id)
    setEditValues({ name: expense.name, amount: expense.amount.toString() })
  }

  const cancelEditExpense = () => {
    setEditingExpense(null)
    setEditValues({ name: "", amount: "" })
  }

  const saveEditExpense = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId)
    if (!expense || !editValues.name || !editValues.amount) return

    const oldAmount = expense.amount
    const newAmount = parseFloat(editValues.amount)

    const updatedExpenses = expenses.map(e => 
      e.id === expenseId 
        ? { ...e, name: editValues.name, amount: newAmount }
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

    setEditingExpense(null)
    setEditValues({ name: "", amount: "" })
  }

  const reallocateFunds = () => {
    if (!reallocationFrom || !reallocationTo || !reallocationAmount) return

    const amount = parseFloat(reallocationAmount)
    const fromCategory = categories.find(c => c.id === reallocationFrom)
    
    if (!fromCategory || fromCategory.allocated - fromCategory.spent < amount) {
      alert("Insufficient funds in source category")
      return
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === reallocationFrom) {
        return { ...cat, allocated: cat.allocated - amount }
      }
      if (cat.id === reallocationTo) {
        return { ...cat, allocated: cat.allocated + amount }
      }
      return cat
    })

    setCategories(updatedCategories)
    setReallocationFrom("")
    setReallocationTo("")
    setReallocationAmount("")
    setIsReallocationDialogOpen(false)
  }

  const getExpensesByCategory = (categoryId: string) => {
    return expenses.filter(e => e.categoryId === categoryId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Manager</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <Dialog open={isReallocationDialogOpen} onOpenChange={setIsReallocationDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Reallocate Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reallocate Funds</DialogTitle>
              <DialogDescription>Move surplus funds between categories</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>From Category</Label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={reallocationFrom}
                  onChange={(e) => setReallocationFrom(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (Available: ${(cat.allocated - cat.spent).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>To Category</Label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={reallocationTo}
                  onChange={(e) => setReallocationTo(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c.id !== reallocationFrom).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={reallocationAmount}
                  onChange={(e) => setReallocationAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReallocationDialogOpen(false)}>Cancel</Button>
              <Button onClick={reallocateFunds}>Reallocate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
          <CardDescription>Enter your total monthly income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="income">Income Amount</Label>
              <Input
                id="income"
                type="number"
                placeholder="0.00"
                value={income || ""}
                onChange={(e) => handleIncomeChange(e.target.value)}
                className="text-2xl font-bold"
              />
            </div>
            {income > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Allocated</p>
                <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const remaining = category.allocated - category.spent
          const categoryExpenses = getExpensesByCategory(category.id)
          
          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant="secondary">{category.percentage}%</Badge>
                </div>
                <CardDescription>
                  Allocated: ${category.allocated.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent</span>
                    <span className="font-semibold">${category.spent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${remaining.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expenses</span>
                    <Dialog open={isExpenseDialogOpen && newExpense.categoryId === category.id} onOpenChange={(open) => {
                      setIsExpenseDialogOpen(open)
                      if (open) setNewExpense({ ...newExpense, categoryId: category.id })
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setNewExpense({ name: "", amount: "", categoryId: category.id })}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Expense to {category.name}</DialogTitle>
                          <DialogDescription>Add a planned expense to this category</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="expense-name">Expense Name</Label>
                            <Input
                              id="expense-name"
                              placeholder="e.g., Rent, Groceries"
                              value={newExpense.name}
                              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="expense-amount">Amount</Label>
                            <Input
                              id="expense-amount"
                              type="number"
                              placeholder="0.00"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>Cancel</Button>
                          <Button onClick={addExpense}>Add Expense</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {categoryExpenses.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No expenses added</p>
                  ) : (
                    <div className="space-y-1">
                      {categoryExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                          {editingExpense === expense.id ? (
                            <>
                              <Input
                                value={editValues.name}
                                onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                className="h-7 text-sm flex-1 mr-2"
                                placeholder="Name"
                              />
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={editValues.amount}
                                  onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                                  className="h-7 text-sm w-20"
                                  placeholder="0.00"
                                />
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={() => saveEditExpense(expense.id)}
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={cancelEditExpense}
                                >
                                  <XIcon className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span>{expense.name}</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">${expense.amount.toFixed(2)}</span>
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={() => startEditExpense(expense)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={() => deleteExpense(expense.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}