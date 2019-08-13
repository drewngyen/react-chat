var express = require("express");
var app = express();
var path = require("path");
let server = require("http").Server(app);
var chat = require("./utils/chat");
var io = require("socket.io")(server);

app.use("/assets", express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

server.listen(3000, function() {
  console.log(`Server is running on port: ${server.address().port}`);
});

let users = {};

io.on("connection", socket => {
  let query = socket.request._query,
    user = {
      username: query.username,
      uid: query.uid,
      socket_id: socket.id
    };

  if (users[user.uid] !== undefined) {
    chat.createSocket(user, users);
    socket.emit("updateUsersList", chat.getUsers(users));
  } else {
    chat.createUser(user, users);
    io.emit("updateUsersList", chat.getUsers(users));
  }

  socket.on("message", data => {
    console.log(data);
    socket.broadcast.emit("message", {
      username: data.username,
      message: data.message,
      uid: data.uid
    });
  });

  socket.on("disconnect", () => {
    chat.removeSocket(socket.id, users);
    io.emit("updateUsersList", chat.getUsers(users));
  });
});
