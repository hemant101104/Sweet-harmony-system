import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sweet, SweetFilters } from '@/types/sweet';
import { toast } from 'sonner';

export function useSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchSweets = useCallback(async (filters?: SweetFilters) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('sweets')
        .select('*')
        .order('name');

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSweets(data as Sweet[]);
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast.error('Failed to load sweets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sweets')
        .select('category')
        .order('category');

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const purchaseSweet = useCallback(async (sweetId: string, quantity: number = 1) => {
    try {
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', sweetId)
        .single();

      if (fetchError) throw fetchError;

      if (sweet.quantity < quantity) {
        toast.error('Not enough stock available');
        return { success: false };
      }

      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity - quantity })
        .eq('id', sweetId);

      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: purchaseError } = await supabase
          .from('purchases')
          .insert({
            user_id: user.id,
            sweet_id: sweetId,
            quantity: quantity,
            total_price: sweet.price * quantity,
          });

        if (purchaseError) throw purchaseError;
      }

      await fetchSweets();
      toast.success(`Successfully purchased ${quantity} ${sweet.name}!`);
      return { success: true };
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      toast.error('Failed to complete purchase');
      return { success: false };
    }
  }, [fetchSweets]);

  const restockSweet = useCallback(async (sweetId: string, quantity: number) => {
    try {
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('quantity, name')
        .eq('id', sweetId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity + quantity })
        .eq('id', sweetId);

      if (updateError) throw updateError;

      await fetchSweets();
      toast.success(`Restocked ${sweet.name} with ${quantity} units`);
      return { success: true };
    } catch (error) {
      console.error('Error restocking sweet:', error);
      toast.error('Failed to restock sweet');
      return { success: false };
    }
  }, [fetchSweets]);

  const addSweet = useCallback(async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('sweets')
        .insert(sweet);

      if (error) throw error;

      await fetchSweets();
      await fetchCategories();
      toast.success('Sweet added successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error adding sweet:', error);
      toast.error('Failed to add sweet');
      return { success: false };
    }
  }, [fetchSweets, fetchCategories]);

  const updateSweet = useCallback(async (id: string, updates: Partial<Sweet>) => {
    try {
      const { error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchSweets();
      await fetchCategories();
      toast.success('Sweet updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error updating sweet:', error);
      toast.error('Failed to update sweet');
      return { success: false };
    }
  }, [fetchSweets, fetchCategories]);

  const deleteSweet = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSweets();
      await fetchCategories();
      toast.success('Sweet deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting sweet:', error);
      toast.error('Failed to delete sweet');
      return { success: false };
    }
  }, [fetchSweets, fetchCategories]);

  useEffect(() => {
    fetchSweets();
    fetchCategories();
  }, [fetchSweets, fetchCategories]);

  return {
    sweets,
    categories,
    isLoading,
    fetchSweets,
    purchaseSweet,
    restockSweet,
    addSweet,
    updateSweet,
    deleteSweet,
  };
}
