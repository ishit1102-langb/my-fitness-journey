import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, X, Star, ShoppingCart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { comparisonStore } from "@/lib/comparisonStore";
import { cartStore } from "@/lib/cartStore";
import { getProductById, Product } from "@/lib/productsData";
import { sportsData } from "@/data/sportsData";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";

export default function Compare() {
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = comparisonStore.getItems();
    setCompareIds(ids);
    setProducts(ids.map((id) => getProductById(id)).filter(Boolean) as Product[]);
  }, []);

  const handleRemove = (productId: string) => {
    const updated = comparisonStore.removeItem(productId);
    setCompareIds(updated);
    setProducts(updated.map((id) => getProductById(id)).filter(Boolean) as Product[]);
    sounds.tap();
    haptics.light();
    toast({
      title: "Removed from comparison",
      description: "Product has been removed from comparison.",
    });
  };

  const handleClearAll = () => {
    comparisonStore.clearAll();
    setCompareIds([]);
    setProducts([]);
    sounds.tap();
    haptics.medium();
  };

  const handleAddToCart = (product: Product) => {
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sport: product.sport,
    });
    sounds.success();
    haptics.medium();
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Get all unique specification keys across products
  const allSpecKeys = [...new Set(products.flatMap((p) => Object.keys(p.specifications)))];
  const allFeatures = [...new Set(products.flatMap((p) => p.features))];

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
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <span className="text-sm text-primary font-medium">Compare</span>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </header>

      <main className="container py-8 relative">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Scale className="w-8 h-8" />
              Compare Products
            </h1>
            <p className="text-muted-foreground mt-2">
              {products.length > 0
                ? `Comparing ${products.length} product${products.length > 1 ? "s" : ""}`
                : "Add products to compare their features"}
            </p>
          </div>
          {products.length > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {products.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="py-16 text-center">
              <Scale className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No products to compare</h2>
              <p className="text-muted-foreground mb-6">
                Add products from the product page to compare their features side by side.
              </p>
              <Button onClick={() => navigate("/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Product Cards Row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(200px, 1fr))` }}>
              {products.map((product) => {
                const sportName = sportsData.find((s) => s.id === product.sport)?.name || product.sport;
                return (
                  <Card key={product.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6 z-10"
                      onClick={() => handleRemove(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <CardContent className="p-4 space-y-3">
                      <div
                        className="aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">{sportName}</Badge>
                      <h3
                        className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="w-full gap-1"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Specifications Comparison */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-semibold text-foreground bg-secondary/50">Specifications</th>
                        {products.map((product) => (
                          <th key={product.id} className="text-left p-4 font-medium text-foreground">
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 font-medium text-foreground bg-secondary/50">Price</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4">
                            <span className="font-bold text-foreground">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                ${product.originalPrice}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 font-medium text-foreground bg-secondary/50">Rating</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-warning text-warning" />
                              <span>{product.rating}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 font-medium text-foreground bg-secondary/50">Category</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-foreground">{product.category}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 font-medium text-foreground bg-secondary/50">In Stock</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4">
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? "Yes" : "No"}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      {allSpecKeys.map((key) => (
                        <tr key={key} className="border-b border-border">
                          <td className="p-4 font-medium text-foreground bg-secondary/50">{key}</td>
                          {products.map((product) => (
                            <td key={product.id} className="p-4 text-foreground">
                              {product.specifications[key] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Features Comparison */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-semibold text-foreground bg-secondary/50">Features</th>
                        {products.map((product) => (
                          <th key={product.id} className="text-center p-4 font-medium text-foreground">
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allFeatures.map((feature) => (
                        <tr key={feature} className="border-b border-border">
                          <td className="p-4 text-foreground bg-secondary/50">{feature}</td>
                          {products.map((product) => (
                            <td key={product.id} className="p-4 text-center">
                              {product.features.includes(feature) ? (
                                <Badge className="bg-success/20 text-success">✓</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
