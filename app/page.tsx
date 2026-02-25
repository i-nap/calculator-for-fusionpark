'use client';

import { CurrentBill } from '@/components/ui/current-bill';
import { MenuSearch } from '@/components/ui/menu-search';
import { BillItemType, MenuItem, MOCK_MENU, VAT_RATE } from '@/types/type';
import { useState, useMemo } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItemType[]>([]);

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return MOCK_MENU.filter((menuItem) =>
      menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const subTotal = billItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const vatAmount = subTotal * VAT_RATE;
  const grandTotal = subTotal + vatAmount;

  const addToBill = (menuItem: MenuItem) => {
    setBillItems((prev) => {
      const existing = prev.find((b) => b.item.id === menuItem.id);
      if (existing) {
        return prev.map((b) =>
          b.item.id === menuItem.id ? { ...b, quantity: b.quantity + 1 } : b
        );
      }
      return [...prev, { item: menuItem, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setBillItems((prev) =>
      prev.map((b) => {
        if (b.item.id === id) {
          const newQuantity = b.quantity + delta;
          return { ...b, quantity: Math.max(0, newQuantity) };
        }
        return b;
      }).filter((b) => b.quantity > 0)
    );
  };

  const removeEntireItem = (id: string) => {
    setBillItems((prev) => prev.filter((b) => b.item.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto p-4">
      <MenuSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMenu={filteredMenu}
        addToBill={addToBill}
      />
      
      <CurrentBill 
        billItems={billItems}
        updateQuantity={updateQuantity}
        removeEntireItem={removeEntireItem}
        subTotal={subTotal}
        vatAmount={vatAmount}
        grandTotal={grandTotal}
      />
    </div>
  );
}