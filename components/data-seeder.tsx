'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "../components/ui/switch"

type AmountType = {
  customers: number;
  products: number;
  orders: number;
}

export function DataSeederComponent() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [amounts, setAmounts] = useState<AmountType>({
    customers: 10,
    products: 20,
    orders: 5,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const dataTypes = [
    { id: 'customers' as keyof AmountType, label: 'Customers' },
    { id: 'products' as keyof AmountType, label: 'Products' },
    { id: 'orders' as keyof AmountType, label: 'Orders' },
  ]

  const handleSwitchChange = (type: string, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    )
  }

  const handleAmountChange = (type: keyof AmountType, value: string) => {
    setAmounts(prev => ({ ...prev, [type]: parseInt(value) || 0 }))
  }

  const handleSeed = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          types: selectedTypes, 
          amounts,
        }),
      })
      const data = await response.json()
      setResult(data.message)
    } catch (error) {
      console.error('Error seeding data:', error)
      setResult('Error seeding data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Seed Store Test Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dataTypes.map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Switch
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => handleSwitchChange(type.id, checked)}
              />
              <Label htmlFor={type.id} className="flex-grow">{type.label}</Label>
              <Input
                type="number"
                value={amounts[type.id]}
                onChange={(e) => handleAmountChange(type.id, e.target.value)}
                className="w-20"
                min="1"
              />
            </div>
          ))}
          <Button onClick={handleSeed} disabled={selectedTypes.length === 0 || loading} className="w-full">
            {loading ? 'Seeding...' : 'Seed Selected Data'}
          </Button>
          {result && <p className="text-sm mt-2">{result}</p>}
        </div>
      </CardContent>
    </Card>
  )
}