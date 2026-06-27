import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Calendar, MessageSquare, Plus, CheckCircle2, Award, Sparkles, User, X } from "lucide-react";
import { INITIAL_REVIEWS, NEWS_ITEMS, Review, NewsItem } from "../data/menuData";

export default function NewsAndReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  
  // New Review form state
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newDish, setNewDish] = useState("");
  const [recommendedDishes, setRecommendedDishes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Load reviews and news on mount
  useEffect(() => {
    // Local storage persistence
    const savedReviews = localStorage.getItem("monicali_reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
    }
    setNews(NEWS_ITEMS);
  }, []);

  // Save reviews when changed
  const saveReviews = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem("monicali_reviews", JSON.stringify(updatedReviews));
  };

  // Submit Review
  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      alert("Per favore, inserisci nome e commento.");
      return;
    }

    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      name: newName,
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
      comment: newComment,
      recommendedDishes: recommendedDishes.length > 0 ? recommendedDishes : undefined,
      isVerified: false
    };

    const updatedReviews = [newReview, ...reviews];
    saveReviews(updatedReviews);
    
    // Clear form
    setNewName("");
    setNewRating(5);
    setNewComment("");
    setRecommendedDishes([]);
    setNewDish("");
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  // Add Recommended Dish
  const handleAddDish = () => {
    if (newDish.trim() && !recommendedDishes.includes(newDish.trim())) {
      setRecommendedDishes([...recommendedDishes, newDish.trim()]);
      setNewDish("");
    }
  };

  // Remove Recommended Dish
  const handleRemoveDish = (dish: string) => {
    setRecommendedDishes(recommendedDishes.filter(d => d !== dish));
  };

  // Stat calculations
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12" id="recensioni-news">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: News & Promotions (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">Cosa Succede</span>
            <h3 className="text-3xl md:text-4xl font-serif font-black text-[#F5F5F0] mt-2 uppercase tracking-tight">News & Promo</h3>
            <p className="text-[#F5F5F0]/60 text-xs md:text-sm mt-2 font-medium">Rimani sempre aggiornato con le novità e le offerte esclusive del Ristorante Monica Li.</p>
          </div>

          <div className="space-y-4">
            {news.map((n) => (
              <div 
                key={n.id}
                className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden hover:border-white/10 transition-all group"
              >
                {/* Visual Category badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md font-mono ${
                    n.category === "Promozione" 
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" 
                      : n.category === "Evento" 
                      ? "bg-white/5 text-[#F5F5F0] border border-white/10"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {n.category}
                  </span>
                  
                  {n.badge && (
                    <span className="text-xs font-black text-[#F5F5F0] flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      {n.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-black text-lg text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide">
                  {n.title}
                </h4>
                <p className="text-xs text-[#F5F5F0]/60 mt-2 leading-relaxed font-medium">
                  {n.content}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pubblicato il: {n.date.split("-").reverse().join("/")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Reviews System (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Stats */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#141414] p-6 rounded-2xl border border-white/5 gap-4 shadow-xl">
            <div>
              <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">La Voce dei Clienti</span>
              <h3 className="text-2xl font-serif font-black text-[#F5F5F0] mt-1 uppercase tracking-wide">Recensioni</h3>
            </div>
            
            {/* Live Average Score */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#D4AF37] text-black font-mono font-black text-2xl px-3.5 py-2 rounded-xl flex items-center justify-center shadow-lg">
                {averageRating}
              </div>
              <div>
                <div className="flex gap-0.5 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 fill-current ${
                        i < Math.round(parseFloat(averageRating)) ? "text-[#D4AF37]" : "text-white/10"
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-wider">Basato su {reviews.length} opinioni</p>
              </div>
            </div>
          </div>

          {/* Form to Submit New Review */}
          <div className="bg-black rounded-2xl border border-white/5 p-6 shadow-2xl">
            <h4 className="font-serif font-black text-lg text-[#F5F5F0] mb-4 flex items-center gap-1.5 uppercase tracking-wide">
              <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
              Lascia la Tua Recensione
            </h4>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/10 text-green-400 border border-green-500/20 p-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Grazie! La tua recensione è stata registrata con successo e inserita in tempo reale.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* Interactive Star Picker */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#F5F5F0]/60 uppercase tracking-wider">Il tuo voto:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setNewRating(star)}
                        className="text-2xl transition cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 fill-current ${
                            star <= (hoverRating ?? newRating) ? "text-[#D4AF37]" : "text-white/10"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/40 font-mono font-bold">({newRating}/5)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Il Tuo Nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                    />
                  </div>

                  {/* Add recommended dish */}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newDish}
                      onChange={(e) => setNewDish(e.target.value)}
                      placeholder="Piatto consigliato (es: 144)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDish}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-xl text-xs font-black transition flex items-center justify-center cursor-pointer"
                      title="Aggiungi piatto"
                    >
                      <Plus className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>

                {/* Recommended list */}
                {recommendedDishes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recommendedDishes.map((dish, idx) => (
                      <span 
                        key={idx}
                        onClick={() => handleRemoveDish(dish)}
                        className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 py-1.5 px-3 rounded-lg text-[10px] font-black cursor-pointer hover:bg-[#D4AF37]/20 transition font-mono uppercase"
                      >
                        👍 {dish} <X className="w-3 h-3 text-rose-400" />
                      </span>
                    ))}
                  </div>
                )}

                {/* Comment text */}
                <div>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Raccontaci la tua esperienza culinaria (pulizia, cibi provati, cordialità...)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none h-20 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#F5F5F0] text-black font-black py-3 px-6 rounded-xl text-xs transition shadow-lg shadow-[#D4AF37]/5 cursor-pointer uppercase tracking-widest"
                >
                  Pubblica Recensione
                </button>
              </form>
            )}
          </div>

          {/* List of Reviews */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            <AnimatePresence initial={false}>
              {reviews.map((r) => (
                <motion.div
                  layout
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#141414] rounded-2xl border border-white/5 p-5 shadow-xl hover:border-white/10 transition"
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-full text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                        <User className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h5 className="font-serif font-black text-sm text-[#F5F5F0] flex items-center gap-1.5 uppercase tracking-wide">
                          {r.name}
                          {r.isVerified && (
                            <span 
                              className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5 font-black flex items-center gap-0.5"
                              title="Cliente autentico del ristorante"
                            >
                              <Award className="w-2.5 h-2.5" />
                              VERIFICATO
                            </span>
                          )}
                        </h5>
                        <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                          {r.date.split("-").reverse().join("/")}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating display */}
                    <div className="flex gap-0.5 text-[#D4AF37]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 fill-current ${
                            i < r.rating ? "text-[#D4AF37]" : "text-white/10"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-[#F5F5F0]/80 mt-3 leading-relaxed font-medium italic">
                    "{r.comment}"
                  </p>

                  {/* Recommended Dishes list */}
                  {r.recommendedDishes && r.recommendedDishes.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] text-white/40 font-mono uppercase font-black">Consiglia:</span>
                      {r.recommendedDishes.map((dish, i) => (
                        <span 
                          key={i}
                          className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded px-1.5 py-0.5 text-[9px] font-black font-mono uppercase"
                        >
                          👌 {dish}
                        </span>
                      ))}
                    </div>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
