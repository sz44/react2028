export default function Tile({
  value,
  col,
  row,
}: {
  value: number;
  col: number;
  row: number;
}) {
  const TileSize = 64;
  return (
    <div
      className="tile"
      style={{
        transform: `translate(${col * TileSize}px, ${row * TileSize}px)`,
      }}
    >
      {value}
    </div>
  );
}
