import { useState } from 'react';
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
        <li key={move}>
          {move === currentMove ? (
              <button>{description}</button>
          ) : (
              <button onClick={() => jumpTo(move)}>{description}</button>
          )}
        </li>
    );
  });
  return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = squares.every(square => square) ? "It's a draw!" : "Next player: " + (xIsNext ? "X" : "O");
  }
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const squaresRow = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      squaresRow.push(
          <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
      );
    }
    rows.push(<div key={i} className="board-row">{squaresRow}</div>);
  }

  return (
      <>
        <div className="status">{status}</div>
        {rows}
      </>
  );
}

function Square({ value, onSquareClick  }) {
  return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}