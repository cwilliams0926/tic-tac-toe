const gameboard = (() => {
  const SIZE = 3;
  const board = [];

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const playToken = (row, column, player) => {
    if (board[row][column].getValue() !== "") return;
    board[row][column].addToken(player);
  };

  const getBoardWithCellValues = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };

  const printBoard = () => {
    const boardWithCellValues = getBoardWithCellValues();
    console.log(boardWithCellValues);
  };

  return { getBoard, getBoardWithCellValues, playToken, printBoard };
})();

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

const gameController = ((
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) => {
  const board = gameboard;

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const isWinningLine = (cells) => {
    return cells[0] !== "" && cells[0] === cells[1] && cells[1] === cells[2];
  };

  const checkWinner = () => {
    const boardWithCellValues = board.getBoardWithCellValues();
    for (const row of boardWithCellValues) {
      if (isWinningLine(row)) return row[0];
    }

    const columns = boardWithCellValues[0].map((_, colIndex) =>
      boardWithCellValues.map((row) => row[colIndex]),
    );
    for (const row of columns) {
      if (isWinningLine(row)) return row[0];
    }

    const upperLeftDiagonal = [
      boardWithCellValues[2][0],
      boardWithCellValues[1][1],
      boardWithCellValues[0][2],
    ];
    const upperRightDiagonal = [
      boardWithCellValues[0][0],
      boardWithCellValues[1][1],
      boardWithCellValues[2][2],
    ];
    if (isWinningLine(upperLeftDiagonal)) return upperLeftDiagonal[0];
    if (isWinningLine(upperRightDiagonal)) return upperRightDiagonal[0];
  };

  const checkTie = () => {
    const boardWithCellValues = board.getBoardWithCellValues();
    return !boardWithCellValues.some((row) => row.includes(""));
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row + 1}, column ${column + 1}...`,
    );
    board.playToken(row, column, getActivePlayer().token);

    if (checkWinner()) {
      board.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      return;
    }

    if (checkTie()) {
      board.printBoard();
      console.log("Tie!");
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer };
})();
