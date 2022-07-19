const http = require("http");
const fs = require("fs");

const port = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><head>");
    res.write(
      '<body><form method="POST" action="/message"><input type="text" name="mes"/><button>Enter</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    });

    res.statusCode = 302;
    res.setHeader("location", "/");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><head>");
  res.write("<body><h1>Hello from my Node.js server!</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(port);
