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

export interface GoogleSheetRow {
  'S.N.': string;
  'Item Name': string;
  'Category': string;
  'rate': string;
}

export const VAT_RATE = 0.13;