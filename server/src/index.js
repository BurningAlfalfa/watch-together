const { Socket } = require("dgram");

const server = require("http").createServer();

const io = require("socket.io")(server);
const port = process.env.PORT || 8000;

io.on("connection", (client) => {
  Socket.errorMonitor("chat-message", "Hello World");
  console.log("client connected ");
});
server.listen(port, () => {
  console.log("server listening on port", port);
});
