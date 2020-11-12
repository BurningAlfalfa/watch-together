import "./App.css";

import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import logo from "./logo.svg";

const isDebug = true;
const socketURL = "ws://localhost:8000";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", function () {
      console.log("connected to socket");
      socket.emit("chat-message", "Hello qorld");
    });

    //when we receive a message...
    socket.on("chat-message", (message: string) => {
      setMessages((m) => m.concat(message));
    });
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          socket.emit("chat-message", "i pressed a button");
        }}
      >
        click me
      </button>
      {messages.map((message) => (
        <div>{message}</div>
      ))}
    </div>
  );
}

export default App;
