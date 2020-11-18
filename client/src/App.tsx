import "./App.css"
import ReactPlayer from 'react-player'
import React, { useEffect, useState } from "react";
import { Button, TextField } from '@material-ui/core';
import io from "socket.io-client";

const isDebug = true;
const socketURL =
  window.location.hostname === "localhost"
    ? "ws://localhost:8000"
    : "wss://aleo-watch-together.herokuapp.com";
isDebug && console.log("socket url = ", socketURL);

const socket = io(socketURL, { transports: ["websocket"] });

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const chatboxRef = React.useRef<HTMLDivElement>(null)
  const [url, setUrl] =useState<string>(); 
  useEffect(() => {

    function onConnect () {
      console.log("connected to socket");
    }
    socket.on("connect", onConnect);
   
   const onChatMessage = (message: string) => {
      setMessages((m) => m.concat(message));
    
    if (chatboxRef.current){
      
       chatboxRef.current.scrollTo(0,chatboxRef.current.scrollHeight)
    } 
    
    }
    //when we receive a message...
    socket.on("chat-message", onChatMessage);
    socket.on("command",handleCommand) 
    return ()=>{
      socket.off("connect",onConnect)
      socket.off("chat-message",onChatMessage)
      socket.off("command", handleCommand)
    }

  }, [chatboxRef]);
  // useEffect(() =>{ //@ts-ignore
  //   handleCommand({url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",command:"play"})
  // },[])
   const [message, setMessage] = React.useState("");
  const handleCommand =({command,...values}:{command:string,values:any})=>{
      if(command === "play"){
        //@ts-ignore
        setUrl(values.url as string)
      }
  }
  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);

  };
  const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) =>{
    if(event.key === "Enter"){
      
      socket.emit("chat-message",message );
       // put the ddd here
    }
 }
  return (
    <div className="App"> 
    <ReactPlayer  classname="youtubePlayer" playing controls url={url} />
    <div  ref={chatboxRef} className ="chatbox">
    
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
  <TextField onKeyDown={keyPress} type="text" value={message} onChange={handleChangeInput} ></TextField>

      
     
    </div>
  );
}

export default App;
