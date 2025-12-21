import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Camera, User, Palette, Check, Package, Heart, Clock, Truck, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";
import { orderStore, Order } from "@/lib/orderStore";
import { wishlistStore, WishlistItem } from "@/lib/wishlistStore";
import { cartStore } from "@/lib/cartStore";
import { sportsData } from "@/data/sportsData";
import { format } from "date-fns";

const themes = [
  { id: "default", name: "Default", primary: "hsl(142, 71%, 45%)", bg: "hsl(0, 0%, 3%)" },
  { id: "ocean", name: "Ocean Blue", primary: "hsl(210, 100%, 50%)", bg: "hsl(210, 50%, 5%)" },
  { id: "sunset", name: "Sunset", primary: "hsl(25, 95%, 53%)", bg: "hsl(25, 30%, 5%)" },
  { id: "purple", name: "Purple", primary: "hsl(270, 70%, 60%)", bg: "hsl(270, 30%, 5%)" },
  { id: "rose", name: "Rose", primary: "hsl(350, 80%, 60%)", bg: "hsl(350, 30%, 5%)" },
  { id: "mint", name: "Mint", primary: "hsl(160, 60%, 50%)", bg: "hsl(160, 30%, 5%)" },
];

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("fittrack_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setName(parsed.name || "");

    // Load saved profile image
    const savedImage = localStorage.getItem("fittrack_profile_image");
    if (savedImage) setProfileImage(savedImage);

    // Load saved theme
    const savedTheme = localStorage.getItem("fittrack_theme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Load orders and wishlist
    setOrders(orderStore.getOrders());
    setWishlist(wishlistStore.getWishlist());
  }, [navigate]);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary.replace('hsl(', '').replace(')', ''));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem("fittrack_profile_image", base64);
        sounds.success();
        haptics.success();
        toast({
          title: "Profile picture updated!",
          description: "Your new profile picture has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name };
      localStorage.setItem("fittrack_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      sounds.success();
      haptics.success();
      toast({
        title: "Profile saved!",
        description: "Your profile has been updated.",
      });
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem("fittrack_theme", themeId);
    applyTheme(themeId);
    sounds.tap();
    haptics.light();
    toast({
      title: "Theme updated!",
      description: `Switched to ${themes.find(t => t.id === themeId)?.name} theme.`,
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    const updated = wishlistStore.removeItem(id);
    setWishlist(updated);
    sounds.tap();
    haptics.light();
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const handleAddToCartFromWishlist = (item: WishlistItem) => {
    cartStore.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      sport: item.sport,
    });
    sounds.success();
    haptics.medium();
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-warning/20 text-warning";
      case "shipped":
        return "bg-primary/20 text-primary";
      case "delivered":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <Check className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (!user) return null;

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
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <span className="text-sm text-primary font-medium">Profile</span>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Customize your profile, view orders, and manage your wishlist</p>
        </div>

        <Tabs defaultValue="profile" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="w-4 h-4" />
              Wishlist ({wishlist.length})
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="opacity-60"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedTheme === theme.id 
                          ? "border-primary shadow-lg shadow-primary/20" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div 
                        className="w-full h-8 rounded-lg mb-2"
                        style={{ background: theme.primary }}
                      />
                      <span className="text-sm font-medium text-foreground">{theme.name}</span>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Start shopping to see your order history here.</p>
                  <Button onClick={() => navigate("/products")}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {order.status !== "delivered" && (
                          <span>Est. delivery: {format(new Date(order.estimatedDelivery), "MMM d, yyyy")}</span>
                        )}
                      </div>
                      <p className="font-bold text-foreground">Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            {wishlist.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">Save items you like to buy them later.</p>
                  <Button onClick={() => navigate("/products")}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {wishlist.map((item) => {
                  const sportName = sportsData.find((s) => s.id === item.sport)?.name || item.sport;
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex gap-4 p-4">
                        <div 
                          className="w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer"
                          onClick={() => navigate(`/products/${item.id}`)}
                        >
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs mb-1">{sportName}</Badge>
                          <h3 
                            className="font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-foreground">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="gap-1 flex-1"
                              onClick={() => handleAddToCartFromWishlist(item)}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
