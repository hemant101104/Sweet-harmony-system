import { useState } from 'react';
import { Sweet } from '@/types/sweet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => Promise<{ success: boolean }>;
  isAdmin?: boolean;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onRestock?: (id: string, quantity: number) => Promise<{ success: boolean }>;
}

const categoryColors: Record<string, string> = {
  Chocolates: 'bg-candy-chocolate/20 text-candy-chocolate',
  Lollipops: 'bg-candy-pink/20 text-candy-pink',
  Fudge: 'bg-candy-gold/20 text-candy-chocolate',
  Gummies: 'bg-candy-mint/20 text-candy-mint',
  Toffee: 'bg-primary/20 text-primary',
  Marshmallows: 'bg-candy-lavender/20 text-candy-lavender',
  Brittle: 'bg-primary/20 text-primary',
};

export function SweetCard({ 
  sweet, 
  onPurchase, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onRestock 
}: SweetCardProps) {
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [restockQty, setRestockQty] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const isOutOfStock = sweet.quantity === 0;
  const categoryColor = categoryColors[sweet.category] || 'bg-secondary text-secondary-foreground';

  const handlePurchase = async () => {
    if (purchaseQty > sweet.quantity) return;
    setIsLoading(true);
    await onPurchase(sweet.id, purchaseQty);
    setPurchaseQty(1);
    setIsLoading(false);
  };

  const handleRestock = async () => {
    if (!onRestock) return;
    setIsLoading(true);
    await onRestock(sweet.id, restockQty);
    setRestockQty(10);
    setIsLoading(false);
  };

  return (
    <div className={cn(
      "card-sweet group relative",
      isOutOfStock && "opacity-75"
    )}>
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold",
          categoryColor
        )}>
          {sweet.category}
        </span>
      </div>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">Out of Stock</p>
          </div>
        </div>
      )}

      {/* Image Placeholder */}
      <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
        <div className="text-6xl animate-float">
          {sweet.category === 'Chocolates' && '🍫'}
          {sweet.category === 'Lollipops' && '🍭'}
          {sweet.category === 'Fudge' && '🧈'}
          {sweet.category === 'Gummies' && '🐻'}
          {sweet.category === 'Toffee' && '🍬'}
          {sweet.category === 'Marshmallows' && '☁️'}
          {sweet.category === 'Brittle' && '🥜'}
          {!['Chocolates', 'Lollipops', 'Fudge', 'Gummies', 'Toffee', 'Marshmallows', 'Brittle'].includes(sweet.category) && '🍭'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {sweet.name}
        </h3>
        
        {sweet.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {sweet.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${Number(sweet.price).toFixed(2)}
          </span>
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-md",
            sweet.quantity > 10 
              ? "bg-candy-mint/20 text-candy-mint" 
              : sweet.quantity > 0 
                ? "bg-candy-gold/20 text-candy-chocolate"
                : "bg-destructive/20 text-destructive"
          )}>
            {sweet.quantity} in stock
          </span>
        </div>

        {/* Purchase Controls */}
        {!isAdmin && !isOutOfStock && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setPurchaseQty(Math.max(1, purchaseQty - 1))}
                disabled={purchaseQty <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="flex-1 text-center font-semibold">{purchaseQty}</span>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setPurchaseQty(Math.min(sweet.quantity, purchaseQty + 1))}
                disabled={purchaseQty >= sweet.quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={handlePurchase}
              disabled={isLoading || isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4" />
              Buy for ${(Number(sweet.price) * purchaseQty).toFixed(2)}
            </Button>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setRestockQty(Math.max(1, restockQty - 5))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="flex-1 text-center font-semibold">+{restockQty}</span>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setRestockQty(restockQty + 5)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="success"
              className="w-full gap-2" 
              onClick={handleRestock}
              disabled={isLoading}
            >
              <Package className="h-4 w-4" />
              Restock +{restockQty}
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEdit?.(sweet)}
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => onDelete?.(sweet.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
