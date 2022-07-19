const http =  require('http');
const port = 3000;

const server = http.createServer((req,res) => {
    const url = req.url;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><head>');
        res.write('<body><form method="POST" action="/message"><input type="text" name="mes"/><button>Enter</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><head>');
    res.write('<body><h1>Hello from my Node.js server!</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(port);