export const DUMMY_PRODUCTS = [
  {
    _id: "66b1a0000000000000000001",
    title: "Artemis Dining Table",
    slug: "artemis-dining-table",
    category: "Dining Room",
    material: "Solid Teak & Brass Inlay",
    basePrice: 185000,
    priceFormatted: "₹1,85,000",
    dimensions: "240cm L x 105cm W x 76cm H",
    finish: "Hand-rubbed organic oil & amber beeswax finish",
    careInstructions: "Wipe with dry microfiber cloth. Re-oil annually with natural furniture wax.",
    warranty: "10-Year Structural Warranty",
    stockStatus: "In Stock",
    badge: "BESTSELLER",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Natural Teak",
        hexColor: "#B4863A",
        imageIndex: 0,
        sizes: [
          { name: "6 Seater (180cm)", priceAdjustment: -25000 },
          { name: "8 Seater (240cm)", priceAdjustment: 0 },
          { name: "10 Seater (300cm)", priceAdjustment: 35000 }
        ]
      }
    ],
    description: "Architectural solid teak dining table featuring hand-carved chamfered edges, brass joinery accents, and a sculptural trestle base designed for generational gatherings.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000002",
    title: "Kobe Ergonomic Armchair",
    slug: "kobe-ergonomic-armchair",
    category: "Seating",
    material: "American Walnut & Bouclé Fabric",
    basePrice: 68000,
    priceFormatted: "₹68,000",
    dimensions: "82cm W x 88cm D x 78cm H",
    finish: "Matte polyurethane sealer over walnut grain",
    careInstructions: "Vacuum fabric gently with soft brush attachment. Spot clean with wool detergent.",
    warranty: "5-Year Frame & Cushion Warranty",
    stockStatus: "In Stock",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Oatmeal Bouclé",
        hexColor: "#EFEAE0",
        imageIndex: 0,
        sizes: [
          { name: "Standard Armchair", priceAdjustment: 0 },
          { name: "Armchair + Ottoman", priceAdjustment: 22000 }
        ]
      }
    ],
    description: "Enveloping luxury lounge chair crafted with steam-bent walnut armrests and high-density anatomical foam core wrapped in tactile belgian bouclé.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000003",
    title: "Sovereign Executive Desk",
    slug: "sovereign-executive-desk",
    category: "Home Office",
    material: "Smoked Oak & Italian Full-Grain Leather",
    basePrice: 225000,
    priceFormatted: "₹2,25,000",
    dimensions: "200cm W x 90cm D x 75cm H",
    finish: "Smoked charcoal lacquer with full-grain leather writing inlay",
    careInstructions: "Condition leather inlay bi-annually. Avoid harsh chemical sprays.",
    warranty: "10-Year Structural Warranty",
    stockStatus: "Low Stock",
    badge: "CUSTOM ORDER",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Cognac Leather & Smoked Oak",
        hexColor: "#B4863A",
        imageIndex: 0,
        sizes: [
          { name: "Executive Standard (200cm)", priceAdjustment: 0 },
          { name: "Grand Executive (240cm)", priceAdjustment: 45000 }
        ]
      }
    ],
    description: "Commanding workspace centerpiece with integrated cable management channels, soft-close velvet lined drawers, and a tactile saddle-stitched leather desktop.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000004",
    title: "Aura Low-Profile Platform Bed",
    slug: "aura-low-profile-platform-bed",
    category: "Master Suite",
    material: "Solid White Oak & Linen Headboard",
    basePrice: 195000,
    priceFormatted: "₹1,95,000",
    dimensions: "215cm L x 195cm W x 110cm H (King)",
    finish: "Natural white oak lacquer with textured linen upholstery",
    careInstructions: "Dry clean headboard cushions. Clean oak frames with damp cloth.",
    warranty: "10-Year Warranty",
    stockStatus: "In Stock",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Sand Linen",
        hexColor: "#F7F3E9",
        imageIndex: 0,
        sizes: [
          { name: "Queen Bed (160x200)", priceAdjustment: -20000 },
          { name: "King Bed (180x200)", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Minimalist Japanese-inspired platform bed frame with floating nightstand extensions and an upholstered split-back headboard.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000005",
    title: "Nordic Slatted Teak Credenza",
    slug: "nordic-slatted-teak-credenza",
    category: "Storage",
    material: "Reclaimed Teak & Soft-Touch Hardware",
    basePrice: 142000,
    priceFormatted: "₹1,42,000",
    dimensions: "180cm W x 45cm D x 72cm H",
    finish: "Matte organic wood wax",
    careInstructions: "Dust regularly. Keep away from direct moisture.",
    warranty: "5-Year Structural Warranty",
    stockStatus: "In Stock",
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Natural Teak",
        hexColor: "#C9A45C",
        imageIndex: 0,
        sizes: [
          { name: "3-Door (180cm)", priceAdjustment: 0 },
          { name: "4-Door (220cm)", priceAdjustment: 28000 }
        ]
      }
    ],
    description: "Slatted Tambour door sideboard offering discreet acoustic ventilation for electronics, adjustable internal shelving, and solid brass feet.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000006",
    title: "Verona Marble & Walnut Coffee Table",
    slug: "verona-marble-walnut-coffee-table",
    category: "Tables",
    material: "Carrara Marble & American Walnut",
    basePrice: 89000,
    priceFormatted: "₹89,000",
    dimensions: "120cm L x 70cm W x 38cm H",
    finish: "Honed marble stone sealer & natural walnut oil",
    careInstructions: "Wipe spills immediately. Use coasters for hot drinkware.",
    warranty: "5-Year Warranty",
    stockStatus: "In Stock",
    badge: "BESTSELLER",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "White Carrara / Walnut",
        hexColor: "#FFFFFF",
        imageIndex: 0,
        sizes: [
          { name: "Standard (120cm)", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Organic asymmetrical coffee table pairing a honed Carrara marble top with hand-turned solid walnut tripod legs.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000007",
    title: "Oslo Minimalist Teak Dining Bench",
    slug: "oslo-minimalist-teak-dining-bench",
    category: "Dining Room",
    material: "Solid Teak & Brass Brackets",
    basePrice: 54000,
    priceFormatted: "₹54,000",
    dimensions: "160cm L x 38cm W x 45cm H",
    finish: "Hand-rubbed amber wax finish",
    careInstructions: "Wipe with soft cloth. Apply beeswax every six months.",
    warranty: "5-Year Structural Warranty",
    stockStatus: "In Stock",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Amber Teak",
        hexColor: "#B4863A",
        imageIndex: 0,
        sizes: [
          { name: "Standard Bench (160cm)", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Hand-sculpted solid teak dining bench designed to pair seamlessly with our Artemis Dining Table, featuring rounded comfort edges and brass bracing.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000008",
    title: "Zuki Sculptural Lounge Chair",
    slug: "zuki-sculptural-lounge-chair",
    category: "Living Room",
    material: "Solid Oak & Terracotta Velvet",
    basePrice: 78000,
    priceFormatted: "₹78,000",
    dimensions: "85cm W x 90cm D x 74cm H",
    finish: "Organic oil sealer over natural oak grain",
    careInstructions: "Professional fabric clean recommended.",
    warranty: "5-Year Warranty",
    stockStatus: "In Stock",
    badge: "BESTSELLER",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d1299?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Terracotta Velvet",
        hexColor: "#C07A2E",
        imageIndex: 0,
        sizes: [
          { name: "Standard Armchair", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Statement low-slung lounge armchair with organic curved oak frame legs and high-resilience plush terracotta velvet cushioning.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000009",
    title: "Kyoto Floating Teak Nightstand Pair",
    slug: "kyoto-floating-teak-nightstand-pair",
    category: "Master Suite",
    material: "Reclaimed Teak & Matte Brass Handles",
    basePrice: 42000,
    priceFormatted: "₹42,000",
    dimensions: "50cm W x 40cm D x 52cm H",
    finish: "Hand-finished teak wax",
    careInstructions: "Clean with microfiber cloth.",
    warranty: "5-Year Structural Warranty",
    stockStatus: "In Stock",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Natural Teak Pair",
        hexColor: "#C9A45C",
        imageIndex: 0,
        sizes: [
          { name: "Set of 2 Nightstands", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Matching bedside nightstands with soft-close dovetailed drawers, concealed cable passthrough slots, and warm organic oil finish.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66b1a0000000000000000010",
    title: "Monarch Ergonomic Executive Chair",
    slug: "monarch-ergonomic-executive-chair",
    category: "Home Office",
    material: "Solid Walnut Frame & Tan Saddle Leather",
    basePrice: 92000,
    priceFormatted: "₹92,000",
    dimensions: "68cm W x 65cm D x 115cm H",
    finish: "Walnut oil sealer and aniline saddle leather",
    careInstructions: "Wipe leather with soft cloth. Apply leather balm annually.",
    warranty: "7-Year Warranty",
    stockStatus: "In Stock",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1200&q=80"
    ],
    variants: [
      {
        colorName: "Tan Saddle Leather",
        hexColor: "#B4863A",
        imageIndex: 0,
        sizes: [
          { name: "Standard Executive", priceAdjustment: 0 }
        ]
      }
    ],
    description: "Architectural office chair with synchronized tilt mechanism, hand-stitched tan saddle leather backrest, and solid walnut star base.",
    featured: true,
    createdAt: new Date().toISOString()
  }
];
