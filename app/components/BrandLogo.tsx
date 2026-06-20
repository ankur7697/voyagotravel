type BrandLogoProps = {
  inverted?: boolean;
};

export default function BrandLogo({ inverted = false }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl shadow-lg ${
          inverted
            ? "bg-white text-[#3157d5] shadow-[#3157d5]/10"
            : "bg-[#3157d5] text-white shadow-[#3157d5]/20"
        }`}
      >
        <span className="absolute -right-4 -top-4 h-9 w-9 rounded-full bg-[#8fd8ff]/45" />
        <span className="absolute bottom-2 h-px w-8 bg-current/25" />
        <span className="absolute bottom-3 h-px w-6 bg-current/35" />
        <span className="absolute left-3 top-3 h-6 w-6 rotate-45 rounded-[5px] border-2 border-current/28" />
        <span className="relative text-xl font-black leading-none tracking-[-0.02em]">
          V
        </span>
        <span
          className={`absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full ${
            inverted ? "bg-[#ff7a59]" : "bg-[#ffd166]"
          }`}
        />
      </span>
      <span className="leading-none">
        <span
          className={`block whitespace-nowrap text-base font-black tracking-tight sm:text-xl ${
            inverted ? "text-white" : "text-[#12213f]"
          }`}
        >
          Voyagoglobal
        </span>
        <span
          className={`mt-1 block text-[10px] font-black uppercase tracking-[0.2em] ${
            inverted ? "text-white/65" : "text-[#64748b]"
          }`}
        >
          Routes made simple
        </span>
      </span>
    </span>
  );
}
