import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Sweet } from '@/types/sweet';
import { z } from 'zod';
import { toast } from 'sonner';

const sweetSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  category: z.string().trim().min(1, 'Category is required').max(50),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  description: z.string().max(500).nullable(),
});

interface AddSweetDialogProps {
  onAdd: (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean }>;
  editingSweet?: Sweet | null;
  onUpdate?: (id: string, updates: Partial<Sweet>) => Promise<{ success: boolean }>;
  onClose?: () => void;
}

export function AddSweetDialog({ onAdd, editingSweet, onUpdate, onClose }: AddSweetDialogProps) {
  const [open, setOpen] = useState(!!editingSweet);
  const [name, setName] = useState(editingSweet?.name || '');
  const [category, setCategory] = useState(editingSweet?.category || '');
  const [price, setPrice] = useState(editingSweet?.price?.toString() || '');
  const [quantity, setQuantity] = useState(editingSweet?.quantity?.toString() || '0');
  const [description, setDescription] = useState(editingSweet?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingSweet) {
      setOpen(true);
      setName(editingSweet.name);
      setCategory(editingSweet.category);
      setPrice(editingSweet.price.toString());
      setQuantity(editingSweet.quantity.toString());
      setDescription(editingSweet.description || '');
    }
  }, [editingSweet]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setQuantity('0');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = sweetSchema.parse({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description: description || null,
      });

      setIsLoading(true);

      if (editingSweet && onUpdate) {
        const result = await onUpdate(editingSweet.id, {
          name: data.name,
          category: data.category,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
          image_url: null,
        });
        if (result.success) {
          setOpen(false);
          onClose?.();
        }
      } else {
        const result = await onAdd({
          name: data.name,
          category: data.category,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
          image_url: null,
        });
        if (result.success) {
          resetForm();
          setOpen(false);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
      if (!editingSweet) resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editingSweet && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sweet
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chocolate Truffle"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Category *
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Chocolates"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Price ($) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3.99"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Quantity *
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="50"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Delicious handmade treat..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingSweet ? 'Update' : 'Add Sweet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
