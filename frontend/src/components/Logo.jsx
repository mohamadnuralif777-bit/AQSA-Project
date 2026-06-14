export default function Logo({ size = 56, withText = false, textColor = "#064E3B" }) {
  return (
    <div className="inline-flex items-center gap-3">
      <img
        src="/aqsa-logo.png"
        alt="AQSA Study Community Logo"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        className="rounded-full"
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-heading text-lg" style={{ color: textColor }}>AQSA Study Community</div>
          <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">Al-Qur'an &amp; Sunnah</div>
        </div>
      )}
    </div>
  );
}
