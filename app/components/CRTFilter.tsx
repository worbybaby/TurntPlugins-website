'use client';

export default function CRTFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="crt-curve">
          {/* Subtle barrel distortion effect */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distortion"
          />
          {/* Very subtle color aberration */}
          <feColorMatrix
            in="distortion"
            type="matrix"
            values="1.005 0 0 0 0
                    0 1 0 0 0
                    0 0 0.995 0 0
                    0 0 0 1 0"
            result="colorShift"
          />
          {/* Gentle vignette */}
          <feComponentTransfer in="colorShift">
            <feFuncR type="table" tableValues="0.85 0.9 0.95 1 0.95 0.9 0.85" />
            <feFuncG type="table" tableValues="0.85 0.9 0.95 1 0.95 0.9 0.85" />
            <feFuncB type="table" tableValues="0.85 0.9 0.95 1 0.95 0.9 0.85" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
