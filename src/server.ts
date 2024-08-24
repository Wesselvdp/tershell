import { createHtmlTemplate } from "./getTemplate";
const express = require("express");
const app = express();
const WebSocket = require("ws");
const path = require("path");

export const runServer = async (host, expressPort, wsPort) => {
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));

  // Set up a headless websocket server that prints any
  // events that come in.
  const wss = new WebSocket.Server({ port: wsPort, host: host });
  // Store all connected clients
  const clients = new Set<WebSocket>();

  wss.on("connection", function connection(ws) {
    clients.add(ws);

    ws.on("error", console.error);

    ws.on("close", () => {
      clients.delete(ws);
    });

    broadcastMessage(messages);
  });

  const messages: string[] = [];

  app.post("/send-message", (req, res) => {
    const message = req.body.message as string;
    messages.push(message);
    if (message) {
      broadcastMessage(messages);
      res.status(200).json({ status: "Message sent" });
    } else {
      res.status(400).json({ status: "No message provided" });
    }
  });

  app.get("/", (req, res) => {
    const html = createHtmlTemplate(host, wsPort, expressPort);
    res.send(html);
  });

  function broadcastMessage(message) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ messages }));
      }
    });
  }
  app.listen(expressPort, "0.0.0.0", () => {
    console.log(`Logs are visible at: http://${host}:${expressPort}`);
  });

  // console.log(`WebSocket server is running at ws://${host}:${wsPort}/`);
};
