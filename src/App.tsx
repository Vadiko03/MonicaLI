import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Sparkles, 
  Bike, 
  ChevronRight, 
  Calendar, 
  Heart,
  Instagram,
  Facebook,
  ShieldCheck,
  ChevronUp
} from "lucide-react";

import CherryBlossomLogo from "./components/CherryBlossomLogo";
import InteractiveMenu from "./components/InteractiveMenu";
import PhotoGallery from "./components/PhotoGallery";
import WhatsAppBooking from "./components/WhatsAppBooking";
import LocationMap from "./components/LocationMap";
import NewsAndReviews from "./components/NewsAndReviews";

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Monitor scroll state for styling sticky header and floating "back-to-top"
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quick navigation scroll-into-view
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F0] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. INTRO SPLASH PAGE (With Cherry Blossom logo entrance animation) */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-8 flex flex-col items-center">
              
              {/* Logo with entrance animations */}
              <CherryBlossomLogo size="xl" interactive={true} showSubtitle={true} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 1.2, duration: 0.5 } }}
                className="space-y-4 w-full"
              >
                <div className="h-1 w-24 bg-[#D4AF37]/20 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="h-full w-12 bg-[#D4AF37] rounded-full"
                  />
                </div>
                <p className="text-xs text-[#D4AF37] font-mono tracking-widest uppercase">
                  Sapori autentici Giapponesi & Cinesi
                </p>
                
                <button
                  onClick={() => setShowSplash(false)}
                  className="mt-4 px-8 py-3.5 bg-white hover:bg-[#D4AF37] text-black font-black text-xs tracking-widest uppercase rounded-full shadow-lg transition duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Entra nel Ristorante
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STICKY HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-[#0F0F0F]/95 backdrop-blur-md shadow-lg border-b border-[#F5F5F0]/10 py-2.5" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Brand Logo Trigger */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <CherryBlossomLogo size="sm" interactive={false} showSubtitle={false} />
            <div className="hidden sm:block">
              <span className="font-serif font-black text-sm text-[#F5F5F0] block leading-tight uppercase tracking-tight">Monica Li</span>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] block uppercase">Roma Infernetto</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <button onClick={() => scrollToSection("hero")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">Home</button>
            <button onClick={() => scrollToSection("menu-interattivo")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">Menù</button>
            <button onClick={() => scrollToSection("galleria")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">Galleria</button>
            <button onClick={() => scrollToSection("prenotazioni")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">Prenota</button>
            <button onClick={() => scrollToSection("dove-siamo")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">Orari & Mappa</button>
            <button onClick={() => scrollToSection("recensioni-news")} className="text-xs font-bold text-[#F5F5F0]/60 hover:text-[#D4AF37] uppercase tracking-widest transition">News & Recensioni</button>
          </nav>

          {/* Call & WhatsApp Quick Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="tel:0639732680"
              className="bg-white/5 hover:bg-[#D4AF37] hover:text-black text-[#F5F5F0] p-2.5 rounded-full transition border border-white/10 flex items-center justify-center"
              title="Chiamata rapida"
            >
              <Phone className="w-4 h-4" />
            </a>
            
            <button
              onClick={() => scrollToSection("prenotazioni")}
              className="bg-[#D4AF37] hover:bg-[#F5F5F0] text-black font-black text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 transition uppercase tracking-widest cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tavolo</span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. HERO / WELCOME SECTION */}
      <section id="hero" className="relative pt-24 md:pt-36 pb-12 md:pb-24 overflow-hidden bg-[#0F0F0F] border-b border-white/5">
        
        {/* Abstract design elements to look styled, not generic */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#D4AF37]/3 rounded-full blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Selling Points */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-4.5 py-2 rounded-full text-xs font-black tracking-widest uppercase animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Asporto (Takeaway) Sconto 20%</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-sans font-black text-[#F5F5F0] leading-[0.95] tracking-tighter uppercase italic">
                La bontà asiatica, <br />
                <span className="text-[#D4AF37] font-serif not-italic tracking-tight normal-case lowercase first-letter:uppercase">comoda ed autentica.</span>
              </h1>

              <p className="text-[#F5F5F0]/80 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Benvenuti al Ristorante Giapponese e Cinese <span className="text-[#D4AF37] font-bold">Monica Li</span> all'Infernetto, Roma. Utilizziamo materie prime freschissime preparate al momento per asporto, domicilio ed all you can eat.
              </p>

              {/* Fast Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => scrollToSection("menu-interattivo")}
                  className="bg-white hover:bg-[#D4AF37] text-black font-black py-4 px-8 rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs"
                >
                  Sfoglia il Menù
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection("prenotazioni")}
                  className="bg-transparent hover:bg-white/5 text-white border-2 border-white/20 hover:border-[#D4AF37] font-black py-4 px-8 rounded-full transition duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs"
                >
                  Prenota Tavolo
                </button>
              </div>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 max-w-md mx-auto lg:mx-0">
                <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] text-[#F5F5F0]/40 font-mono block uppercase font-bold tracking-wider">All You Can Eat</span>
                  <span className="text-sm font-black text-[#F5F5F0] block mt-1 font-mono">da 18.90€</span>
                </div>
                <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] text-[#F5F5F0]/40 font-mono block uppercase font-bold tracking-wider">Sconto Asporto</span>
                  <span className="text-sm font-black text-[#D4AF37] block mt-1 font-mono">-20% Sconto</span>
                </div>
                <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] text-[#F5F5F0]/40 font-mono block uppercase font-bold tracking-wider">Consegna</span>
                  <span className="text-sm font-black text-[#D4AF37] block mt-1 font-mono">€2.00 Fisso</span>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic Visual Presentation */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Outer decorative Circle */}
              <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full scale-95 border border-dashed border-[#D4AF37]/20 -z-10 animate-[spin_100s_linear_infinite]" />
              
              <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80"
                  alt="Specialità Sushi Monica Li"
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Badge 1: Delivery service */}
                <div className="absolute top-4 left-4 bg-black/95 border border-white/10 p-3.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="bg-white/10 text-[#D4AF37] p-2 rounded-xl">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-white/40 font-mono block tracking-wider">Consegna Domicilio</span>
                    <span className="text-xs font-black text-[#F5F5F0]">Roma Infernetto</span>
                  </div>
                </div>

                {/* Float Badge 2: All You can eat Promo info */}
                <div className="absolute bottom-4 right-4 bg-black/95 border border-white/10 p-4 rounded-2xl shadow-lg max-w-[200px]">
                  <p className="text-[9px] uppercase font-mono font-black text-white/40 tracking-wider">All You Can Eat</p>
                  <p className="text-xs font-black text-[#F5F5F0] mt-1 font-mono">Pranzo: <span className="text-[#D4AF37]">18.90€</span></p>
                  <p className="text-xs font-black text-[#F5F5F0] mt-0.5 font-mono">Cena: <span className="text-[#D4AF37]">25.90€</span></p>
                  <span className="text-[8px] text-[#F5F5F0]/40 mt-1 block font-mono">escluso dolci e bevande</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. DIGITAL INTERACTIVE MENU */}
      <InteractiveMenu />

      {/* 5. FILTERABLE DISH PHOTO GALLERY */}
      <PhotoGallery />

      {/* 6. WHATSAPP BOOKING RESY ENGINE */}
      <WhatsAppBooking />

      {/* 7. LOCATION & MAPS CARD */}
      <LocationMap />

      {/* 8. NEWS & CLIENT REVIEWS */}
      <NewsAndReviews />

      {/* 9. RAW SEAFOOD SAFETY AND COMPLIANCE NOTICE */}
      <section className="bg-[#141414] border-t border-b border-white/5 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 bg-white/5 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wider">Trattamento Sicuro del Pesce Crudo</h4>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed max-w-2xl mx-auto italic font-medium">
            "Il pesce destinato ad essere consumato crudo o praticamente crudo è stato sottoposto a trattamento di bonifica preventiva (abbattimento rapido di temperatura) conforme alle prescrizioni del Regolamento CE 853/2004, allegato III, sezione VIII, capitolo 3, lettera D, punto 3. Prodotti surgelati - I piatti contrassegnati con (*) sono preparati con materia prima congelata o surgelata all'origine."
          </p>
          <p className="text-[10px] text-[#F5F5F0]/40 font-mono uppercase tracking-widest">
            Ai sensi del Reg. UE 1169/11 i clienti sono pregati di segnalare intolleranze o allergie alimentari al personale di sala prima dell'ordinazione.
          </p>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-black text-[#F5F5F0] pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="text-3xl">🌸</span>
              <div>
                <span className="font-serif font-black text-base tracking-widest text-[#F5F5F0] uppercase">Monica Li</span>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-mono font-bold block">Giapponese & Cinese</span>
              </div>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 leading-normal font-medium">
              Il gusto autentico dell'Oriente all'Infernetto, Roma. Sconto Takeaway del 20% sempre attivo con ritiro rapido.
            </p>
          </div>

          {/* Col 2: Useful Links */}
          <div className="space-y-4 text-center md:text-left">
            <h5 className="font-mono text-xs font-black uppercase tracking-widest text-[#D4AF37]">Navigazione</h5>
            <ul className="space-y-2.5 text-xs text-[#F5F5F0]/70 font-semibold uppercase tracking-wider">
              <li><button onClick={() => scrollToSection("hero")} className="hover:text-[#D4AF37] transition cursor-pointer">Inizio / Home</button></li>
              <li><button onClick={() => scrollToSection("menu-interattivo")} className="hover:text-[#D4AF37] transition cursor-pointer">Menù Interattivo</button></li>
              <li><button onClick={() => scrollToSection("galleria")} className="hover:text-[#D4AF37] transition cursor-pointer">Galleria Foto</button></li>
              <li><button onClick={() => scrollToSection("prenotazioni")} className="hover:text-[#D4AF37] transition cursor-pointer">Prenota Tavolo</button></li>
              <li><button onClick={() => scrollToSection("dove-siamo")} className="hover:text-[#D4AF37] transition cursor-pointer">Mappa & Orari</button></li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-4 text-center md:text-left">
            <h5 className="font-mono text-xs font-black uppercase tracking-widest text-[#D4AF37]">Contatti</h5>
            <ul className="space-y-2.5 text-xs text-[#F5F5F0]/70 font-medium">
              <li className="flex justify-center md:justify-start items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Via Egna 3, Roma Infernetto</span>
              </li>
              <li className="flex justify-center md:justify-start items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <a href="tel:0639732680" className="hover:underline hover:text-[#D4AF37]">06 3973 2680</a>
              </li>
              <li className="flex justify-center md:justify-start items-center gap-1.5 font-mono">
                <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <a href="https://wa.me/3515032333" className="hover:underline hover:text-[#D4AF37]">351 503 2333</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Socials */}
          <div className="space-y-4 text-center md:text-left">
            <h5 className="font-mono text-xs font-black uppercase tracking-widest text-[#D4AF37]">Seguici</h5>
            <p className="text-xs text-[#F5F5F0]/60 font-medium font-serif italic">Resta sintonizzato sui nostri canali social per sconti extra o piatti speciali:</p>
            <div className="flex justify-center md:justify-start gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-xl transition border border-white/10"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-xl transition border border-white/10"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Legal notice */}
        <div className="max-w-7xl mx-auto px-4 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#F5F5F0]/40 font-mono gap-4 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Ristorante Monica Li. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline hover:text-[#D4AF37]">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-[#D4AF37]">Termini d'Uso</a>
            <a href="#" className="hover:underline hover:text-[#D4AF37]">ristorantemonicali.com</a>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION STRIP FOR MOBILE QUICK CALL / BOOKING */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-white/10 py-3 px-4 flex items-center justify-between shadow-2xl">
        <a 
          href="tel:0639732680"
          className="flex-1 bg-[#1A1A1A] hover:bg-white/10 border border-white/15 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition mr-2 uppercase tracking-widest"
        >
          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
          Chiama Ora
        </a>
        <button
          onClick={() => scrollToSection("menu-interattivo")}
          className="flex-1 bg-[#D4AF37] hover:bg-[#F5F5F0] text-black font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ordina Asporto
        </button>
      </div>

      {/* BACK TO TOP FLOATING ACTION BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-40 right-6 md:bottom-24 md:right-6 z-40 bg-black hover:bg-[#D4AF37] hover:text-black text-white p-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center cursor-pointer border border-white/10"
            title="Torna in alto"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
