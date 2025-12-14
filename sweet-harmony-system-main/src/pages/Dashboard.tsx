import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { SweetCard } from "@/components/sweets/SweetCard";
import { SweetFilters } from "@/components/sweets/SweetFilters";
import { useSweets } from "@/hooks/useSweets";
import { SweetFilters as Filters } from "@/types/sweet";
import { Loader2, Candy, Package } from "lucide-react";

/* 🔐 JWT helper */
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const {
    sweets,
    categories,
    isLoading,
    fetchSweets,
    purchaseSweet,
  } = useSweets();

  const initialLoadRef = useRef(false);

  /* 🔐 Route protection */
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleFilterChange = useCallback(
    (filters: Filters) => {
      if (
        initialLoadRef.current ||
        filters.search ||
        filters.category !== "all" ||
        filters.minPrice ||
        filters.maxPrice
      ) {
        fetchSweets(filters);
      }
      initialLoadRef.current = true;
    },
    [fetchSweets]
  );

  /* 🔄 Loading state (JWT check is instant, so this is only for sweets) */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Candy className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl font-bold text-foreground">
              Sweet Shop
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Browse our delicious selection of handcrafted treats
          </p>
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
              Try adjusting your filters or check back later
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
                <SweetCard sweet={sweet} onPurchase={purchaseSweet} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
