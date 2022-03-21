import React, { useRef, useEffect } from "react";
import { CONSTANT, GRID1 } from "./Constants";

const GRID_SIZE = CONSTANT.GRID_SIZE;

const Grid = ({ difficulty }) => {
  let tiles;
  let selectedTile = -1;
  const sudokuGrid = useRef(null);

  const deselectTiles = () => {
    tiles.forEach((tile) => tile.classList.remove("hover"));
  };

  // Display the same row, column, and box of tile that was selected
  const selectTile = (index) => {
    // deselect previous tiles first
    deselectTiles();

    selectedTile = index;

    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    let rowBegin = row - (row % GRID_SIZE);
    let colBegin = col - (col % GRID_SIZE);

    let rowBoxBegin = row - (row % CONSTANT.BOX_SIZE);
    let colBoxBegin = col - (col % CONSTANT.BOX_SIZE);

    // select row
    for (let i = 0; i < GRID_SIZE; i++) {
      tiles[GRID_SIZE * row + (colBegin + i)].classList.add("hover");
    }

    // select column
    for (let i = 0; i < GRID_SIZE; i++) {
      tiles[GRID_SIZE * (rowBegin + i) + col].classList.add("hover");
    }

    // select box
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
      for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
        tiles[GRID_SIZE * (rowBoxBegin + i) + (colBoxBegin + j)].classList.add(
          "hover"
        );
      }
    }
  };

  // Create the GRID_SIZE * GRID_SIZE sudoku grid (visually)
  const createGrid = () => {
    // Add all tiles to grid
    for (let i = 0; i < GRID_SIZE ** 2; i++) {
      const tile = document.createElement("div");
      tile.classList.add("grid__cell");
      sudokuGrid.current.appendChild(tile);
    }

    tiles = document.querySelectorAll(".grid__cell");

    // Add spaces/alternate colors
    for (let i = 0; i < GRID_SIZE ** 2; i++) {
      let row = Math.floor(i / GRID_SIZE);
      let col = i % GRID_SIZE;

      // spaces
      if (row === 2 || row === 5) {
        tiles[i].style.marginBottom = "10px";
      }
      if (col === 2 || col === 5) {
        tiles[i].style.marginRight = "10px";
      }

      // colors
      if (row < 3 || row > 5) {
        if (col > 2 && col < 6) {
          tiles[i].classList.add("alt");
        }
      }

      if (row > 2 && row < 6) {
        if (col < 3 || col > 5) {
          tiles[i].classList.add("alt");
        }
      }
    }
  };

  // Create a new sudoku grid by shuffling the existing grid
  const createGridNumbers = (difficulty) => {
    let existingGridCopy = [];
    GRID1.map((array, index) => {
      existingGridCopy[index] = array.slice();
    });

    // shuffle the grid by randomly doing three things:
    // 1) Rotate the matrix
    existingGridCopy = rotateMatrix(existingGridCopy);

    // 2) Map a number to a different one ( 1 -> 2, 2 -> 3, ...)
    existingGridCopy = mapValues(existingGridCopy);

    // 3) Shuffle rows/columns within the same block group
    // {(1, 2, 3), (4, 5, 6), (7, 8, 9)}
    existingGridCopy = shuffleRows(existingGridCopy);
    existingGridCopy = shuffleColumns(existingGridCopy);

    // check if grid is legitimate
    tiles.forEach((tile, index) => {
      checkError(index, tile.getAttribute("data-value"));
    });

    // remove tiles based on difficulty
    existingGridCopy = adjustDifficulty(difficulty, existingGridCopy);

    // display the numbers onto the grid
    displayGrid(existingGridCopy);
  };

  const adjustDifficulty = (difficulty, grid) => {
    let temp = getGridCopy(grid);

    // get min/max number of tiles to remove based on level
    let { leastClues, mostClues } = CONSTANT.CLUES_BY_LEVEL.filter(
      (level) => level.level === difficulty
    )[0];

    leastClues = GRID_SIZE ** 2 - leastClues;
    mostClues = GRID_SIZE ** 2 - mostClues;

    // decide number between min/max
    let numTilesToRemove =
      Math.floor(Math.random() * (leastClues - mostClues + 1)) + mostClues;

    console.log(numTilesToRemove);

    // create an array of all grid indeces (0 - 81)
    let tilesToRemove = [...Array(GRID_SIZE ** 2).keys()];
    // shuffle the array to mimick random array without repeating values
    tilesToRemove = shuffle(tilesToRemove);

    // remove tiles based off random array
    for (let i = 0; i < numTilesToRemove; i++) {
      let row = Math.floor(tilesToRemove[i] / GRID_SIZE);
      let col = tilesToRemove[i] % GRID_SIZE;
      temp[row][col] = 0;
    }

    return temp;
  };

  // Display numbers onto grid
  const displayGrid = (grid) => {
    tiles.forEach((tile, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      if (grid[row][col] !== 0) {
        tile.innerHTML = grid[row][col];
        tile.setAttribute("data-value", grid[row][col]);
        tile.classList.add("filled");
      } else {
        tile.innerHTML = "";
        tile.setAttribute("data-value", 0);
      }
    });
  };

  const rotateMatrix = (grid) => {
    let temp = getGridCopy(grid);

    for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
      // temp = temp[0].map((_, colIndex) => temp.map((row) => row[colIndex]));
      temp = temp[0].map((val, index) =>
        temp.map((row) => row[index]).reverse()
      );
    }

    return temp;
  };

  const mapValues = (grid) => {
    let temp = getGridCopy(grid);

    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
      let num1 = CONSTANT.VALUES[Math.floor(Math.random() * 9)];
      let num2 = CONSTANT.VALUES[Math.floor(Math.random() * 9)];

      temp.forEach((tile) => {
        if (tile === num1) tile = num2;
        else if (tile === num2) tile = num1;
      });
    }

    return temp;
  };

  const shuffleRows = (grid) => {
    return [
      shuffle(grid.slice(0, 3)),
      shuffle(grid.slice(3, 6)),
      shuffle(grid.slice(6)),
    ].flat();
  };

  const shuffleColumns = (grid) => {
    let temp = getGridCopy(grid);

    // rotate matrix once to shuffle columns
    temp = rotateMatrix(grid);

    // then shuffle rows
    temp = shuffleRows(temp);

    // rotate back to original
    for (let i = 0; i < 3; i++) {
      temp = rotateMatrix(temp);
    }

    return temp;
  };

  const getGridCopy = (grid) => {
    let temp = [];
    grid.map((array, index) => {
      temp[index] = array.slice();
    });

    return temp;
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // while there remain elements to shuffle
    while (currentIndex != 0) {
      // pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // swap with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  // Add logic to tile selection
  const addTileEvents = () => {
    tiles.forEach((tile, index) => {
      tile.addEventListener("click", () => {
        if (!tile.classList.contains("filled")) {
          tiles.forEach((tile) => tile.classList.remove("selected"));

          const selectedTile = index;
          tile.classList.remove("err");
          tile.classList.add("selected");
          selectTile(selectedTile);
        }
      });
    });
  };

  const isError = (tile, value) => {
    if (parseInt(tile.getAttribute("data-value")) === value) {
      tile.classList.add("error");
      setTimeout(() => {
        tile.classList.remove("error");
      }, 500);

      console.log("Found an error!");
      return true;
    }

    return false;
  };

  const checkError = (index, value) => {
    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    let rowBegin = row - (row % GRID_SIZE);
    let colBegin = col - (col % GRID_SIZE);

    let rowBoxBegin = row - (row % CONSTANT.BOX_SIZE);
    let colBoxBegin = col - (col % CONSTANT.BOX_SIZE);

    // select row
    for (let i = 0; i < GRID_SIZE; i++) {
      if (colBegin + i === col) continue;
      if (isError(tiles[GRID_SIZE * row + (colBegin + i)], value)) {
        tiles[index].innerHTML = "";
        tiles[index].setAttribute("data-value", 0);
      }
    }

    // select column
    for (let i = 0; i < GRID_SIZE; i++) {
      if (rowBegin + i === row) continue;
      if (isError(tiles[GRID_SIZE * (rowBegin + i) + col], value)) {
        tiles[index].innerHTML = "";
        tiles[index].setAttribute("data-value", 0);
      }
    }

    // select box
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
      for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
        if (colBoxBegin + j === col && rowBoxBegin + i === row) continue;
        if (
          isError(
            tiles[GRID_SIZE * (rowBoxBegin + i) + (colBoxBegin + j)],
            value
          )
        ) {
          tiles[index].innerHTML = "";
          tiles[index].setAttribute("data-value", 0);
        }
      }
    }
  };

  // Add logic to number selectors
  const addNumberEvents = () => {
    const numbers = document.querySelectorAll(".number");
    numbers.forEach((num, index) => {
      if (index === numbers.length - 1) {
        num.addEventListener("click", () => {
          // no tile was selected
          if (selectedTile === -1) return;
          tiles[selectedTile].innerHTML = "";
          tiles[selectedTile].setAttribute("data-value", 0);

          deselectTiles();
        });
      } else {
        num.addEventListener("click", () => {
          // no tile was selected
          if (selectedTile === -1) return;
          tiles[selectedTile].innerHTML = index + 1;
          tiles[selectedTile].setAttribute("data-value", index + 1);

          // check if selection value is valid
          checkError(selectedTile, index + 1);
        });
      }
    });
  };

  useEffect(() => {
    if (!sudokuGrid || !sudokuGrid.current) return;

    // create grid
    createGrid();

    // create grid numbers
    createGridNumbers(difficulty);

    // add tile selection logic
    addTileEvents();

    // add number selection logic
    addNumberEvents();
  }, []);

  return <div ref={sudokuGrid} className="sudoku-grid"></div>;
};

export default Grid;
