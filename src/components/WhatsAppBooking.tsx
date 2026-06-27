import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Calendar, Users, Clock, MessageSquare, Phone, CheckCircle, Smartphone } from "lucide-react";

export default function WhatsAppBooking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Compose booking URL dynamically
  const bookingUrl = useMemo(() => {
    if (!name.trim() || !date || !time) return "";

    const formattedDate = date.split("-").reverse().join("/");

    // Compose polite booking message
    let message = `*PRENOTAZIONE TAVOLO ONLINE*\n`;
    message += `-----------------------------------\n`;
    message += `👤 *Nome:* ${name}\n`;
    if (phone) message += `📞 *Telefono:* ${phone}\n`;
    message += `📅 *Data:* ${formattedDate}\n`;
    message += `🕒 *Ora:* ${time}\n`;
    message += `👥 *Numero Persone:* ${guests} ${guests === 1 ? "Persona" : "Persone"}\n`;
    if (notes.trim()) {
      message += `📝 *Note Speciali:* ${notes}\n`;
    }
    message += `-----------------------------------\n`;
    message += `Attendo gentile conferma della disponibilità. Grazie!`;

    const encodedText = encodeURIComponent(message);
    // WhatsApp number: 351 503 2333
    return `https://api.whatsapp.com/send?phone=393515032333&text=${encodedText}`;
  }, [name, phone, date, time, guests, notes]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12" id="prenotazioni">
      <div className="bg-[#141414] rounded-3xl border border-white/5 p-6 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Background visual graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-2xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Form Explainer Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase font-black">Tavolo Privato</span>
              <h3 className="text-3xl md:text-4xl font-serif font-black text-[#F5F5F0] mt-2 uppercase tracking-tight">Prenota Online</h3>
            </div>
            
            <p className="text-[#F5F5F0]/60 text-xs md:text-sm leading-relaxed font-medium">
              La prenotazione è gratuita e si collega direttamente al nostro canale WhatsApp aziendale per darti una risposta istantanea sul tavolo.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs md:text-sm text-[#F5F5F0]/80 font-medium">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>Nessun costo di prenotazione</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-[#F5F5F0]/80 font-medium">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>Modifiche o disdette rapide via chat</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-[#F5F5F0]/80 font-medium">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>Conferma istantanea h24</span>
              </div>
            </div>

            {/* Quick Calls Box */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-black text-white/40 font-mono block tracking-wider">Hai fretta? Telefona direttamente:</span>
              <a 
                href="tel:0639732680"
                className="flex items-center gap-2 text-[#D4AF37] hover:text-[#F5F5F0] font-black text-xs md:text-sm uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" />
                06 3973 2680
              </a>
            </div>
          </div>

          {/* Table Booking Form Container */}
          <div className="lg:col-span-7 bg-black p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                  ✓
                </div>
                <h4 className="font-serif font-black text-xl text-[#F5F5F0] uppercase tracking-wide">Richiesta Inviata!</h4>
                <p className="text-sm text-[#F5F5F0]/60 max-w-sm mx-auto font-medium">
                  Hai aperto la chat con Monica Li su WhatsApp. Ti risponderemo a breve per confermare il tuo tavolo.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-xs text-[#D4AF37] font-black uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Effettua un'altra prenotazione
                </button>
              </motion.div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5">Il Tuo Nome *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="es: Mario Rossi"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5">Telefono (Opzionale)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="es: 345 123 4567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Ora *
                    </label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Number of Guests Selector */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Numero Ospiti
                  </label>
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 max-w-[200px]">
                    <button
                      type="button"
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center font-bold text-white hover:bg-white/10 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-white">
                      {guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center font-bold text-white hover:bg-white/10 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-[#F5F5F0]/60 font-mono tracking-wider mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Esigenze Speciali (Allergie, Intolleranze, Bambini...)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Esempi: Allergia alla soia, sedia per bambini, tavolo silenzioso..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F0] placeholder-white/20 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:ring-1 focus:outline-none h-20 resize-none"
                  />
                </div>

                {/* Action button */}
                <a
                  href={bookingUrl || "#"}
                  target={bookingUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!name.trim() || !date || !time) {
                      e.preventDefault();
                      alert("Per favore, compila tutti i campi obbligatori (*).");
                      return;
                    }
                    setIsSuccess(true);
                  }}
                  className="w-full mt-2 bg-[#D4AF37] hover:bg-[#F5F5F0] text-black font-black py-4 rounded-xl shadow-lg shadow-[#D4AF37]/5 flex items-center justify-center gap-2 transition cursor-pointer uppercase tracking-widest text-xs text-center inline-flex"
                >
                  <Smartphone className="w-5 h-5" />
                  Prenota via WhatsApp
                </a>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
