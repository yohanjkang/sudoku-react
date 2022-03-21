import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Lobby = ({ onChange, difficulty }) => {
  const difficultyText = useRef(null);

  const handleClick = (direction) => {
    onChange(direction);
  };

  useEffect(() => {
    if (!difficultyText && !difficultyText.current) return;

    difficultyText.current.style.color =
      difficulty === "Very Hard" ? "#e91e63" : "var(--text)";
  }, [difficulty]);

  return (
    <div className="lobby">
      <div className="lobby-screen">
        <h1 className="title">Sudoku</h1>
        <div>
          <span onClick={() => handleClick("left")} className="difficulty-btn">
            &lt;
          </span>
          <span>
            <div ref={difficultyText} className="btn" id="btn-level">
              {difficulty}
            </div>
          </span>
          <span onClick={() => handleClick("right")} className="difficulty-btn">
            &gt;
          </span>
        </div>
        <Link to="/game">
          <div className="btn blue" id="btn-play">
            New Game
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
