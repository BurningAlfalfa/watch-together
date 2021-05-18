import "./App.css"
import ReactPlayer from 'react-player'
import React, { useEffect, useState } from "react";
import { Button, TextField } from '@material-ui/core';
import io from "socket.io-client";
//import { timeStamp } from "console";

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
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      get: function(){
          return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      }
  })

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
  console.log(message);
  const handleChangeInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    
      
     setMessage(event.target.value);
  };
  
  const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) =>{
    
    if(event.key === "Enter"){

      const timeStamp = Date.now(); 

  const messageWithTime = (new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(timeStamp))+": "+ message;
      if(message.startsWith("!")){
        socket.emit("chat-message", message)
      }else{

       socket.emit("chat-message",messageWithTime);
      }
// check if video is donw ot go to next video in Que
      setMessage("");
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
