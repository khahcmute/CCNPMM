import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Profile from "./components/Profile";
import avt from "./assets/img/avt.jpg";

function App() {
  return (
    <div>
      <Profile avatar={avt} name="Trần Tuấn Kha" age={21} />
    </div>
  );
}

export default App;
