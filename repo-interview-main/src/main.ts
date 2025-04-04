import { createExpressServer, useExpressServer } from "routing-controllers";
import express from "express";
import cors from "cors";
import 'dotenv/config';

let PORT = 3002;


const app = express();

app.use(cors({
  origin: "http://localhost:4200", // Permitir solo Angular en localhost
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// creates express app, registers all controller routes and returns you express app instance
useExpressServer(app, {
  routePrefix: "/bp",
  controllers: [__dirname + "/controllers/*{.js,.ts}"],
});


// run express application on port 3000
app.listen(PORT, () => {
  console.log(`Servidor Iniciado`);
  console.log(`Host: http://localhost:${PORT}`);
  console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
});
