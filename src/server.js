import express from "express";
import config from "./config/index.js";
import loader from "./loaders/index.js";

const startServer = async () => {
  const app = express();
  const PORT = config.port;

  await loader(app);

  app.listen(PORT, (error) => {
    try {
      if (error) throw error;
      console.log(`> ✨Ready on http://localhost:${PORT}`);
    } catch (error) {
      console.log("Error Server");
      process.exit(1);
    }
  });
};

startServer();
