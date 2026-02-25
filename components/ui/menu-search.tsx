import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import { MenuItem } from '@/types/type';

interface MenuSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMenu: MenuItem[];
  addToBill: (item: MenuItem) => void;
}

export function MenuSearch({ searchQuery, setSearchQuery, filteredMenu, addToBill }: MenuSearchProps) {
  return (
    <Card className="h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle>Menu Items</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          
          {!searchQuery.trim() ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center mt-10">
              Search for an item to begin.
            </div>
          ) : filteredMenu.length === 0 ? (
            <p className="text-center text-muted-foreground mt-4">No items found.</p>
          ) : (
            <div className="space-y-2">
              {filteredMenu.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => addToBill(menuItem)}
                >
                  <div>
                    <p className="font-medium">{menuItem.name}</p>
                    <p className="text-sm text-muted-foreground">Rs. {menuItem.price}</p>
                  </div>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

        </ScrollArea>
      </CardContent>
    </Card>
  );
}