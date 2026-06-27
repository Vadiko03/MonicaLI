import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Leaf, 
  Flame, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Sparkles, 
  Info, 
  Check, 
  Trash2, 
  MessageCircle,
  Clock,
  Bike,
  Store,
  Grid,
  ChevronDown
} from "lucide-react";
import { MENU_ITEMS, MenuItem, CATEGORIES, ALLERGENS } from "../data/menuData";

interface InteractiveMenuProps {
  onAddToFavorites?: (item: MenuItem) => void;
  favorites?: string[];
}

export default function InteractiveMenu({}: InteractiveMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Menu All You Can Eat");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyVegetarian, setOnlyVegetarian] = useState<boolean>(false);
  const [onlySpicy, setOnlySpicy] = useState<boolean>(false);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [showAllergenGuide, setShowAllergenGuide] = useState<boolean>(false);
  const [showMobileCategoriesModal, setShowMobileCategoriesModal] = useState<boolean>(false);
  
  // Smooth scroll and select helper for mobile
  const selectCategoryAndScroll = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      const container = document.getElementById("dishes-container-start");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };
  
  // Shopping Cart State
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderMode, setOrderMode] = useState<"takeaway" | "delivery">("takeaway");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [orderTime, setOrderTime] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("" );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (item.category !== selectedCategory) return false;

      // Search match (name, number, description)
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesNumber = item.number.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesNumber && !matchesDesc) return false;
      }

      // Vegetarian match
      if (onlyVegetarian && !item.isVegetarian) return false;

      // Spicy match
      if (onlySpicy && !item.isSpicy) return false;

      // Allergen filter (exclude items containing selected allergens)
      if (selectedAllergens.length > 0) {
        const containsExcluded = item.allergens.some((allg) => 
          selectedAllergens.includes(allg)
        );
        if (containsExcluded) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, onlyVegetarian, onlySpicy, selectedAllergens]);

  // Toggle Excluded Allergen
  const handleToggleAllergen = (allergenId: string) => {
    setSelectedAllergens((prev) => 
      prev.includes(allergenId) 
        ? prev.filter((a) => a !== allergenId)
        : [...prev, allergenId]
    );
  };

  // Add to Cart
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => 
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  // Update Quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((c) => {
        if (c.item.id === itemId) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      }).filter((c): c is { item: MenuItem; quantity: number } => c !== null);
    });
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    // Takeaway has a 20% discount (except for AYCE menu items as standard, but let's apply it globally or only to standard items, let's apply globally as requested "-20% takeaway")
    if (orderMode === "takeaway") {
      return cartSubtotal * 0.20;
    }
    return 0;
  }, [cartSubtotal, orderMode]);

  const deliveryFee = useMemo(() => {
    return orderMode === "delivery" ? 2.00 : 0;
  }, [orderMode]);

  const cartTotal = useMemo(() => {
    return cartSubtotal - discountAmount + deliveryFee;
  }, [cartSubtotal, discountAmount, deliveryFee]);

  // WhatsApp Order Submission URL
  const whatsappOrderUrl = useMemo(() => {
    if (!customerName.trim()) return "";
    if (orderMode === "delivery" && !deliveryAddress.trim()) return "";
    if (!orderTime) return "";

    // Prepare message
    let message = `*ORDINE DA SITO MONICA LI*\n`;
    message += `-----------------------------------\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    if (customerPhone) message += `📞 *Telefono:* ${customerPhone}\n`;
    message += `📍 *Modalità:* ${orderMode === "takeaway" ? "Takeaway (Asporto -20%)" : "Consegna a Domicilio"}\n`;
    if (orderMode === "delivery") {
      message += `🏠 *Indirizzo:* ${deliveryAddress}\n`;
    }
    message += `🕒 *Orario richiesto:* ${orderTime}\n`;
    message += `-----------------------------------\n`;
    message += `📦 *Dettaglio Piatti:*\n`;

    cart.forEach((c) => {
      const priceText = (c.item.price * c.quantity).toFixed(2);
      message += `• [${c.item.number}] *${c.item.name}* x${c.quantity} (${priceText}€)\n`;
    });

    message += `-----------------------------------\n`;
    message += `💵 *Totale parziale:* ${cartSubtotal.toFixed(2)}€\n`;
    if (discountAmount > 0) {
      message += `🏷️ *Sconto Takeaway (20%):* -${discountAmount.toFixed(2)}€\n`;
    }
    if (deliveryFee > 0) {
      message += `🛵 *Spese Consegna:* +${deliveryFee.toFixed(2)}€\n`;
    }
    message += `💰 *TOTALE DA PAGARE:* *${cartTotal.toFixed(2)}€*\n\n`;
    message += `Grazie! Attendo vostra conferma di ricezione ordine.`;

    const encodedText = encodeURIComponent(message);
    // WhatsApp number in the image: 351 503 2333
    return `https://api.whatsapp.com/send?phone=393515032333&text=${encodedText}`;
  }, [customerName, customerPhone, orderMode, deliveryAddress, orderTime, cart, cartSubtotal, discountAmount, deliveryFee, cartTotal]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="menu-interattivo">
      <div className="text-center mb-12">
        <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">Esperienza Gastronomica</span>
        <h2 className="text-4xl md:text-6xl font-serif font-black text-[#F5F5F0] mt-2 uppercase tracking-tight">Menù Digitale Interattivo</h2>
        <p className="text-[#F5F5F0]/60 max-w-xl mx-auto mt-3 text-xs md:text-sm font-medium">
          Sfoglia le nostre specialità autentiche, filtra per ingredienti ed allergeni e prepara il tuo ordine d'asporto o a domicilio in un click.
        </p>
      </div>

      {/* Control Panel: Search & Dietary Filters */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 shadow-2xl p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca piatto (es: 144, Uramaki Tiger...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex gap-2 justify-center md:justify-start">
            <button
              onClick={() => setOnlyVegetarian(!onlyVegetarian)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                onlyVegetarian 
                  ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg" 
                  : "bg-white/5 text-[#F5F5F0] border-white/10 hover:bg-white/10"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Vegetariano
            </button>
            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                onlySpicy 
                  ? "bg-rose-600 text-white border-rose-600 shadow-lg" 
                  : "bg-white/5 text-[#F5F5F0] border-white/10 hover:bg-white/10"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Piccante
            </button>
          </div>

          {/* Allergen Toggle Button */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => setShowAllergenGuide(!showAllergenGuide)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showAllergenGuide 
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                  : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/20"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Escludi Allergeni {selectedAllergens.length > 0 && `(${selectedAllergens.length})`}
            </button>
          </div>
        </div>

        {/* Expandable Allergen Filter Selector */}
        <AnimatePresence>
          {showAllergenGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4 pt-4 border-t border-white/5"
            >
              <p className="text-xs text-[#F5F5F0]/60 mb-3 font-medium">
                Seleziona gli allergeni che vuoi *evitare*. Nasconderemo i piatti correlati:
              </p>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map((allergen) => {
                  const isExcluded = selectedAllergens.includes(allergen.id);
                  return (
                    <button
                      key={allergen.id}
                      onClick={() => handleToggleAllergen(allergen.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                        isExcluded
                          ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm scale-95 font-bold"
                          : "bg-white/5 text-[#F5F5F0] border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span>{allergen.icon}</span>
                      <span>{allergen.name}</span>
                      {isExcluded && <Check className="w-3 h-3 ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedAllergens.length > 0 && (
                <button
                  onClick={() => setSelectedAllergens([])}
                  className="text-xs text-[#D4AF37] font-semibold mt-3 hover:underline inline-block cursor-pointer"
                >
                  Riassegna tutti gli alimenti (Rimuovi filtri)
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid: Category list + Filtered Items */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation for Categories (Desktop) / Horizontal Slider (Mobile) */}
        <div className="lg:col-span-1">
          {/* Mobile Categories Swiper & Show All trigger */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 font-bold">Portate</span>
              <button
                onClick={() => setShowMobileCategoriesModal(true)}
                className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                Vedi Tutte ({CATEGORIES.length})
              </button>
            </div>
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar scroll-smooth snap-x">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategoryAndScroll(cat)}
                  className={`snap-start shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#D4AF37] text-black shadow-lg"
                      : "bg-white/5 text-[#F5F5F0]/70 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Categories Vertical Menu */}
          <div className="hidden lg:block bg-[#141414] rounded-2xl border border-white/5 p-4 sticky top-24 max-h-[75vh] overflow-y-auto">
            <h3 className="text-xs font-mono tracking-wider text-[#F5F5F0]/40 uppercase font-black mb-4 px-2">Categorie Menu</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategoryAndScroll(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white/5 text-[#D4AF37] border-l-4 border-[#D4AF37] pl-4"
                      : "text-[#F5F5F0]/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-[10px] bg-white/5 text-[#F5F5F0]/40 py-0.5 px-1.5 rounded-full font-mono font-bold">
                    {MENU_ITEMS.filter(i => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dishes Listing Container */}
        <div className="lg:col-span-3" id="dishes-container-start">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl md:text-2xl font-serif font-black text-[#F5F5F0] flex items-center gap-2 uppercase tracking-tight">
              <span>{selectedCategory}</span>
              <span className="text-sm font-mono text-[#F5F5F0]/40 font-normal">
                ({filteredItems.length} {filteredItems.length === 1 ? 'piatto' : 'piatti'})
              </span>
            </h3>
            {/* Takeaway Promo Badge */}
            <div className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase animate-pulse flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sconto Asporto -20%
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center bg-[#141414] rounded-2xl p-16 border border-dashed border-white/10">
              <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-[#F5F5F0]/60 text-sm font-medium">Nessun piatto trovato con i filtri correnti.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setOnlyVegetarian(false);
                  setOnlySpicy(false);
                  setSelectedAllergens([]);
                }}
                className="mt-4 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F5F5F0] text-black rounded-xl text-xs font-black tracking-widest uppercase shadow transition cursor-pointer"
              >
                Reset Filtri
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => {
                  const isAYCE = item.category === "Menu All You Can Eat";
                  if (isAYCE) {
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#1c1917] to-[#121212] rounded-2xl border-2 border-[#D4AF37]/40 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group"
                      >
                        {/* Decorative background visual */}
                        <div className="absolute right-3 bottom-3 opacity-[0.05] pointer-events-none select-none">
                          <span className="text-9xl font-serif">🥢</span>
                        </div>

                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-mono font-black bg-[#D4AF37] text-black px-3 py-1 rounded-full uppercase tracking-widest">
                              Formula Speciale al Tavolo
                            </span>
                            <span className="text-xs font-mono font-bold text-white/40">
                              {item.number}
                            </span>
                          </div>

                          <h4 className="font-serif text-xl sm:text-2xl font-black text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors">
                            {item.name}
                          </h4>
                          
                          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 mt-2 font-medium">
                            {item.description}
                          </p>

                          {/* Key guidelines block */}
                          <div className="mt-5 space-y-2.5 text-xs text-white/70 font-medium border-t border-white/5 pt-4">
                            <div className="flex items-start gap-2">
                              <span className="text-[#D4AF37] shrink-0 mt-0.5">✨</span>
                              <span>Consumazione illimitata di tutti i nostri piatti di sushi e cucina</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#D4AF37] shrink-0 mt-0.5">🥤</span>
                              <span>Escluso bevande, caffè, liquori e dolci</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#D4AF37] shrink-0 mt-0.5">👶</span>
                              <span>I bambini sotto i 120 cm di altezza pagano la metà</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#D4AF37] shrink-0 mt-0.5">⚠️</span>
                              <span>Si prega di ordinare responsabilmente: i piatti lasciati o sprecati verranno addebitati a prezzo di listino</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing and Info banner footer */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-mono font-black text-[#D4AF37]">
                              {item.price.toFixed(2)}€
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-wider font-mono font-bold">
                              / Persona
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] uppercase font-mono tracking-wider bg-[#D4AF37]/5 px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/20 font-black">
                            <Info className="w-4 h-4 text-[#D4AF37]" />
                            <span>Informativo • Sfoglia le altre categorie per ordinare d'asporto</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#141414] rounded-2xl border border-white/5 p-4 shadow-xl hover:border-white/10 transition-all flex flex-col justify-between group"
                    >
                      <div>
                         {/* Top labels */}
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono font-bold bg-white/5 text-[#F5F5F0]/80 px-2.5 py-0.5 rounded">
                            N. {item.number}
                          </span>
                          
                          {/* Food Attributes */}
                          <div className="flex gap-1">
                            {item.isVegetarian && (
                              <span className="bg-green-500/10 text-green-400 p-1 rounded-full border border-green-500/20" title="Vegetariano">
                                <Leaf className="w-3 h-3" />
                              </span>
                            )}
                            {item.isSpicy && (
                              <span className="bg-rose-500/10 text-rose-400 p-1 rounded-full border border-rose-500/20" title="Piccante">
                                <Flame className="w-3 h-3" />
                              </span>
                            )}
                            {item.pieces && (
                              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                                {item.pieces}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name and Description */}
                        <h4 className="font-serif text-base font-black text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-[#F5F5F0]/50 mt-1 italic leading-relaxed font-medium">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Footer: Allergens + Price + Add action */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        
                        {/* Allergen Icons mapping */}
                        <div className="flex gap-1 overflow-x-auto max-w-[50%] no-scrollbar py-1">
                          {item.allergens.map((allgId) => {
                            const allg = ALLERGENS.find(a => a.id === allgId);
                            return allg ? (
                              <span 
                                key={allgId} 
                                className="text-xs cursor-help p-1 rounded-md border border-white/5 bg-white/5"
                                title={allg.name}
                              >
                                {allg.icon}
                              </span>
                            ) : null;
                          })}
                        </div>

                        {/* Pricing and Action */}
                        <div className="flex items-center gap-3">
                          <span className="text-base font-mono font-black text-[#F5F5F0]">
                            {item.price.toFixed(2)}€
                          </span>
                          
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-[#D4AF37] hover:bg-[#F5F5F0] text-black p-2 rounded-xl transition shadow-lg shadow-[#D4AF37]/5 cursor-pointer flex items-center justify-center"
                            title="Aggiungi all'ordine"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

      {/* Floating Shopping Cart Button (Mobile) */}
      <div className="fixed bottom-24 lg:bottom-8 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="bg-[#D4AF37] text-black p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 relative cursor-pointer font-black"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black font-mono font-extrabold text-xs w-6 h-6 rounded-full border-2 border-black flex items-center justify-center animate-bounce">
              {cart.reduce((s, c) => s + c.quantity, 0)}
            </span>
          )}
        </motion.button>
      </div>

      {/* Shopping Cart Drawer Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 cursor-pointer"
            />

            {/* Cart Panel */}
            <motion.div
              initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
              animate={{ x: 0, y: 0 }}
              exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed z-50 bg-[#0c0c0c] shadow-2xl flex flex-col justify-between text-[#F5F5F0]
                ${isMobile 
                  ? "bottom-0 left-0 right-0 h-[88vh] rounded-t-3xl border-t border-white/10" 
                  : "right-0 top-0 h-[100dvh] w-full max-w-md border-l border-white/5"
                }`}
            >
              {/* Drag Handle for Mobile Bottom Sheet */}
              {isMobile && (
                <div className="w-full py-2 flex justify-center items-center shrink-0">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>
              )}

              {/* Cart Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white/5 text-[#D4AF37] p-2 rounded-xl border border-white/5">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wide">Il Tuo Ordine</h3>
                    <p className="text-xs text-[#F5F5F0]/40 font-mono">
                      {cart.length === 0 ? "Carrello vuoto" : `${cart.reduce((s, c) => s + c.quantity, 0)} piatti selezionati`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20 border border-white/5">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <p className="text-[#F5F5F0]/60 text-sm font-medium">Non hai ancora aggiunto piatti.</p>
                    <p className="text-xs text-[#F5F5F0]/40 mt-1 max-w-xs mx-auto">Sfoglia il menu e clicca sul tasto + per comporre il tuo asporto o domicilio.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-white/40 font-mono font-bold pb-2 border-b border-white/5 uppercase tracking-widest">
                      <span>PIATTO</span>
                      <span>TOTALE</span>
                    </div>

                    {cart.map((c) => (
                      <div key={c.item.id} className="flex items-center justify-between py-2 border-b border-white/5 gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono bg-white/5 text-white/40 px-1 rounded font-bold">
                              {c.item.number}
                            </span>
                            <span className="font-serif font-bold text-sm text-[#F5F5F0] line-clamp-1">
                              {c.item.name}
                            </span>
                          </div>
                          <span className="text-xs text-[#F5F5F0]/40 font-mono">
                            {c.item.price.toFixed(2)}€/cad
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(c.item.id, -1)}
                            className="p-1 rounded-md hover:bg-white/10 text-white/60 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold text-white w-4 text-center">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(c.item.id, 1)}
                            className="p-1 rounded-md hover:bg-white/10 text-white/60 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <span className="font-mono font-bold text-sm text-[#F5F5F0] w-16 text-right">
                          {(c.item.price * c.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={handleClearCart}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 mt-2 font-semibold hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Svuota carrello
                    </button>
                  </div>
                )}

                {/* Booking / Details Section */}
                {cart.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                    <h4 className="font-serif font-black text-sm text-[#F5F5F0] uppercase tracking-wide">Dettagli Consegna / Ritiro</h4>
                    
                    {/* Mode Toggle */}
                    <div className="grid grid-cols-2 gap-2 bg-[#141414] p-1.5 rounded-xl border border-white/5">
                      <button
                        onClick={() => setOrderMode("takeaway")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black transition cursor-pointer uppercase tracking-wider ${
                          orderMode === "takeaway"
                            ? "bg-[#D4AF37] text-black shadow-sm"
                            : "text-[#F5F5F0]/40 hover:text-white"
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        Asporto (-20%)
                      </button>
                      <button
                        onClick={() => setOrderMode("delivery")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black transition cursor-pointer uppercase tracking-wider ${
                          orderMode === "delivery"
                            ? "bg-[#D4AF37] text-black shadow-sm"
                            : "text-[#F5F5F0]/40 hover:text-white"
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5" />
                        A Domicilio
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-white/40 font-mono mb-1 tracking-wider">Nome Completo *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="es: Mario Rossi"
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-black text-white/40 font-mono mb-1 tracking-wider">Telefono (Opzionale)</label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="es: 345 678 9012"
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-black text-white/40 font-mono mb-1 tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          Orario Ritiro/Consegna *
                        </label>
                        <input
                          type="time"
                          required
                          value={orderTime}
                          onChange={(e) => setOrderTime(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F5F0] focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none font-mono"
                        />
                        <p className="text-[10px] text-white/40 mt-1 italic font-medium">
                          Pranzo: 12.00 - 15.00 | Cena: 18.30 - 23.30
                        </p>
                      </div>

                      {orderMode === "delivery" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-[10px] uppercase font-black text-white/40 font-mono mb-1 tracking-wider">Indirizzo Consegna *</label>
                          <textarea
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="es: Via dei Platani 45, Interno 3 - Infernetto"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none h-16 resize-none"
                          />
                          <p className="text-[10px] text-[#D4AF37] mt-1 font-mono uppercase tracking-wide font-bold">
                            Costo di consegna a domicilio: €2.00 fisso
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Footer Total & WhatsApp Action */}
              {cart.length > 0 && (
                <div className="p-5 pb-8 lg:pb-5 border-t border-white/5 bg-[#141414] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-[#F5F5F0]/60 font-mono uppercase tracking-wide">
                      <span>Subtotale alla carta:</span>
                      <span>{cartSubtotal.toFixed(2)}€</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-xs text-[#D4AF37] font-mono font-black uppercase tracking-wide">
                        <span>Sconto Asporto (20%):</span>
                        <span>-{discountAmount.toFixed(2)}€</span>
                      </div>
                    )}

                    {deliveryFee > 0 && (
                      <div className="flex justify-between items-center text-xs text-rose-400 font-mono uppercase tracking-wide">
                        <span>Spese di consegna:</span>
                        <span>+{deliveryFee.toFixed(2)}€</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-base text-[#F5F5F0] font-black border-t border-white/5 pt-3 uppercase tracking-wider">
                      <span className="font-serif">Totale Stimato:</span>
                      <span className="font-mono text-lg text-[#D4AF37] font-black">{cartTotal.toFixed(2)}€</span>
                    </div>
                  </div>

                  <a
                    href={whatsappOrderUrl || "#"}
                    target={whatsappOrderUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!customerName.trim()) {
                        e.preventDefault();
                        alert("Per favore, inserisci il tuo nome per completare l'ordine.");
                        return;
                      }
                      if (orderMode === "delivery" && !deliveryAddress.trim()) {
                        e.preventDefault();
                        alert("Per favore, inserisci l'indirizzo per la consegna a domicilio.");
                        return;
                      }
                      if (!orderTime) {
                        e.preventDefault();
                        alert("Per favore, specifica un orario per l'asporto o la consegna.");
                        return;
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer uppercase tracking-widest text-xs text-center inline-flex"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-green-600" />
                    Invia Ordine su WhatsApp
                  </a>
                  <p className="text-[10px] text-white/40 text-center font-mono uppercase tracking-wider">
                    Il messaggio precompilato verrà inviato a Monica Li.
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Categories Grid Modal */}
      <AnimatePresence>
        {showMobileCategoriesModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileCategoriesModal(false)}
              className="fixed inset-0 bg-black/95 z-50 cursor-pointer lg:hidden"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="fixed inset-x-4 top-[8%] bottom-[8%] bg-black border border-white/10 z-50 rounded-2xl shadow-2xl flex flex-col justify-between text-[#F5F5F0] lg:hidden p-5 max-w-lg mx-auto"
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                  <h3 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wide">Menu Categorie</h3>
                  <button
                    onClick={() => setShowMobileCategoriesModal(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-xs text-[#F5F5F0]/60 mb-4 font-medium">
                  Seleziona una categoria per saltare direttamente alla sezione desiderata del menù.
                </p>
              </div>

              {/* Grid of categories scrollable area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        selectCategoryAndScroll(cat);
                        setShowMobileCategoriesModal(false);
                      }}
                      className={`text-left p-3 rounded-xl text-xs font-bold transition-all flex flex-col justify-between border cursor-pointer h-20 ${
                        selectedCategory === cat
                          ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg"
                          : "bg-white/5 text-[#F5F5F0]/80 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="line-clamp-2 leading-snug">{cat}</span>
                      <span className={`text-[9px] font-mono uppercase tracking-wider mt-1 ${selectedCategory === cat ? 'text-black/60' : 'text-[#D4AF37]'}`}>
                        {MENU_ITEMS.filter(i => i.category === cat).length} piatti
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4">
                <button
                  onClick={() => setShowMobileCategoriesModal(false)}
                  className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
