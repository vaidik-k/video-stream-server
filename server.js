const http = require("http");

const app = require("./App");
const PORT = 5000;

const server = http.createServer(app);
server.listen(PORT);

console.log(`Server started on port ${PORT}...`);
