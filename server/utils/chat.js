// let users = {};

getUsers = users => {
  return Object.keys(users).map(function(key) {
    return users[key].username;
  });
};

createSocket = (user, users) => {
  let cur_user = users[user.uid],
    updated_user = {
      [user.uid]: Object.assign(cur_user, {
        sockets: [...cur_user.sockets, user.socket_id]
      })
    };
  users = Object.assign(users, updated_user);
};

createUser = (user, users) => {
  users = Object.assign(
    {
      [user.uid]: {
        username: user.username,
        uid: user.uid,
        sockets: [user.socket_id]
      }
    },
    users
  );
};

removeSocket = (socket_id, users) => {
  let uid = "";
  console.log(users);
  Object.keys(users).map(function(key) {
    let sockets = users[key].sockets;
    console.log(`sockets: ${sockets}`);
    if (sockets.indexOf(socket_id) !== -1) {
      uid = key;
    }
  });
  let user = users[uid];
  console.log(user);
  if (user.sockets.length > 1) {
    // Remove socket only
    let index = user.sockets.indexOf(socket_id);
    let updated_user = {
      [uid]: Object.assign(user, {
        sockets: user.sockets
          .slice(0, index)
          .concat(user.sockets.slice(index + 1))
      })
    };
    users = Object.assign(users, updated_user);
  } else {
    // Remove user by key
    let clone_users = Object.assign({}, users);
    delete clone_users[uid];
    users = clone_users;
  }
};

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

module.exports = { removeSocket, createUser, createSocket, getUsers };
