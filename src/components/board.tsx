import { useState, useEffect, KeyboardEvent } from "react";
import TileComponent from "./tile";

type Tile = {
  value: number;
  col: number;
  row: number;
};

const uid = () => Date.now().toString(36);

const startMap = new Map<string, Tile>();
const first = uid();
startMap.set(first, { value: 2, col: 1, row: 1 });

// const createBoard = () => Array.from(["", "", "", ""], () => ["", "", "", ""]);
// const board = createBoard();
// board[1][1] = first;

function createBoard(map: Map<string, Tile>) {
  const board = Array.from({ length: 4 }, () => ["", "", "", ""]);
  map.forEach((tile, id) => (board[tile.row][tile.col] = id));
  return board;
}

const mergeList: string[][] = [];

export default function Board() {
  const [tileMap, setTileMap] = useState<Map<string, Tile>>(startMap);

  function moveTiles(
    prevTileMap: Map<string, Tile>,
    direction: "left" | "right",
  ) {
    const board = createBoard(prevTileMap);
    const size = board.length;
    const nextTileMap = new Map(prevTileMap);

    function traverse(r: number, c: number, dr: number, dc: number) {
      const id = board[r][c];
      if (!id) return;
      let nr = r,
        nc = c;
      while (true) {
        const nextR = nr + dr,
          nextC = nc + dc;
        if (nextR >= size || nextR < 0 || nextC >= size || nextC < 0) break;
        const nid = board[nextR][nextC];
        if (!nid) {
          nr = nextR;
          nc = nextC;
        } else {
          if (prevTileMap.get(id)?.value === prevTileMap.get(nid)?.value) {
            nr = nextR;
            nc = nextC;
            mergeList.push([id, nid]);
          }
          break;
        }
      }
      // update table
      const temp = board[r][c];
      board[r][c] = "";
      board[nr][nc] = temp;
      // update map
      nextTileMap.set(temp, {
        value: prevTileMap.get(temp)!.value,
        row: nr,
        col: nc,
      });
    }
    if (direction === "right") {
      for (let row = 0; row < size; row++) {
        for (let col = size - 2; col >= 0; col--) {
          traverse(row, col, 0, 1);
        }
      }
    }
    if (direction === "left") {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          traverse(row, col, 0, -1);
        }
      }
    }
    return nextTileMap;
  }

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key == "d") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "right");
          return nextTileMap;
        });
      } else if (event.key == "a") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "left");
          return nextTileMap;
        });
      }
    }
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="board">
      {[...tileMap.entries()].map(([id, tile]) => (
        <TileComponent key={id} {...tile} />
      ))}
    </div>
  );
}
