const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({path: '.env'});

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
