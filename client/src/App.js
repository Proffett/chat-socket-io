import React from "react";
import './App.css';
import SocketIOChat from "./utils/SocketIOChat";

function App() {
  return (
    <div className="App">
      <h1>Chat room</h1>
        <SocketIOChat/>
    </div>
  );
}

export default App;
