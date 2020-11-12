import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import io from "socket.io-client";



const socket =
  window.location.hostname === "localhost"
    ? io("ws://localhost:8000")
    : io("wss://yeeplayer.herokuapp.com")




function App() {
  useEffect(()=>{
    socket.on("connect", function () {
      console.log("connect")
      socket.emit('chat-message', 'Hello qorld')

      })
      //   socket.emit("connect room", id);
  }, [])
  return (
    


    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
       
      </header>
      <body>
        <div id = "message-container"></div>
        <form id = "send-container">
          <input type="text" id="message-input"></input>
            <button type ="submit" id= "send-button" >Send</button>
        </form>
      </body>
    </div>
  );
}

export default App;
