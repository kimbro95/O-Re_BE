const express = require("express");
const config = require("./config");

async function startServer() {
  const app = express();
  const PORT = config.port;

  app.listen(PORT, (error) => {
    try {
      if (error) throw error;
      console.log(`> ✨Ready on http://localhost:${PORT}`);
    } catch (error) {
      console.log("Error Server");
      process.exit(1);
    }
  });
}

startServer();
