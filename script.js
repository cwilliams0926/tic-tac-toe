const gameboard = (() => {
  const SIZE = 3;
  const board = [];

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; i++) {
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
})();

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}
