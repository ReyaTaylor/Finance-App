import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Pencil, Check, X as XIcon } from "lucide-react"
import type { BudgetCategory, Expense } from "./types"

interface CategoryCardProps {
  category: BudgetCategory
  expenses: Expense[]
  onAddExpense: (name: string, amount: number, categoryId: string) => void
  onUpdateExpense: (expenseId: string, name: string, amount: number) => void
  onDeleteExpense: (expenseId: string) => void
}

export function CategoryCard({ category, expenses, onAddExpense, onUpdateExpense, onDeleteExpense }: CategoryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" })
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ name: "", amount: "" })

  const remaining = category.allocated - category.spent

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return
    
    onAddExpense(newExpense.name, parseFloat(newExpense.amount), category.id)
    setNewExpense({ name: "", amount: "" })
    setIsDialogOpen(false)
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
    if (!editValues.name || !editValues.amount) return
    
    onUpdateExpense(expenseId, editValues.name, parseFloat(editValues.amount))
    setEditingExpense(null)
    setEditValues({ name: "", amount: "" })
  }

  return (
    <Card>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {expenses.length === 0 ? (
            <p className="text-xs text-muted-foreground">No expenses added</p>
          ) : (
            <div className="space-y-1">
              {expenses.map((expense) => (
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
                          onClick={() => onDeleteExpense(expense.id)}
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
}
