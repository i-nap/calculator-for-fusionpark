'use client';

import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { BillItemType, GoogleSheetRow, MenuItem, VAT_RATE } from '@/types/type';
import { MenuSearch } from '@/components/ui/menu-search';
import { CurrentBill } from '@/components/ui/current-bill';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function RestaurantCalculator() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItemType[]>([]);

  const fetchAndUpdateMenu = async () => {
    setIsRefreshing(true);
    try {
      const sheetUrl = process.env.NEXT_PUBLIC_SHEET_CSV_URL;
      if (!sheetUrl) {
        throw new Error('NEXT_PUBLIC_SHEET_CSV_URL environment variable is not defined');
      }
      const response = await fetch(sheetUrl);
      const csvData = await response.text();

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as GoogleSheetRow[];
          const formattedData: MenuItem[] = rows
            .filter(row => row['Item Name'])
            .map(row => ({
              id: row['S.N.'],
              name: row['Item Name'],
              category: row['Category'],
              price: Number(row['rate']) || 0,
            }));

          setMenuItems(formattedData);
          localStorage.setItem('restaurant-menu-cache', JSON.stringify(formattedData));
          setIsRefreshing(false);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const clearBill = () => {
    if (window.confirm("Are you sure you want to clear the entire bill?")) {
      setBillItems([]);
    }
  };

  const handlePrint = () => {
    setBillItems([]); //ahela ko lahi 
  };

    useEffect(() => {
      const cachedData = localStorage.getItem('restaurant-menu-cache');
      if (cachedData) {
        setTimeout(() => {
          setMenuItems(JSON.parse(cachedData));
          setIsLoading(false);
        }, 0);
      } else {
        void fetchAndUpdateMenu();
      }
    }, []);

    const filteredMenu = useMemo(() => {
      if (!searchQuery.trim()) return [];

      const normalize = (str: string) =>
        str.toLowerCase().replace(/[^a-z0-9]/g, '');

      const normalizedQuery = normalize(searchQuery);

      return menuItems.filter((menuItem) => {
        const normalizedName = normalize(menuItem.name || "");
        const normalizedCategory = normalize(menuItem.category || "");

        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedCategory.includes(normalizedQuery)
        );
      });
    }, [searchQuery, menuItems]);

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

    if (isLoading) {
      return <div className="flex h-screen items-center justify-center text-lg font-medium text-muted-foreground">Loading Menu...</div>;
    }

    return (
      <div className="max-w-6xl mx-auto p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
          <h1 className="text-xl font-bold">Fusion Park</h1>
          <Button
            onClick={fetchAndUpdateMenu}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh Menu'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            clearBill={clearBill}
            subTotal={subTotal}
            vatAmount={vatAmount}
            grandTotal={grandTotal}
            onPrint={handlePrint}
          />
        </div>
      </div>
    );
  }