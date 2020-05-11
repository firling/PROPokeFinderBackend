const express = require('express');
const exegesisExpress = require('exegesis-express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const fs = require('fs');


async function createServer () {

  // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
  const options = {
    controllers: path.resolve(__dirname, './controllers'),
    allowMissingControllers: false
  };

  // This creates an exegesis middleware, which can be used with express,
  // connect, or even just by itself.
  const exegesisMiddleware = await exegesisExpress.middleware(
    path.resolve(__dirname, './openapi.yaml'),
    options
  );

  const app = express();

  app.use(cors("localhost:3000"));

  app.use('/static', express.static('public'));

  // If you have any body parsers, this should go befo re them.
  app.use(exegesisMiddleware);

  // Return a 404
  app.use((req, res) => {
    console.log('404 not found');
    res.status(404).json({ message: `Not found` });
  });

  // Handle any unexpected errors
  app.use((err, req, res, next) => {
    res.status(500).json({ message: `Internal error: ${err.message}` });
    console.log('500 Internal error: ' + err.message);
  });

  const server = http.createServer(app);

  return server;
}

createServer()
  .then(server => {
    server.listen(3001);
    console.log(`Listening on port 3001`);
  })
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
