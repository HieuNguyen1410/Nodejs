const http =  require('http');
const port = 3000;

const server = http.createServer((req,res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><head>');
    res.write('<body><h1>Hello from my Node.js server!</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(port);