export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bouclier */}
      <path
        d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z"
        fill="#1A1A1A"
      />
      {/* Dégradé interne subtil */}
      <path
        d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z"
        fill="#2D2D2D"
      />
      {/* Coche verte */}
      <path
        d="M10.5 16.5L14 20L21.5 12.5"
        stroke="#4ADE80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lettre M stylisée en blanc — optionnel, décommentez si vous préférez */}
      {/* <text x="9" y="21" fontFamily="helvetica" fontWeight="bold" fontSize="13" fill="white">M</text> */}
    </svg>
  );
}