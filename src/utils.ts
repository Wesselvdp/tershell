const os = require("os");

const net = require("net");
export function isPortAvailable(host, port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        tester.once("close", () => resolve(true)).close();
      })
      .listen(port, host);
  });
}

export async function findFreePort(host, startPort = 3000) {
  let port = startPort;
  while (!(await isPortAvailable(host, port))) {
    port++;
  }
  return port;
}

export function getWifiIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost"; // Fallback to localhost if no suitable IP is found
}
