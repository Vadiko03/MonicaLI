import { motion } from "motion/react";
import { MapPin, Phone, Clock, Navigation, ExternalLink, Calendar } from "lucide-react";

export default function LocationMap() {
  const address = "Via Egna 3, 00124 Zona Infernetto Roma";
  const mapQuery = encodeURIComponent(address);

  // Clean, high-quality Google Maps embed for Via Egna 3, Roma Infernetto (without donation/report links)
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("Via Egna 3, Roma Infernetto")}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12" id="dove-siamo">
      <div className="text-center mb-12">
        <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">Vienici a Trovare</span>
        <h2 className="text-4xl md:text-6xl font-serif font-black text-[#F5F5F0] mt-2 uppercase tracking-tight">Dove Siamo e Orari</h2>
        <p className="text-[#F5F5F0]/60 max-w-xl mx-auto mt-3 text-xs md:text-sm font-medium">
          Siamo nel cuore della zona Infernetto a Roma, pronti ad accoglierti in un ambiente intimo, raffinato e confortevole.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#141414] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        {/* Info Card Panel */}
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-[#141414]">
          
          {/* Section 1: Address and GPS Quick buttons */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 text-[#D4AF37] p-3 rounded-2xl shrink-0 border border-white/10">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wider">Indirizzo</h4>
                <p className="text-sm text-[#F5F5F0]/80 font-medium">{address}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition"
                  >
                    <Navigation className="w-3 h-3 text-blue-400" />
                    Google Maps
                  </a>
                  <a
                    href={`https://waze.com/ul?q=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition"
                  >
                    <ExternalLink className="w-3 h-3 text-sky-400" />
                    Waze
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 text-[#D4AF37] p-3 rounded-2xl shrink-0 border border-white/10">
                <Phone className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h4 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wider">Contatti & Chiamata</h4>
                <p className="text-[10px] text-[#F5F5F0]/40 font-mono uppercase tracking-wider mt-1">Seleziona un numero per chiamare al volo:</p>
                
                <div className="mt-3 space-y-2 w-full">
                  <a
                    href="tel:0639732680"
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition text-xs text-[#F5F5F0] font-black cursor-pointer group font-mono uppercase tracking-wider"
                  >
                    <span>📞 06 3973 2680</span>
                    <span className="text-[10px] bg-[#D4AF37] text-black font-mono py-0.5 px-2.5 rounded-md font-black group-hover:bg-white transition uppercase tracking-widest">CHIAMA</span>
                  </a>
                  <a
                    href="tel:3515032333"
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition text-xs text-[#F5F5F0] font-black cursor-pointer group font-mono uppercase tracking-wider"
                  >
                    <span>📱 351 503 2333</span>
                    <span className="text-[10px] bg-[#D4AF37] text-black font-mono py-0.5 px-2.5 rounded-md font-black group-hover:bg-white transition uppercase tracking-widest">CHIAMA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Opening Hours */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 text-[#D4AF37] p-3 rounded-2xl shrink-0 border border-white/10">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-black text-lg text-[#F5F5F0] uppercase tracking-wider">Orari Ristorante</h4>
                <p className="text-xs text-[#F5F5F0]/60 font-semibold mt-1 uppercase tracking-wider">Dal Lunedì alla Domenica</p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-black p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-black">PRANZO</span>
                    <span className="font-black text-[#D4AF37] text-sm">12.00 – 15.00</span>
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px] font-black">CENA</span>
                    <span className="font-black text-[#D4AF37] text-sm">18.30 – 23.30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Map Embedding Panel */}
        <div className="lg:col-span-7 h-[450px] lg:h-auto relative bg-[#141414]">
          <iframe
            title="Mappa Monica Li"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            scrolling="no"
            src={googleMapsEmbedUrl}
            className="w-full h-full border-0 opacity-40 hover:opacity-100 transition-all duration-700 invert"
          />
          {/* Overlay info box on the map */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl flex items-center justify-between gap-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🍣</span>
              <div>
                <p className="font-black text-xs text-[#F5F5F0] uppercase tracking-wider">Monica Li Ristorante</p>
                <p className="text-[10px] text-[#F5F5F0]/50 font-medium">Via Egna 3, Roma (Infernetto)</p>
              </div>
            </div>
            <a
              href={`https://maps.google.com/?q=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4AF37] hover:bg-[#F5F5F0] text-black text-[10px] font-black px-3.5 py-2.5 rounded-lg transition shrink-0 flex items-center gap-1 uppercase tracking-widest"
            >
              NAVIGA
              <Navigation className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
