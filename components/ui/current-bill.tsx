import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { BillItemType } from '@/types/type';

interface CurrentBillProps {
  billItems: BillItemType[];
  updateQuantity: (id: string, delta: number) => void;
  removeEntireItem: (id: string) => void;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
}

export function CurrentBill({ billItems, updateQuantity, removeEntireItem, subTotal, vatAmount, grandTotal }: CurrentBillProps) {
  return (
    <Card className="h-[80vh] flex flex-col bg-slate-50 dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Current Bill</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        
        <ScrollArea className="flex-1 pr-4 mb-4">
          {billItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground mt-10">
              Bill is empty
            </div>
          ) : (
            <div className="space-y-4">
              {billItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rs. {item.price} x {quantity} = Rs. {item.price * quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center text-sm">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-7 w-7 ml-2" onClick={() => removeEntireItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-auto space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rs. {subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (13%)</span>
            <span>Rs. {vatAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>Rs. {grandTotal.toFixed(2)}</span>
          </div>
          
          <Button className="w-full mt-4" size="lg" disabled={billItems.length === 0}>
            Print / Save Bill
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}