import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { SweetCard } from '@/components/sweets/SweetCard';
import { SweetFilters } from '@/components/sweets/SweetFilters';
import { AddSweetDialog } from '@/components/sweets/AddSweetDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSweets } from '@/hooks/useSweets';
import { Sweet, SweetFilters as Filters } from '@/types/sweet';
import { Loader2, ShieldCheck, Package, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    sweets, 
    categories, 
    isLoading, 
    fetchSweets, 
    restockSweet, 
    addSweet, 
    updateSweet, 
    deleteSweet 
  } = useSweets();
  
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleFilterChange = (filters: Filters) => {
    fetchSweets(filters);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSweet(deleteId);
      setDeleteId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="font-display text-4xl font-bold text-foreground">
                Admin Panel
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage your sweet inventory
            </p>
          </div>
          <AddSweetDialog onAdd={addSweet} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SweetFilters 
            categories={categories} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Sweet Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No sweets found
            </h3>
            <p className="text-muted-foreground">
              Add your first sweet to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet, index) => (
              <div 
                key={sweet.id} 
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SweetCard
                  sweet={sweet}
                  onPurchase={async () => ({ success: false })}
                  isAdmin
                  onEdit={setEditingSweet}
                  onDelete={setDeleteId}
                  onRestock={restockSweet}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      {editingSweet && (
        <AddSweetDialog
          onAdd={addSweet}
          editingSweet={editingSweet}
          onUpdate={updateSweet}
          onClose={() => setEditingSweet(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sweet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
