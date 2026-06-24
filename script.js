function gameboard() {
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

  return { getBoard, getBoardWithCellValues, playToken };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = gameboard();

  const players = [
    {
      name: playerOneName,
      token: "x",
    },
    {
      name: playerTwoName,
      token: "o",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

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
    board.playToken(row, column, getActivePlayer().token);

    if (!checkWinner()) switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWinner,
    checkTie,
  };
}

const screenController = (() => {
  const game = gameController;
  const playerTurnDiv = document.querySelector(".turn");
  const cellButtons = document.querySelectorAll(".cell");
  let gameOver = false;

  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const buttonIndex = rowIndex * row.length + colIndex;
        cellButtons[buttonIndex].textContent = cell.getValue();
      });
    });

    if (game.checkWinner()) {
      playerTurnDiv.textContent = `${activePlayer.name} wins!`;
      gameOver = true;
      return;
    }
    if (game.checkTie()) {
      playerTurnDiv.textContent = "Tie!";
      gameOver = true;
      return;
    }

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
  };
  cellButtons.forEach((cellButton) => {
    cellButton.addEventListener("click", () => {
      if (gameOver) return;
      const selectedRow = parseInt(cellButton.dataset.row);
      const selectedColumn = parseInt(cellButton.dataset.column);

      cellButton.classList.add("placing");
      setTimeout(() => {
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        cellButton.classList.remove("placing");
      }, 150);
    });
  });

  updateScreen();
})();
