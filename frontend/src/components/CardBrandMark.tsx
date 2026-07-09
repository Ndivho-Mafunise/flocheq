// Small card-network plate shown next to saved payment methods.
// Brand marks sit on a white plate in both light and dark themes.
export default function CardBrandMark({ brand }: { brand: "visa" | "mastercard" }) {
  return (
    <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md border bg-white">
      {brand === "visa" ? (
        <span className="text-[11px] font-black italic tracking-tighter text-[#1434CB]">
          VISA
        </span>
      ) : (
        <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden="true">
          <circle cx="10" cy="8" r="7" fill="#EB001B" />
          <circle cx="16" cy="8" r="7" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      )}
    </div>
  );
}
