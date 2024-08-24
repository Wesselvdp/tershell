import { runServer } from "./server";

import { spawn } from "child_process";
import axios from "axios";
import { findFreePort, getWifiIP } from "./utils";

// Function to run npm command and handle its output
function runUserCommand(ctx, command, args) {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
  });

  const handleOut = (data) => {
    const message = data.toString("utf8").trim();
    // Send the message to the API
    axios
      .post(`http://${ctx.host}:${ctx.expressPort}/send-message`, {
        message: message,
      })
      .catch((error) => {
        console.error("Error sending message to API:", error.message);
      });

    // Also write to this process's stdout
    process.stdout.write(message + "\n");
  };

  child.stdout.on("data", handleOut);
  (child.stderr as any)?.on("data", handleOut);
  child.on("close", (code) => {
    console.log(`npm process exited with code ${code}`);
  });
}

// Get command line arguments
const [, , command, ...args] = process.argv;

if (!command) {
  console.error("Please provide an npm command to run.");
  process.exit(1);
}

// Run the npm command
(async () => {
  const host = getWifiIP();
  const expressPort = await findFreePort(host, 4200);
  const wsPort = await findFreePort(host, expressPort + 1);
  await runServer(host, expressPort, wsPort);
  runUserCommand({ host, expressPort }, command, args);
})();
