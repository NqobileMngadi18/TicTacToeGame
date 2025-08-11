import React, { useState, useEffect } from "react";
import "../styles.css";

type SquareValue = "X" | "O" | null;

const calculateWinner = (squares: SquareValue[]): SquareValue | "Draw" | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }

  if (squares.every((square) => square !== null)) {
    return "Draw";
  }

  return null;
};

// Minimax algorithm
const minimax = (
  board: SquareValue[],
  isMaximizing: boolean
): number => {
  const winner = calculateWinner(board);
  if (winner === "O") return 1;      // AI (O) wins
  if (winner === "X") return -1;     // Human (X) wins
  if (winner === "Draw") return 0;   // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        const score = minimax(board, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState<SquareValue | "Draw" | null>(null);

  const handleClick = (index: number) => {
    if (!isUserTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsUserTurn(false);
  };

  useEffect(() => {
    if (!isUserTurn && !winner) {
      // AI turn
      const newBoard = [...board];
      let bestScore = -Infinity;
      let move = -1;

      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = "O";
          const score = minimax(newBoard, false);
          newBoard[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }

      if (move !== -1) {
        const timer = setTimeout(() => {
          const boardAfterMove = [...board];
          boardAfterMove[move] = "O";
          setBoard(boardAfterMove);
          setIsUserTurn(true);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [isUserTurn, board, winner]);

  useEffect(() => {
    const result = calculateWinner(board);
    setWinner(result);
  }, [board]);

  const renderSquare = (index: number) => (
    <button
      key={index}
      style={{
        width: 60,
        height: 60,
        fontSize: 24,
        margin: 4,
        cursor: board[index] || winner ? "default" : "pointer",
      }}
      onClick={() => handleClick(index)}
      disabled={!!board[index] || !!winner}
    >
      {board[index]}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {winner
          ? winner === "Draw"
            ? "It's a draw!"
            : `Winner: ${winner}`
          : isUserTurn
          ? "Players turn X"
          : "Computer's turn O"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 70px)",
        }}
      >
        {board.map((_, idx) => renderSquare(idx))}
      </div>
      <button
        style={{ marginTop: 15 }}
        onClick={() => {
          setBoard(Array(9).fill(null));
          setWinner(null);
          setIsUserTurn(true);
        }}
      >
        Restart
      </button>
    </div>
  );
};

export default TicTacToe;
