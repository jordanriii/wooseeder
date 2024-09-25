'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "../components/ui/switch"
import { CheckCircle, XCircle } from 'lucide-react'

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
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

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
      console.log('API Response:', data) // Log the entire response
      
      // Ensure we're correctly interpreting the API response
      if (response.ok && !data.error) {
        setResult({ success: true, message: data.message || 'Data seeded successfully.' })
      } else {
        setResult({ success: false, message: data.error || 'Error seeding data. Please try again.' })
      }
    } catch (error) {
      console.error('Error seeding data:', error)
      setResult({ success: false, message: 'Error seeding data. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null
    console.log('Rendering result:', result) // Keep this for debugging

    if (result.success) {
      return (
        <div className="mt-4 p-4 bg-green-100 rounded-md flex items-center justify-center">
          <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
          <p className="text-green-700 font-medium">{result.message}</p>
        </div>
      )
    } else {
      return (
        <div className="mt-4 p-4 bg-red-100 rounded-md flex items-center justify-center">
          <XCircle className="text-red-500 h-5 w-5 mr-2" />
          <p className="text-red-700 font-medium">{result.message}</p>
        </div>
      )
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
          {renderResult()}
        </div>
      </CardContent>
    </Card>
  )
}