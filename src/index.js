const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: '.env'});

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
app.io.attach(server);
server.listen(port);
