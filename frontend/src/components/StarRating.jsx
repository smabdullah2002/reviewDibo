export default function StarRating({ value = 0, onChange, max = 5 }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        key={i}
        onClick={onChange ? () => onChange(i) : undefined}
        style={{
          cursor: onChange ? "pointer" : "default",
          fontSize: "clamp(16px, 4vw, 22px)",
          color: i <= value ? "#f5a623" : "#ddd",
        }}
      >
        ★
      </span>
    );
  }
  return <div style={{ display: "inline-flex", gap: "clamp(1px, 0.5vw, 4px)" }}>{stars}</div>;
}
