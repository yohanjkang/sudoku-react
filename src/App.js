import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Navbar, Lobby, Gamepage } from "./components/index";
import { CONSTANT } from "./components/Constants";

function App() {
  const [levelIndex, setLevelIndex] = useState(0);

  const setDifficulty = (direction) => {
    let index = levelIndex;
    if (direction === "left") {
      index -= 1;
      if (index < 0) index = 3;
    } else {
      index = (index + 1) % CONSTANT.LEVEL_NAMES.length;
    }
    setLevelIndex(index);
  };

  // Check if user previously set to dark mode
  useEffect(() => {
    document.body.classList.add(
      JSON.parse(localStorage.getItem("darkMode")) ? "dark" : "light"
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="routes">
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Lobby
                  onChange={setDifficulty}
                  difficulty={CONSTANT.LEVEL_NAMES[levelIndex]}
                />
              }
            />
            <Route
              exact
              path="/game/"
              element={
                <Gamepage difficulty={CONSTANT.LEVEL_NAMES[levelIndex]} />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
