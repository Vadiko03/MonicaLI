import { motion } from "motion/react";
// @ts-ignore
import monicaLiLogo from "../assets/images/monica_li_logo_1782576257808.jpg";

interface LogoProps {
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export default function CherryBlossomLogo({
  interactive = true,
  size = "md",
  showSubtitle = true,
}: LogoProps) {
  // Size classes
  const sizeClasses = {
    sm: {
      wrapper: "min-h-[48px] py-0.5",
      img: "w-10 h-10",
      rounded: "rounded-full",
      title: "text-lg sm:text-xl",
      subtitle: "text-[8px]",
    },
    md: {
      wrapper: "min-h-[120px] py-2",
      img: "w-24 h-24",
      rounded: "rounded-2xl",
      title: "text-2xl sm:text-3xl",
      subtitle: "text-[11px]",
    },
    lg: {
      wrapper: "min-h-[200px] py-4",
      img: "w-44 h-44 sm:w-48 sm:h-48",
      rounded: "rounded-[2rem]",
      title: "text-3xl sm:text-4xl md:text-5xl",
      subtitle: "text-xs md:text-sm tracking-[0.25em]",
    },
    xl: {
      wrapper: "min-h-[280px] py-6",
      img: "w-64 h-64 sm:w-72 sm:h-72",
      rounded: "rounded-[2.5rem]",
      title: "text-4xl sm:text-5xl md:text-6xl font-extrabold",
      subtitle: "text-xs sm:text-sm md:text-base tracking-[0.3em]",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${currentSize.wrapper}`}>
      {/* Brand logo image from user upload */}
      <motion.div
        className={`relative overflow-hidden ${currentSize.rounded} border border-white/10 shadow-2xl bg-white`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={interactive ? { scale: 1.05, transition: { duration: 0.3 } } : undefined}
      >
        <img
          src={monicaLiLogo}
          alt="Monica Li Logo"
          referrerPolicy="no-referrer"
          className={`${currentSize.img} object-cover`}
        />
        {/* Subtle overlay for styling integration */}
        <div className={`absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none ${currentSize.rounded}`} />
      </motion.div>

      {/* Subtitle / context underneath if size is not sm or if explicitly shown */}
      {size !== "sm" && showSubtitle && (
        <motion.p
          className="font-mono text-[#D4AF37] uppercase font-semibold mt-4 select-none tracking-[0.2em] text-xs sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Ristorante Giapponese e Cinese
        </motion.p>
      )}
    </div>
  );
}
