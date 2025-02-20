import { useState, useEffect, KeyboardEvent } from "react";
import Tile from "./tile";
function createBoard() {
  // let board = Array(4).fill(0).map(() => [0, 0, 0, 0]);
  const board = Array.from([0, 0, 0, 0], () => [0, 0, 0, 0]);
  board[1][1] = 1;
  return board;
}

function copyBoard(board: number[][]) {
  const copy = createBoard();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      copy[row][col] = board[row][col];
    }
  }
  return copy;
}

export default function Board() {
  const [pos, setPos] = useState([0, 0]);
  const [board, setBoard] = useState(createBoard());

  function moveRight() {
    console.log("starting move right...");
    let nextBoard = copyBoard(board);
    for (let row = 0; row < board.length; row++) {
      for (let col = board.length - 1; col >= 0; col--) {
        if (board[row][col]) {
          console.log("found at: ", row, col);
          let newCol = col + 1;
          // while can move right
          while (newCol < board.length - 1 && nextBoard[row][newCol] == 0) {
            newCol++;
          }
          console.log(" moveing to : ", row, newCol);
          nextBoard[row][newCol] = nextBoard[row][col];
          nextBoard[row][col] = 0;
        }
      }
    }
    setBoard(nextBoard);
  }

  function moveLeft() {
    console.log("starting move left...");
    let nextBoard = copyBoard(board);
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (board[row][col]) {
          console.log("found at: ", row, col);
          let newCol = col - 1;
          // while can move right
          while (newCol > 0 && nextBoard[row][newCol] == 0) {
            newCol--;
          }
          console.log(" moveing to : ", row, newCol);
          nextBoard[row][newCol] = nextBoard[row][col];
          nextBoard[row][col] = 0;
        }
      }
    }
    setBoard(nextBoard);
  }

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key == "d") {
        moveRight();
      } else if (event.key == "a") {
        moveLeft();
      }
    }
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((cell, c) => <Tile key={`${r}${c}`} n={cell} x={c} y={r} />),
      )}
      {/* <Tile x={pos[0]} y={pos[1]} /> */}
    </div>
  );
}
