import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IncomeCardProps {
  income: number
  onIncomeChange: (value: string) => void
}

export function IncomeCard({ income, onIncomeChange }: IncomeCardProps) {
  return (
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
              onChange={(e) => onIncomeChange(e.target.value)}
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
  )
}
