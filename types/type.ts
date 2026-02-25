export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface BillItemType {
  item: MenuItem;
  quantity: number;
}

export const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Pork Skewers', price: 450, category: 'Appetizer' },
  { id: '2', name: 'Steamed Dumplings', price: 200, category: 'Appetizer' },
  { id: '3', name: 'Mutton Curry', price: 650, category: 'Main' },
  { id: '4', name: 'Fried Rice', price: 250, category: 'Main' },
  { id: '5', name: 'Cold Coffee', price: 180, category: 'Beverage' },
];

export const VAT_RATE = 0.13;