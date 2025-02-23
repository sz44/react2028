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

function createBoard(map: Map<string, Tile>) {
  const board = Array.from({ length: 4 }, () => ["", "", "", ""]);
  map.forEach((tile, id) => (board[tile.row][tile.col] = id));
  return board;
}

function getMergeList(map: Map<string, Tile>) {
  const mergeList: string[][] = [];
  const seen: string[] = [];
  map.forEach((tile, id) => {
    const ind = tile.row * 4 + tile.col;
    if (seen[ind]) {
      mergeList.push([seen[ind], id]);
    } else {
      seen[ind] = id;
    }
  });
  return mergeList;
}

export default function Board() {
  const [tileMap, setTileMap] = useState<Map<string, Tile>>(startMap);
  // const [isMoving, setIsMoving] = useState(false);
  // const [mergeList, setMergeList] = useState([]);

  function mergeAndAdd(prevTileMap: Map<string, Tile>) {
    const nextTileMap = new Map(prevTileMap);
    const mergeList = getMergeList(prevTileMap);
    mergeList.forEach((pair) => {
      nextTileMap.delete(pair[0]);
      const obj = prevTileMap.get(pair[1])!;
      nextTileMap.set(pair[1], {
        value: obj.value * 2,
        row: obj.row,
        col: obj.col,
      });
    });

    // add new tile
    const board = createBoard(prevTileMap);
    let rr = Math.floor(Math.random() * 4);
    let rc = Math.floor(Math.random() * 4);
    while (board[rr][rc] != "") {
      rr = Math.floor(Math.random() * 4);
      rc = Math.floor(Math.random() * 4);
    }
    nextTileMap.set(uid(), { value: 2, row: rr, col: rc });

    return nextTileMap;
  }

  function moveTiles(
    prevTileMap: Map<string, Tile>,
    direction: "left" | "right" | "up" | "down",
  ) {
    const board = createBoard(prevTileMap);
    const size = board.length;
    const nextTileMap = new Map(prevTileMap);
    const nextMergeList = [];

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
            nextMergeList.push([id, nid]);
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
    } else if (direction === "left") {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          traverse(row, col, 0, -1);
        }
      }
    } else if (direction === "up") {
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          traverse(row, col, -1, 0);
        }
      }
    } else if (direction === "down") {
      for (let col = 0; col < size; col++) {
        for (let row = size - 2; row >= 0; row--) {
          traverse(row, col, 1, 0);
        }
      }
    }
    return nextTileMap;
  }

  useEffect(() => {
    let isMoving = false;
    function handleKeyPress(event: KeyboardEvent) {
      if (isMoving) {
        console.log("isMoving");
        return;
      }
      if (event.key === "d") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "right");
          return nextTileMap;
        });
      } else if (event.key === "a") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "left");
          return nextTileMap;
        });
      } else if (event.key === "w") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "up");
          return nextTileMap;
        });
      } else if (event.key === "s") {
        setTileMap((prev) => {
          const nextTileMap = moveTiles(prev, "down");
          return nextTileMap;
        });
      }
      if (["s", "w", "a", "d"].includes(event.key)) {
        isMoving = true;
        setTimeout(() => {
          // AddNewTile(nextTileMap);
          // setIsMoving(false);
          isMoving = false;
          setTileMap((prev) => {
            console.log("do merge and add new");
            return mergeAndAdd(prev);
          });
          // setMergeList(nextMergeList)
        }, 200);
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
