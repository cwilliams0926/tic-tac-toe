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
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    if (!availableCells.length) return;

    board[row][column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, playToken, printBoard };
})();

function Cell() {
  let value = 0;

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

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row + 1}, column ${column + 1}...`,
    );
    board.playToken(row, column, getActivePlayer().token);

    // Where checking for a winner logic would go

    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return { playRound, getActivePlayer };
})();
