export const CONSTANT = {
  GRID_SIZE: 9,
  BOX_SIZE: 3,
  LEVEL_NAMES: ["Easy", "Medium", "Hard", "Very Hard"],
  VALUES: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  CLUES_BY_LEVEL: [
    {
      level: "Easy",
      leastClues: 37,
      mostClues: 40,
    },
    {
      level: "Medium",
      leastClues: 27,
      mostClues: 36,
    },
    {
      level: "Hard",
      leastClues: 18,
      mostClues: 26,
    },
    {
      level: "Very Hard",
      leastClues: 15,
      mostClues: 17,
    },
  ],
};

export const GRID1 = [
  [5, 6, 3, 8, 7, 9, 2, 1, 4],
  [7, 1, 9, 4, 2, 3, 6, 5, 8],
  [2, 8, 4, 5, 6, 1, 3, 9, 7],
  [4, 2, 6, 1, 5, 7, 9, 8, 3],
  [1, 8, 5, 6, 3, 8, 4, 7, 2],
  [8, 3, 7, 2, 9, 4, 1, 6, 5],
  [9, 4, 8, 3, 1, 5, 7, 2, 6],
  [6, 5, 1, 7, 4, 2, 8, 3, 9],
  [3, 7, 2, 9, 8, 6, 5, 4, 1],
];
