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

const createBoard = () => Array.from(["", "", "", ""], () => ["", "", "", ""]);
const board = createBoard();
board[1][1] = first;

const mergeList: string[][] = [];

export default function Board() {
  const [tileMap, setTileMap] = useState<Map<string, Tile>>(startMap);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key == "d") {
        const nextTileMap = new Map(tileMap);
        for (let row = 0; row < board.length; row++) {
          for (let col = board.length - 2; col >= 0; col--) {
            if (board[row][col]) {
              console.log("found at: ", row, col);
              // clac new position
              let newCol = col + 1;
              while (newCol < board.length) {
                if (board[row][newCol] === "") {
                  newCol++;
                  continue;
                }
                const tileA = tileMap.get(board[row][col]);
                const tileB = tileMap.get(board[row][newCol]);
                if (tileA?.value === tileB?.value) {
                  mergeList.push([board[row][col], board[row][newCol]]);
                  newCol++;
                }
                break;
              }
              // update board
              const temp = board[row][col];
              board[row][col] = "";
              board[row][newCol] = temp;
              console.log(" moving to : ", row, newCol);
              // update map
              const prev = nextTileMap.get(temp)!;
              nextTileMap.set(temp, { ...prev, col: newCol });
            }
          }
        }
        setTileMap(nextTileMap);
        // setTileMap((prev) => {
        //   const nextTileMap = new Map<string, Tile>();
        //   for (const [id, tile] of prev) {
        //     const nextValue = { ...tile, col: tile.col + 1 };
        //     nextTileMap.set(id, nextValue);
        //   }
        //   return nextTileMap;
        // });
      } else if (event.key == "a") {
        setTileMap((prev) => {
          const nextTileMap = new Map<string, Tile>();
          for (const [key, value] of prev) {
            nextTileMap.set(key, { ...value, col: value.col - 1 });
          }
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
