const express = require("express");

async function startServer() {
  const app = express();
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Start Server ${PORT}`);
  });
}

startServer();
