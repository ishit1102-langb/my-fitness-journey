import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, ShoppingCart, Star, Filter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sportsData, iconMap } from "@/data/sportsData";
import { allProducts, Product } from "@/lib/productsData";
import { cartStore } from "@/lib/cartStore";
import { wishlistStore } from "@/lib/wishlistStore";
import { ProductSearch } from "@/components/ProductSearch";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";

export default function Products() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    setCartCount(cartStore.getItemCount());
    setWishlistIds(wishlistStore.getWishlist().map((w) => w.id));
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const sportMatch = selectedSport === "all" || product.sport === selectedSport;
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    return sportMatch && categoryMatch;
  });

  const categories = ["all", ...new Set(allProducts.map(p => p.category))];

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sport: product.sport,
    });
    setCartCount(cartStore.getItemCount());
    sounds.success();
    haptics.medium();
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const { wishlist, added } = wishlistStore.toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sport: product.sport,
    });
    setWishlistIds(wishlist.map((w) => w.id));
    sounds.tap();
    haptics.light();
    toast({
      title: added ? "Added to wishlist!" : "Removed from wishlist",
      description: added
        ? `${product.name} has been saved to your wishlist.`
        : `${product.name} has been removed from your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/activity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Activity
              </Link>
              <Link to="/sports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sports Guide
              </Link>
              <span className="text-sm text-primary font-medium">Products</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 relative" onClick={() => navigate("/cart")}>
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Sports Products
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Find the best equipment, apparel, and accessories for your favorite sports.
            </p>
          </div>
          <ProductSearch />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by:</span>
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sportsData.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sport Quick Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <Button
            variant={selectedSport === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSport("all")}
            className="shrink-0"
          >
            All Sports
          </Button>
          {sportsData.slice(0, 10).map((sport) => {
            const IconComponent = iconMap[sport.icon];
            return (
              <Button
                key={sport.id}
                variant={selectedSport === sport.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSport(sport.id)}
                className="shrink-0 gap-2"
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {sport.name}
              </Button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full"
                  onClick={(e) => handleToggleWishlist(e, product)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlistIds.includes(product.id)
                        ? "fill-destructive text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
                {product.originalPrice && (
                  <Badge className="absolute top-3 left-3 bg-destructive">
                    Sale
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {sportsData.find(s => s.id === product.sport)?.name}
                  </Badge>
                  <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!product.inStock}
                    onClick={(e) => handleAddToCart(e, product)}
                    className="gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your filters.</p>
            <Button 
              variant="link" 
              onClick={() => { setSelectedSport("all"); setSelectedCategory("all"); }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
