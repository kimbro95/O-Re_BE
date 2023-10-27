import express from "express";
import { port } from "./config/index.js";
import loader from "./loaders/index.js";

const startServer = async () => {
  const app = express();

  await loader(app);

  app.listen(port, (error) => {
    try {
      if (error) throw error;
      console.log(`> ✨Ready on http://localhost:${port}`);
    } catch (error) {
      console.log("Error Server");
      process.exit(1);
    }
  });
};

startServer();
