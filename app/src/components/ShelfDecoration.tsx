import { motion } from 'framer-motion';

/**
 * Decorative flower vase — placed at the right end of each shelf row.
 * Pure SVG, no external dependencies.
 */
export function ShelfDecoration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative flex-shrink-0 self-end"
      style={{ marginBottom: '2px' }}
      title="Book shelf"
    >
      <svg
        width="72"
        height="232"
        viewBox="0 0 72 232"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── Animated plant group ─────────────────── */}
        <g style={{
          transformOrigin: '36px 158px',
          animation: 'plantSway 5s ease-in-out infinite',
        }}>
          {/* Stem 1 — far left, drooping */}
          <path d="M 36 156 Q 22 138 14 110" stroke="#5a8040" strokeWidth="2.5" strokeLinecap="round" />
          {/* Stem 2 — left-center */}
          <path d="M 36 156 Q 28 128 27 95" stroke="#4a7530" strokeWidth="2" strokeLinecap="round" />
          {/* Stem 3 — upright center (tallest) */}
          <path d="M 36 156 Q 36 122 36 78" stroke="#5a8840" strokeWidth="3" strokeLinecap="round" />
          {/* Stem 4 — right-center */}
          <path d="M 36 156 Q 44 125 50 92" stroke="#4a7530" strokeWidth="2" strokeLinecap="round" />
          {/* Stem 5 — far right, drooping */}
          <path d="M 36 156 Q 52 138 60 112" stroke="#5a8040" strokeWidth="2.5" strokeLinecap="round" />

          {/* ── Leaves ── */}
          {/* Far-left leaves */}
          <ellipse cx="13" cy="106" rx="13" ry="5.5" fill="#6a9d3a" transform="rotate(-42 13 106)" opacity="0.92" />
          <ellipse cx="17" cy="118" rx="10" ry="4.5" fill="#5a8830" transform="rotate(-52 17 118)" opacity="0.82" />

          {/* Left-center leaf */}
          <ellipse cx="27" cy="91" rx="11" ry="5" fill="#7ab045" transform="rotate(-22 27 91)" opacity="0.9" />

          {/* Center — big sunflower */}
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <ellipse
              key={i}
              cx={36 + 12 * Math.cos((deg * Math.PI) / 180)}
              cy={74 + 12 * Math.sin((deg * Math.PI) / 180)}
              rx="7"
              ry="5"
              fill="#f5d840"
              opacity="0.93"
              transform={`rotate(${deg} ${36 + 12 * Math.cos((deg * Math.PI) / 180)} ${74 + 12 * Math.sin((deg * Math.PI) / 180)})`}
            />
          ))}
          {/* Flower center disc */}
          <circle cx="36" cy="74" r="9" fill="#c47810" />
          <circle cx="36" cy="74" r="6" fill="#a05c08" />
          {/* Center texture dots */}
          {[[-2, -2], [2, -2], [-2, 2], [2, 2], [0, 0]].map(([dx, dy], i) => (
            <circle key={i} cx={36 + dx} cy={74 + dy} r="1.2" fill="#8a4c04" opacity="0.7" />
          ))}

          {/* Right-center leaf */}
          <ellipse cx="51" cy="88" rx="11" ry="5" fill="#6a9d3a" transform="rotate(22 51 88)" opacity="0.9" />

          {/* Far-right leaves */}
          <ellipse cx="61" cy="108" rx="13" ry="5.5" fill="#5a8830" transform="rotate(42 61 108)" opacity="0.92" />
          <ellipse cx="57" cy="120" rx="10" ry="4.5" fill="#6a9d3a" transform="rotate(50 57 120)" opacity="0.82" />

          {/* Small accent buds on far stems */}
          <circle cx="14" cy="108" r="4.5" fill="#f0c030" opacity="0.7" />
          <circle cx="58" cy="110" r="4.5" fill="#f0c030" opacity="0.7" />
        </g>

        {/* ── Soil / Vase opening ─────────────────── */}
        <ellipse cx="36" cy="158" rx="21" ry="7.5" fill="#2a1a08" />

        {/* ── Vase body ───────────────────────────── */}
        {/* Main body — curves out then in to base */}
        <path
          d="M 15 158 C 4 172 8 214 19 228 L 53 228 C 64 214 68 172 57 158 Z"
          fill="#9b6040"
        />
        {/* Inner shadow on right side */}
        <path
          d="M 52 160 C 62 172 62 208 56 224 L 60 224 C 67 208 67 172 57 160 Z"
          fill="rgba(0,0,0,0.18)"
        />
        {/* Left highlight — light catching on ceramic */}
        <path
          d="M 18 164 C 8 178 9 210 14 222 L 19 220 C 15 207 14 178 21 166 Z"
          fill="rgba(255,255,255,0.13)"
        />

        {/* Decorative painted band on vase */}
        <path d="M 10 196 Q 36 190 62 196" stroke="#b87a40" strokeWidth="2" fill="none" opacity="0.55" />
        <path d="M 11 200 Q 36 194 61 200" stroke="#c89048" strokeWidth="1.2" fill="none" opacity="0.35" />
        {/* Small dots on band */}
        {[18, 28, 36, 44, 54].map((x, i) => (
          <circle key={i} cx={x} cy={196} r="1.8" fill="#d4a050" opacity="0.4" />
        ))}

        {/* ── Vase neck rim ──────────────────────── */}
        <ellipse cx="36" cy="158" rx="21" ry="7.5" stroke="#7a4e28" strokeWidth="2" fill="#8a5530" />
        {/* Rim top highlight */}
        <path d="M 17 156 Q 36 151 55 156" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />

        {/* ── Vase base foot ─────────────────────── */}
        <ellipse cx="36" cy="228" rx="17" ry="5" fill="#7a4e28" />
        <ellipse cx="36" cy="228" rx="17" ry="5" stroke="#5a3818" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* ── Shelf shadow ───────────────────────── */}
        <ellipse cx="36" cy="233" rx="24" ry="5" fill="rgba(0,0,0,0.22)" />
      </svg>
    </motion.div>
  );
}
