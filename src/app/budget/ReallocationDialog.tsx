import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowRightLeft } from "lucide-react"
import { BudgetCategory } from "./types"

interface ReallocationDialogProps {
  categories: BudgetCategory[]
  onReallocate: (fromId: string, toId: string, amount: number) => boolean
}

export function ReallocationDialog({ categories, onReallocate }: ReallocationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reallocationFrom, setReallocationFrom] = useState("")
  const [reallocationTo, setReallocationTo] = useState("")
  const [reallocationAmount, setReallocationAmount] = useState("")

  const handleReallocate = () => {
    if (!reallocationFrom || !reallocationTo || !reallocationAmount) return

    const amount = parseFloat(reallocationAmount)
    const success = onReallocate(reallocationFrom, reallocationTo, amount)
    
    if (!success) {
      alert("Insufficient funds in source category")
      return
    }

    setReallocationFrom("")
    setReallocationTo("")
    setReallocationAmount("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleReallocate}>Reallocate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
