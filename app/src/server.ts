import express from "express";
import { Server } from "typescript-rest";

let app: express.Application = express();
Server.loadServices(app, 'controller/*', __dirname);
Server.buildServices(app);

app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});