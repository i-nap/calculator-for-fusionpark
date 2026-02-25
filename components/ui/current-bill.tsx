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
    clearBill: () => void;
    subTotal: number;
    vatAmount: number;
    grandTotal: number;
    onPrint?: () => void;
}
export function CurrentBill({
    billItems,
    updateQuantity,
    removeEntireItem,
    clearBill,
    subTotal,
    vatAmount,
    grandTotal,
    onPrint
}: CurrentBillProps) {
    return (
        <Card className="h-[80vh] flex flex-col bg-slate-50 dark:bg-slate-900 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Current Bill</CardTitle>
                {billItems.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearBill}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 transition-colors"
                    >
                        Clear All
                    </Button>
                )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 pr-4 mb-4">
                    {billItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-10 gap-2">
                            <div className="rounded-full bg-slate-100 p-3">
                                <Trash2 className="h-6 w-6 text-slate-300" />
                            </div>
                            <p>Bill is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {billItems.map(({ item, quantity }) => (
                                <div key={item.id} className="flex items-center justify-between group">
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
                                        <span className="w-4 text-center text-sm font-mono">{quantity}</span>
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeEntireItem(item.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="mt-auto space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">Rs. {subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (13%)</span>
                        <span className="font-medium">Rs. {vatAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-primary">
                        <span>Grand Total</span>
                        <span>Rs. {grandTotal.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                        <Button
                            className="w-full h-12 text-lg font-semibold"
                            onClick={onPrint}
                            disabled={billItems.length === 0}
                        >
                            Print / Save Bill
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}