import { useBudget } from "./useBudget"
import { IncomeCard } from "./IncomeCard"
import { CategoryCard } from "./CategoryCard"
import { ReallocationDialog } from "./ReallocationDialog"

export function BudgetPage() {
  const {
    income,
    categories,
    handleIncomeChange,
    addExpense,
    updateExpense,
    deleteExpense,
    reallocateFunds,
    getExpensesByCategory
  } = useBudget()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Manager</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <ReallocationDialog categories={categories} onReallocate={reallocateFunds} />
      </div>

      <IncomeCard income={income} onIncomeChange={handleIncomeChange} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            expenses={getExpensesByCategory(category.id)}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
          />
        ))}
      </div>
    </div>
  )
}