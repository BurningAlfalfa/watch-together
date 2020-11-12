import "./App.css";

import React, { useEffect, useState } from "react";
import { Button } from '@material-ui/core';
import io from "socket.io-client";
import logo from "./logo.svg";

const isDebug = true;
const socketURL = "ws://localhost:8000";

isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    function onConnect () {
      console.log("connected to socket");
    }
    socket.on("connect", onConnect);

   const onChatMessage = (message: string) => {
      setMessages((m) => m.concat(message));
    }
    //when we receive a message...
    socket.on("chat-message", onChatMessage); 
    return ()=>{
      socket.off("connect",onConnect)
      socket.off("chat-message",onChatMessage)
    }
  }, []);
  console.log("fasfds")
  const [message, setMessage] = React.useState("");

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  return (
    <div className="App"> 
    <div className ="chatbox">
    {messages.map((message) => (
        <div>{message}</div>
      ))}
      </div>
          <Button onClick={() => {
          socket.emit("chat-message",message );
        }}
      >
        Send
         
         </Button> 
  <input type="text" value={message} onChange={handleChangeInput} ></input>

      
     
    </div>
  );
}

export default App;
