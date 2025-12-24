import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, ShoppingCart, Trash2, Minus, Plus, CreditCard, ShieldCheck, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartStore, CartItem } from "@/lib/cartStore";
import { orderStore } from "@/lib/orderStore";
import { sportsData } from "@/data/sportsData";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    setCart(cartStore.getCart());
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cartStore.updateQuantity(id, quantity);
    setCart(updatedCart);
    haptics.light();
  };

  const removeItem = (id: string) => {
    const updatedCart = cartStore.removeItem(id);
    setCart(updatedCart);
    sounds.tap();
    haptics.medium();
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "fittrack10") {
      setPromoApplied(true);
      sounds.success();
      haptics.success();
      toast({
        title: "Promo applied!",
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Save order to history
    const order = orderStore.addOrder({
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      discount,
      shipping,
      total,
    });
    
    // Send email notification
    const userData = localStorage.getItem("fittrack_user");
    if (userData) {
      const user = JSON.parse(userData);
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            orderId: order.id,
            status: "processing",
            items: order.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: order.total,
            estimatedDelivery: order.estimatedDelivery,
          }),
        });
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }
    }
    
    setLastOrderId(order.id);
    cartStore.clearCart();
    setCart([]);
    setIsCheckingOut(false);
    setOrderComplete(true);
    sounds.celebration();
    haptics.celebration();
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 gradient-glow pointer-events-none" />
        <div className="container py-16 relative">
          <div className="max-w-lg mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been placed successfully and you'll receive a confirmation email shortly.
            </p>
            {lastOrderId && (
              <p className="text-sm text-primary font-medium mb-8">Order ID: {lastOrderId}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                View Order History
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <span className="text-sm text-primary font-medium">Cart</span>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </header>

      <main className="container py-8 relative">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8 animate-fade-in">
          Shopping Cart
          {cart.length > 0 && (
            <span className="text-muted-foreground font-normal ml-2">
              ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
          )}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items yet.</p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 animate-fade-in">
              {cart.map((item) => {
                const sportName = sportsData.find((s) => s.id === item.sport)?.name || item.sport;
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Badge variant="outline" className="text-xs mb-1">{sportName}</Badge>
                              <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.originalPrice && (
                                <p className="text-xs text-muted-foreground line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={promoApplied || !promoCode}
                      >
                        {promoApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Try "FITTRACK10" for 10% off</p>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {subtotal < 100 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(100 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Checkout
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="w-4 h-4 text-primary" />
                      Fast Delivery
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
