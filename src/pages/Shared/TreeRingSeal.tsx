import { useId } from "react";

/* ---------------- Signature element: carved wax-seal mark ---------------- */
interface TreeRingSealProps {
  size?: number;
}

export default function TreeRingSeal({ size = 78 }: TreeRingSealProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div className="tree-ring-seal absolute -top-2 -right-2 z-10 drop-shadow-md" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="47" fill="#A8823C" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="#7A5F2E" strokeWidth="1.5" opacity="0.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FAF6EF" strokeWidth="0.6" opacity="0.55" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FAF6EF" strokeWidth="0.6" opacity="0.55" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="#FAF6EF" strokeWidth="0.6" opacity="0.55" />
        <path id={id} d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="none" />
        <text fill="#FAF6EF" fontSize="8.6" letterSpacing="1.5" fontFamily="Karla, sans-serif" fontWeight="700">
          <textPath href={`#${id}`} startOffset="2%">
            CRAFT BARI • CRAFT BARI •
          </textPath>
        </text>
      </svg>
    </div>
  );
}