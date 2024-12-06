document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const gridWidth = 8; // The number of columns/rows
  const tiles = [];
  let currentScore = 0;

  // Define candy colors
  const candyColors = [
    'url(images/red-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/green-candy.png)',
    'url(images/blue-candy.png)',
  ];

  // Create the game board
  function createGameBoard() {
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      const tile = document.createElement('div');
      tile.setAttribute('draggable', true);
      tile.setAttribute('id', i);
      tile.style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
      grid.appendChild(tile);
      tiles.push(tile);
    }
  }

  createGameBoard();

  // Dragging variables
  let draggedColor;
  let replacedColor;
  let draggedTileId;
  let replacedTileId;

  // Event listeners for dragging
  tiles.forEach(tile => tile.addEventListener('dragstart', dragStart));
  tiles.forEach(tile => tile.addEventListener('dragend', dragEnd));
  tiles.forEach(tile => tile.addEventListener('dragover', dragOver));
  tiles.forEach(tile => tile.addEventListener('dragenter', dragEnter));
  tiles.forEach(tile => tile.addEventListener('dragleave', dragLeave));
  tiles.forEach(tile => tile.addEventListener('drop', dragDrop));

  function dragStart() {
    draggedColor = this.style.backgroundImage;
    draggedTileId = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {}

  function dragDrop() {
    replacedColor = this.style.backgroundImage;
    replacedTileId = parseInt(this.id);
    this.style.backgroundImage = draggedColor;
    tiles[draggedTileId].style.backgroundImage = replacedColor;
  }

  function dragEnd() {
    const validMoves = [
      draggedTileId - 1,
      draggedTileId - gridWidth,
      draggedTileId + 1,
      draggedTileId + gridWidth,
    ];
    const isValidMove = validMoves.includes(replacedTileId);

    if (replacedTileId && isValidMove) {
      replacedTileId = null;
    } else if (replacedTileId && !isValidMove) {
      tiles[replacedTileId].style.backgroundImage = replacedColor;
      tiles[draggedTileId].style.backgroundImage = draggedColor;
    } else {
      tiles[draggedTileId].style.backgroundImage = draggedColor;
    }
  }

  // Move candies down when matches are cleared
  function moveCandiesDown() {
    for (let i = 0; i < gridWidth * (gridWidth - 1); i++) {
      if (tiles[i + gridWidth].style.backgroundImage === '') {
        tiles[i + gridWidth].style.backgroundImage = tiles[i].style.backgroundImage;
        tiles[i].style.backgroundImage = '';

        const firstRow = Array.from({ length: gridWidth }, (_, index) => index);
        if (firstRow.includes(i) && tiles[i].style.backgroundImage === '') {
          tiles[i].style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
        }
      }
    }
  }

  // Match checking functions
  function checkRowForMatch(size) {
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      const rowMatch = Array.from({ length: size }, (_, index) => i + index);
      const decidedColor = tiles[i].style.backgroundImage;
      const isBlank = decidedColor === '';

      const invalidIndices = Array.from({ length: size }, (_, index) => gridWidth - size + index);
      if (invalidIndices.some(index => rowMatch.includes(index))) continue;

      if (rowMatch.every(index => tiles[index]?.style.backgroundImage === decidedColor && !isBlank)) {
        currentScore += size;
        scoreDisplay.textContent = currentScore;
        rowMatch.forEach(index => (tiles[index].style.backgroundImage = ''));
      }
    }
  }

  function checkColumnForMatch(size) {
    for (let i = 0; i < gridWidth * (gridWidth - size + 1); i++) {
      const columnMatch = Array.from({ length: size }, (_, index) => i + index * gridWidth);
      const decidedColor = tiles[i].style.backgroundImage;
      const isBlank = decidedColor === '';

      if (columnMatch.every(index => tiles[index]?.style.backgroundImage === decidedColor && !isBlank)) {
        currentScore += size;
        scoreDisplay.textContent = currentScore;
        columnMatch.forEach(index => (tiles[index].style.backgroundImage = ''));
      }
    }
  }

  // Game loop
  setInterval(() => {
    checkRowForMatch(4);
    checkColumnForMatch(4);
    checkRowForMatch(3);
    checkColumnForMatch(3);
    moveCandiesDown();
  }, 100);
});
