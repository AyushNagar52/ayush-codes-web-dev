const http = require('http');

const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
  // Set the response header (HTTP Status 200 OK, Content-Type)
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Send the response body
  res.end('Hello, Ayush hiiihahahha!\n');
});

// Start listening on port 3000
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});