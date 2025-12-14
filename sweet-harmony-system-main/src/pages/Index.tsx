import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Candy, ShoppingBag, Star, Sparkles, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] text-8xl animate-float opacity-30">🍬</div>
          <div className="absolute top-40 right-[15%] text-6xl animate-float stagger-2 opacity-30">🍭</div>
          <div className="absolute bottom-20 left-[20%] text-7xl animate-float stagger-3 opacity-30">🍫</div>
          <div className="absolute top-32 right-[30%] text-5xl animate-float stagger-4 opacity-30">🧁</div>
          <div className="absolute bottom-40 right-[10%] text-8xl animate-float stagger-5 opacity-30">🍪</div>
        </div>

        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Handcrafted with love
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in stagger-1">
              The Sweetest Shop
              <span className="block text-primary">in Town</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in stagger-2">
              Discover our delicious collection of artisanal chocolates, candies, 
              and confections. Every treat is made with premium ingredients and 
              crafted with care.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
              <Link to="/auth?mode=register">
                <Button size="xl" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="xl" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to bringing you the finest confections with exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Candy,
                title: 'Premium Quality',
                description: 'Every sweet is made with the finest ingredients sourced from around the world',
              },
              {
                icon: Star,
                title: 'Handcrafted',
                description: 'Each treat is carefully crafted by our skilled confectioners with love and attention',
              },
              {
                icon: ShoppingBag,
                title: 'Fresh Daily',
                description: 'Our inventory is restocked daily to ensure you always get the freshest treats',
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-8 shadow-card border border-border/50 text-center group hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-8 left-12 text-5xl">🍫</div>
              <div className="absolute bottom-8 right-12 text-5xl">🍭</div>
            </div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Satisfy Your Sweet Tooth?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of happy customers who trust SweetShop for their 
                confectionery cravings.
              </p>
              <Link to="/auth?mode=register">
                <Button size="xl" variant="candy" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Candy className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">
                Sweet<span className="text-primary">Shop</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SweetShop. Made with 🍬 and love.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
