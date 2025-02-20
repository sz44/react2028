export default function Tile({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <div className="tile" style={{ left: `${x * 64}px`, top: `${y * 64}px` }}>
      {n}
    </div>
  );
}
