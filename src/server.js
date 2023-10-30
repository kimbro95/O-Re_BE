import express from "express";
import { scheduleJob } from "node-schedule";

import config from "./config/index.js";
import loader from "./loaders/index.js";
import { dateFormat } from "./api/utils/date.js";
import { writeBoxOfficeJson } from "./api/utils/boxOffice.js";
const startServer = async () => {
  const app = express();
  const PORT = config.port;

  await loader(app);

  app.listen(PORT, (error) => {
    try {
      if (error) throw error;
      console.log(`> ✨Ready on http://localhost:${PORT}`);
      // 매일 06시 boxOfffice 스케줄러 실행
      scheduleJob("0 0 6 * * *", async () => {
        const nowDate = dateFormat(new Date());
        console.log(`${nowDate} boxOffice.json 스케줄러 실행`);
        await writeBoxOfficeJson();
      });
    } catch (error) {
      console.log("Error Server");
      process.exit(1);
    }
  });
};

startServer();
