import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, ShoppingCart, Star, ChevronLeft, ChevronRight, Minus, Plus, Check, ThumbsUp, Scale, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProductById, getRelatedProducts, Product, Review } from "@/lib/productsData";
import { cartStore } from "@/lib/cartStore";
import { comparisonStore } from "@/lib/comparisonStore";
import { reviewStore, UserReview } from "@/lib/reviewStore";
import { sportsData } from "@/data/sportsData";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";
import { format } from "date-fns";
import { WriteReview } from "@/components/WriteReview";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isInComparison, setIsInComparison] = useState(false);

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setRelatedProducts(getRelatedProducts(foundProduct));
        setSelectedImage(0);
        setQuantity(1);
        setUserReviews(reviewStore.getProductReviews(productId));
        setIsInComparison(comparisonStore.isInComparison(productId));
      }
    }
    setCartCount(cartStore.getItemCount());
  }, [productId]);

  const refreshReviews = () => {
    if (productId) {
      setUserReviews(reviewStore.getProductReviews(productId));
    }
  };

  const handleToggleComparison = () => {
    if (!product) return;
    
    if (isInComparison) {
      comparisonStore.removeItem(product.id);
      setIsInComparison(false);
      sounds.tap();
      haptics.light();
      toast({
        title: "Removed from comparison",
        description: "Product removed from comparison list.",
      });
    } else {
      const result = comparisonStore.addItem(product.id);
      if (result.added) {
        setIsInComparison(true);
        sounds.success();
        haptics.medium();
        toast({
          title: "Added to comparison",
          description: "Product added to comparison list.",
        });
      } else {
        toast({
          title: "Cannot add",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      cartStore.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        sport: product.sport,
      });
    }
    
    setCartCount(cartStore.getItemCount());
    sounds.success();
    haptics.medium();
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const sportName = sportsData.find((s) => s.id === product.sport)?.name || product.sport;
  const allReviews: (Review | UserReview)[] = [...userReviews, ...product.reviews];
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
    : 0;
  const compareCount = comparisonStore.getCount();

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
              <Link to="/products" className="text-sm text-primary font-medium">
                Products
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 relative" 
              onClick={() => navigate("/compare")}
            >
              <Scale className="w-4 h-4" />
              Compare
              {compareCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {compareCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 relative" onClick={() => navigate("/cart")}>
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 animate-fade-in">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <Badge className="absolute top-4 left-4 bg-destructive">Sale</Badge>
              )}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">{sportName}</Badge>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-warning text-warning" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
                </div>
              <span className="text-muted-foreground">({allReviews.length} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="secondary">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.fullDescription}</p>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                variant={isInComparison ? "secondary" : "outline"}
                size="lg"
                className="gap-2"
                onClick={handleToggleComparison}
              >
                <Scale className="w-5 h-5" />
                {isInComparison ? "In Comparison" : "Compare"}
              </Button>
            </div>

            {product.inStock && (
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                In Stock - Ships within 24 hours
              </div>
            )}

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Customer Reviews ({allReviews.length})
          </h2>
          
          {/* Write Review */}
          <div className="mb-8">
            <WriteReview 
              productId={product.id} 
              productName={product.name} 
              onReviewSubmitted={refreshReviews}
            />
          </div>

          {/* User Reviews */}
          {userReviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reviews</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {userReviews.map((review) => (
                  <Card key={review.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{review.userName}</p>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <BadgeCheck className="w-3 h-3" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(review.date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Product Reviews */}
          <div className="grid md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Related Products
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-1">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-foreground">${relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
