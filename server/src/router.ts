import express from "express";
import http from "http";
import socketio from "socket.io";

const port = process.env.PORT || 8000;

const app = express();

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

export class Router {
  constructor() {
    httpServer.listen(port, () => {
      console.log("server listening on port", port);
    });

    io.on("connect", (socket: any) => {
      console.log("connected socket");
      socket.on("chat-message", (message: string) => {
        console.log("got message", message);
        io.emit("chat-message", message);
        // socket.broadcast.emit("chat-message", message);
      });
    });
  }
}
