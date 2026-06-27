import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X, Sparkles, ChefHat } from "lucide-react";
import { GALLERY_PHOTOS } from "../data/menuData";

export default function PhotoGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tutti");
  const [activeLightbox, setActiveLightbox] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  const categories = ["Tutti", "Sushi", "Cucina", "Sashimi", "Antipasti", "Tartare"];

  const filteredPhotos = GALLERY_PHOTOS.filter((photo) => {
    if (selectedCategory === "Tutti") return true;
    return photo.category === selectedCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12" id="galleria">
      
      {/* Title block */}
      <div className="text-center mb-12">
        <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">Galleria Fotografica</span>
        <h2 className="text-4xl md:text-6xl font-serif font-black text-[#F5F5F0] mt-2 uppercase tracking-tight">I Nostri Piatti</h2>
        <p className="text-[#F5F5F0]/60 max-w-xl mx-auto mt-3 text-xs md:text-sm font-medium">
          Scorri la selezione visiva dei nostri capolavori gastronomici preparati sul momento. Ogni piatto è un connubio d'arte e sapore orientale.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                : "bg-white/5 text-[#F5F5F0]/80 border-white/10 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              layout
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group bg-[#141414] rounded-2xl overflow-hidden border border-white/5 shadow-xl hover:border-white/10 transition-all flex flex-col cursor-pointer"
              onClick={() => setActiveLightbox(photo)}
            >
              {/* Image Container with Hover overlay */}
              <div className="aspect-square relative overflow-hidden bg-white/5">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-[#D4AF37] border border-white/15 transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-[10px] text-[#F5F5F0] font-mono font-bold uppercase py-0.5 px-2 rounded-md border border-white/10 shadow-lg">
                  {photo.category}
                </span>
              </div>

              {/* Title & Description block */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-black text-sm text-[#F5F5F0] line-clamp-1 group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-[#F5F5F0]/50 mt-1 line-clamp-2 font-medium">
                    {photo.description}
                  </p>
                </div>
                
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#F5F5F0]/40 font-mono">
                  <span className="flex items-center gap-1 font-medium">
                    <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Tradizionale
                  </span>
                  <span className="text-[#D4AF37] font-black flex items-center gap-0.5 uppercase tracking-wider">
                    Premium
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightbox(null)}
              className="fixed inset-0 bg-black/95 z-50 cursor-pointer"
            />

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 sm:inset-12 md:inset-20 lg:inset-32 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-black border border-white/10 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-full">
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute right-4 top-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left: Image */}
                <div className="flex-1 max-h-[300px] md:max-h-full bg-[#141414] flex items-center">
                  <img
                    src={activeLightbox.url}
                    alt={activeLightbox.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-[320px] p-6 md:p-8 flex flex-col justify-between bg-[#141414] overflow-y-auto border-l border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-md font-mono">
                      {activeLightbox.category}
                    </span>
                    <h3 className="font-serif font-black text-xl md:text-2xl text-[#F5F5F0] mt-4 uppercase tracking-tight">
                      {activeLightbox.title}
                    </h3>
                    <p className="text-xs text-[#F5F5F0]/60 mt-2.5 leading-relaxed font-medium">
                      {activeLightbox.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
                    <p className="text-[10px] text-[#F5F5F0]/40 leading-normal font-mono uppercase tracking-wider">
                      Vuoi provarlo? Cerca questo piatto nel menù interattivo sottostante o ordina direttamente via asporto!
                    </p>
                    <button
                      onClick={() => {
                        setActiveLightbox(null);
                        const element = document.getElementById("menu-interattivo");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full bg-[#D4AF37] hover:bg-[#F5F5F0] text-black py-3 px-4 rounded-xl text-xs font-black transition shadow-sm text-center cursor-pointer uppercase tracking-widest"
                    >
                      Ordina Ora nel Menù
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
