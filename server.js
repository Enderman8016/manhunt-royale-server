const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

let users = [];

wss.on("connection", (ws) => {

  ws.on("message", (msg) => {
    let data = JSON.parse(msg);

    if (data.type === "createAccount") {

      if (users.find(u => u.username === data.username)) {
        ws.send(JSON.stringify({
          type: "createAccountResult",
          success: false,
          message: "Username taken"
        }));
        return;
      }

      users.push({
        username: data.username,
        password: data.password,
        email: data.email
      });

      ws.send(JSON.stringify({
        type: "createAccountResult",
        success: true
      }));
    }

    if (data.type === "login") {
      let ok = users.find(u =>
        u.username === data.username &&
        u.password === data.password
      );

      ws.send(JSON.stringify({
        type: "loginResult",
        success: !!ok
      }));
    }

  });

});
