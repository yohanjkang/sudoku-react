import React from "react";
import { Link } from "react-router-dom";

const PauseScreen = ({ onResume }) => {
  return (
    <div className="pause-screen">
      <div onClick={onResume} className="btn blue" id="btn-resume">
        Resume
      </div>
      <Link to="/">
        <div className="btn" id="btn-exit">
          Exit
        </div>
      </Link>
    </div>
  );
};

export default PauseScreen;
