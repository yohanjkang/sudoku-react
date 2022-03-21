import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";

import { Grid } from ".";
import PauseScreen from "./PauseScreen";

const Gamepage = ({ difficulty }) => {
  const [seconds, setSeconds] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        setSeconds((seconds) => seconds + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pause]);

  const resumeGame = () => {
    setPause(false);
    document.querySelector(".pause-screen").classList.remove("active");
  };

  const handlePause = () => {
    setPause(true);
    document.querySelector(".pause-screen").classList.add("active");
  };

  return (
    <div className="main-game">
      {/* Sudoku Grid */}
      <Grid difficulty={difficulty} />
      {/* End Sudoku Grid */}

      {/* Game Details */}
      <div className="game-details">
        <div className="game-info">
          <div className="game-difficulty">{difficulty}</div>
          <div className="game-time">
            {new Date(seconds * 1000).toISOString().substring(11, 19)}
          </div>
          <FontAwesomeIcon
            onClick={handlePause}
            icon={faPause}
            id="btn-pause"
          />
        </div>
        <div className="numbers">
          <div className="number">1</div>
          <div className="number">2</div>
          <div className="number">3</div>
          <div className="number">4</div>
          <div className="number">5</div>
          <div className="number">6</div>
          <div className="number">7</div>
          <div className="number">8</div>
          <div className="number">9</div>
          <div className="number delete" id="btn-delete">
            X
          </div>
        </div>
      </div>
      {/* End Game Details */}

      {/* Pause Screen */}
      <PauseScreen className="" onResume={resumeGame} />
      {/* End Pause Screen */}
    </div>
  );
};

export default Gamepage;
