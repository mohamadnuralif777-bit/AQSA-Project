export default function Logo({ size = 56, withText = false, textColor = "#064E3B" }) {
  return (
    <div className="inline-flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-label="AQSA Study Community">
        {/* Outer green ring */}
        <circle cx="60" cy="60" r="56" fill="#064E3B" />
        <circle cx="60" cy="60" r="56" fill="none" stroke="#D4AF37" strokeWidth="2" />

        {/* Decorative lantern ornaments top */}
        <path d="M40 14 Q60 4 80 14" stroke="#D4AF37" strokeWidth="2" fill="none" />
        <circle cx="60" cy="10" r="3" fill="#D4AF37" />
        <circle cx="44" cy="16" r="2" fill="#D4AF37" />
        <circle cx="76" cy="16" r="2" fill="#D4AF37" />

        {/* Inner darker circle */}
        <circle cx="60" cy="62" r="44" fill="#043B2C" />
        <circle cx="60" cy="62" r="44" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />

        {/* Curved top arc text */}
        <defs>
          <path id="arcTop" d="M 24 62 A 36 36 0 0 1 96 62" fill="none" />
        </defs>
        <text fill="#FDFBF7" fontSize="8" fontFamily="serif" letterSpacing="1.2" fontWeight="700">
          <textPath href="#arcTop" startOffset="50%" textAnchor="middle">
            AL-QUR'AN &amp; SUNNAH
          </textPath>
        </text>

        {/* Open book in center */}
        <g transform="translate(60 64)">
          {/* Book pages base */}
          <path d="M-22 6 L-22 -6 Q-22 -10 -18 -10 L-2 -8 L-2 10 L-18 8 Q-22 8 -22 6 Z" fill="#FBBF24" />
          <path d="M22 6 L22 -6 Q22 -10 18 -10 L2 -8 L2 10 L18 8 Q22 8 22 6 Z" fill="#FBBF24" />
          {/* Inner pages lighter */}
          <path d="M-20 4 L-20 -6 L-3 -7 L-3 8 Z" fill="#FEF3C7" />
          <path d="M20 4 L20 -6 L3 -7 L3 8 Z" fill="#FEF3C7" />
          {/* Page lines */}
          <line x1="-17" y1="-3" x2="-6" y2="-3.5" stroke="#D97757" strokeWidth="0.8" />
          <line x1="-17" y1="0" x2="-6" y2="-0.5" stroke="#D97757" strokeWidth="0.8" />
          <line x1="-17" y1="3" x2="-6" y2="2.5" stroke="#D97757" strokeWidth="0.8" />
          <line x1="6" y1="-3.5" x2="17" y2="-3" stroke="#D97757" strokeWidth="0.8" />
          <line x1="6" y1="-0.5" x2="17" y2="0" stroke="#D97757" strokeWidth="0.8" />
          <line x1="6" y1="2.5" x2="17" y2="3" stroke="#D97757" strokeWidth="0.8" />
          {/* Spine glow */}
          <circle cx="0" cy="-5" r="2.5" fill="#FDE68A" opacity="0.9" />
        </g>

        {/* Year 20 24 */}
        <text x="22" y="68" fill="#D4AF37" fontSize="9" fontFamily="serif" fontWeight="700">20</text>
        <text x="89" y="68" fill="#D4AF37" fontSize="9" fontFamily="serif" fontWeight="700">24</text>

        {/* Bottom text STUDY COMMUNITY */}
        <text x="60" y="96" fill="#FDFBF7" fontSize="7.2" fontFamily="serif" letterSpacing="1.4" textAnchor="middle" fontWeight="700">
          STUDY COMMUNITY
        </text>
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className="font-heading text-lg" style={{ color: textColor }}>AQSA Study Community</div>
          <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">Al-Qur'an &amp; Sunnah</div>
        </div>
      )}
    </div>
  );
}
