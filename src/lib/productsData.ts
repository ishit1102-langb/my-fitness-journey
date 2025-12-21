import { sportsData } from "@/data/sportsData";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: Review[];
  sport: string;
  category: string;
  image: string;
  images: string[];
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

const reviewTemplates = [
  { userName: "Alex M.", comment: "Excellent quality! Exactly what I needed for my training.", rating: 5 },
  { userName: "Sarah K.", comment: "Good value for money. Delivery was fast too.", rating: 4 },
  { userName: "Mike T.", comment: "Been using this for months. Still holds up great!", rating: 5 },
  { userName: "Emma L.", comment: "Comfortable and durable. Would recommend.", rating: 4 },
  { userName: "Chris R.", comment: "Perfect for beginners and pros alike.", rating: 5 },
  { userName: "Jordan P.", comment: "Solid product. Minor issues with sizing.", rating: 3 },
  { userName: "Taylor W.", comment: "Love it! Use it every day.", rating: 5 },
  { userName: "Casey D.", comment: "Great design and functionality.", rating: 4 },
];

const generateReviews = (count: number): Review[] => {
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    reviews.push({
      id: `review-${i}`,
      userName: template.userName,
      rating: template.rating,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      comment: template.comment,
      helpful: Math.floor(Math.random() * 50),
    });
  }
  return reviews;
};

export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  sportsData.forEach((sport) => {
    const sportProducts: Product[] = [
      {
        id: `${sport.id}-1`,
        name: `${sport.name} Pro Gear Set`,
        description: `Professional-grade equipment for ${sport.name.toLowerCase()} enthusiasts`,
        fullDescription: `Elevate your ${sport.name.toLowerCase()} game with our Pro Gear Set. This comprehensive kit includes everything you need to perform at your best. Crafted with premium materials and designed for durability, this set is trusted by professionals worldwide. Whether you're training or competing, our Pro Gear Set delivers consistent performance and comfort.`,
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.8,
        reviews: generateReviews(8),
        sport: sport.id,
        category: "Equipment",
        image: `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop`,
        images: [
          `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop`,
        ],
        inStock: true,
        features: [
          "Professional-grade materials",
          "Ergonomic design for comfort",
          "Lightweight yet durable",
          "Easy to maintain",
          "Includes carrying case",
        ],
        specifications: {
          "Material": "Premium composite",
          "Weight": "1.2 kg",
          "Warranty": "2 years",
          "Color": "Black/Silver",
        },
      },
      {
        id: `${sport.id}-2`,
        name: `${sport.name} Training Shoes`,
        description: `Lightweight, responsive footwear designed for ${sport.name.toLowerCase()}`,
        fullDescription: `Step into excellence with our ${sport.name} Training Shoes. Engineered with advanced cushioning technology and breathable mesh uppers, these shoes provide unmatched comfort during intense training sessions. The specialized outsole offers superior grip and stability, while the lightweight design keeps you agile and fast.`,
        price: 129.99,
        rating: 4.6,
        reviews: generateReviews(6),
        sport: sport.id,
        category: "Footwear",
        image: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop`,
        images: [
          `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop`,
        ],
        inStock: true,
        features: [
          "Advanced cushioning technology",
          "Breathable mesh upper",
          "Superior grip outsole",
          "Lightweight construction",
          "Available in multiple sizes",
        ],
        specifications: {
          "Upper": "Synthetic mesh",
          "Sole": "Rubber compound",
          "Drop": "8mm",
          "Weight": "280g per shoe",
        },
      },
      {
        id: `${sport.id}-3`,
        name: `${sport.name} Performance Jersey`,
        description: `Moisture-wicking fabric for peak performance`,
        fullDescription: `Stay cool and perform better with our ${sport.name} Performance Jersey. Made from advanced moisture-wicking fabric that pulls sweat away from your body, keeping you dry and comfortable. The athletic fit allows for full range of motion while the reinforced seams ensure long-lasting durability.`,
        price: 59.99,
        originalPrice: 79.99,
        rating: 4.7,
        reviews: generateReviews(10),
        sport: sport.id,
        category: "Apparel",
        image: `https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop`,
        images: [
          `https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&h=600&fit=crop`,
        ],
        inStock: true,
        features: [
          "Moisture-wicking technology",
          "Quick-dry fabric",
          "Athletic fit design",
          "Reinforced seams",
          "UV protection",
        ],
        specifications: {
          "Material": "92% Polyester, 8% Spandex",
          "Care": "Machine washable",
          "Fit": "Athletic",
          "Sizes": "XS-3XL",
        },
      },
      {
        id: `${sport.id}-4`,
        name: `${sport.name} Training Kit`,
        description: `Complete training accessories bundle`,
        fullDescription: `Get everything you need to level up your ${sport.name.toLowerCase()} training with our comprehensive Training Kit. This all-in-one bundle includes essential accessories carefully selected to enhance your workout routine. Perfect for home gyms or on-the-go training, this kit offers incredible value for athletes of all levels.`,
        price: 89.99,
        rating: 4.5,
        reviews: generateReviews(5),
        sport: sport.id,
        category: "Training Gear",
        image: `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop`,
        images: [
          `https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop`,
        ],
        inStock: Math.random() > 0.2,
        features: [
          "Complete accessory bundle",
          "High-quality materials",
          "Portable design",
          "Suitable for all levels",
          "Storage bag included",
        ],
        specifications: {
          "Items Included": "5 pieces",
          "Bag Size": "45cm x 30cm",
          "Total Weight": "2.5 kg",
          "Warranty": "1 year",
        },
      },
    ];
    products.push(...sportProducts);
  });
  
  return products;
};

export const allProducts = generateProducts();

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find((p) => p.id === id);
};

export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  return allProducts
    .filter((p) => p.id !== product.id && (p.sport === product.sport || p.category === product.category))
    .slice(0, limit);
};
