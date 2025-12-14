import { useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SweetFilters as Filters } from '@/types/sweet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SweetFiltersProps {
  categories: string[];
  onFilterChange: (filters: Filters) => void;
}

export function SweetFilters({ categories, onFilterChange }: SweetFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFilterChange = useCallback((newSearch: string, newCategory: string, newMinPrice: string, newMaxPrice: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onFilterChange({
        search: newSearch,
        category: newCategory,
        minPrice: newMinPrice ? parseFloat(newMinPrice) : null,
        maxPrice: newMaxPrice ? parseFloat(newMaxPrice) : null,
      });
    }, 300);
  }, [onFilterChange]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    triggerFilterChange(value, category, minPrice, maxPrice);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    triggerFilterChange(search, value, minPrice, maxPrice);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    triggerFilterChange(search, category, value, maxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    triggerFilterChange(search, category, minPrice, value);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({
      search: '',
      category: 'all',
      minPrice: null,
      maxPrice: null,
    });
  };

  const hasActiveFilters = search || category !== 'all' || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-secondary/30 rounded-lg animate-scale-in">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Min Price ($)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Max Price ($)
            </label>
            <Input
              type="number"
              placeholder="99.99"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      )}
    </div>
  );
}
