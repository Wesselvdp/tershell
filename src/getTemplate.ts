export function createHtmlTemplate(host, wsPort, expressPort) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>My App</title>
	  <script src="http://${host}:${expressPort}/index.js" ></script>
  </head>
  <body style="background: #000; color: #fff; padding-left: 5px;">
	  <div id="container"></div>
	  <script>
		var TERSHELL_PORT = '${wsPort}'
		var TERSHELL_HOST = '${host}'
		var TERSHELL_HOST = '${host}'
		init(TERSHELL_HOST, TERSHELL_PORT )
	  </script>
  </body>
  </html>
	`;
}
