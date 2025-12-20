import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Camera, User, Palette, Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";

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
      <main className="container py-8 relative max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Customize your profile and app appearance</p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
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
          <Card className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
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
          <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
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
        </div>
      </main>
    </div>
  );
}
