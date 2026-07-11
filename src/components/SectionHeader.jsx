/**
 * SectionHeader.jsx — Consistent header for every main-page section
 * Props: eyebrow (small teal kicker), title, subtitle (optional),
 *        right (optional node rendered on the right, bottom-aligned)
 * Keeps typography/spacing identical across sections — edit here, not per section.
 */
export default function SectionHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
      <div>
        {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-white/40 text-sm mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
