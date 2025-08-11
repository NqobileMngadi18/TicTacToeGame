// In your main App.tsx or wherever you render TicTacToe

import React from "react";
import TicTacToe from "./components/TicTacToe";
import "./App.css"; // or wherever you put the styles

function App() {
  return (
    <div className="tictactoe-wrapper">
      <TicTacToe />
    </div>
  );
}

export default App;
