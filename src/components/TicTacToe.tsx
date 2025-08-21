import React, { useState, useEffect } from "react";
import "../styles.css";

type SquareValue = "X" | "O" | null;
type Difficulty = "Easy" | "Medium" | "Hard";

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("Hard"); // default Hard

  const winner = calculateWinner(squares);

  // Handle player move
  function handleClick(index: number) {
    if (squares[index] || winner || !isXNext) return;

    const nextSquares = [...squares];
    nextSquares[index] = "X"; // player is always X
    setSquares(nextSquares);
    setIsXNext(false); // switch to computer
  }

  // Computer move (AI)
  useEffect(() => {
    if (!isXNext && !winner) {
      const move = getComputerMove(squares, difficulty);
      if (move !== -1) {
        const nextSquares = [...squares];
        nextSquares[move] = "O";
        setTimeout(() => {
          setSquares(nextSquares);
          setIsXNext(true);
        }, 500);
      }
    }
  }, [isXNext, winner, squares, difficulty]);

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  return (
    <div className="tictactoe-wrapper">
      <div className="tictactoe-container">
        <h1 className="game-title">🎮 Tic Tac Toe Challenge</h1>
        <div className="status">
          {winner
            ? winner === "Draw"
              ? "It's a Draw!"
              : `Winner: ${winner}`
            : isXNext
            ? "Your Turn (X)"
            : "Computer's Turn (O)"}
        </div>

        {/* Difficulty Selector */}
        <div className="difficulty-wrapper">
          <label>Difficulty:</label>
          <select
            className="difficulty-selector"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>


        {/* Game Board */}
        <div className="board">
          {squares.map((square, index) => (
            <button
              key={index}
              className={`square ${square ? square.toLowerCase() : ""}`}
              onClick={() => handleClick(index)}
              disabled={!!square || !!winner || !isXNext}
            >
              {square}
            </button>
          ))}
        </div>

        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;

//
// --- Helper Functions ---
//

// winner calculation
function calculateWinner(squares: SquareValue[]): SquareValue | "Draw" | null {
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
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  if (squares.every((square) => square !== null)) {
    return "Draw";
  }

  return null;
}

// AI move based on difficulty
function getComputerMove(board: SquareValue[], difficulty: Difficulty): number {
  if (difficulty === "Easy") {
    return randomMove(board);
  }

  if (difficulty === "Medium") {
    return Math.random() < 0.5 ? randomMove(board) : findBestMove(board);
  }

  return findBestMove(board); // Hard
}

// Pick a random available move
function randomMove(board: SquareValue[]): number {
  const availableMoves = board
    .map((val, idx) => (val === null ? idx : -1))
    .filter((idx) => idx !== -1);

  if (availableMoves.length === 0) return -1;

  const randIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randIndex];
}

// Minimax AI
function minimax(
  board: SquareValue[],
  depth: number,
  isMaximizing: boolean
): number {
  const winner = calculateWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "Draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, depth + 1, false);
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
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Best move for computer
function findBestMove(board: SquareValue[]): number {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}
