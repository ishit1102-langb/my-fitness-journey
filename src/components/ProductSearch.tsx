import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allProducts, Product } from "@/lib/productsData";
import { useNavigate } from "react-router-dom";

interface ProductSearchProps {
  onSelect?: (product: Product) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const lowerQuery = query.toLowerCase();
      const filtered = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery("");
    setIsOpen(false);
    if (onSelect) {
      onSelect(product);
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground truncate">{product.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-foreground">${product.price}</p>
                {product.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice}
                  </p>
                )}
              </div>
            </button>
          ))}
          <div className="p-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {suggestions.length} result{suggestions.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      )}

      {isOpen && query.trim().length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center animate-fade-in">
          <p className="text-muted-foreground">No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
