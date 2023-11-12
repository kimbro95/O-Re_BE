import fs from "fs";

import { getBoxOffice, getComingSoon, getMoviesInfo } from "./getMovies.js";

/**
 * OPEN API를 통해 불러온 박스오피스 데이터 JSON 파일로 만들기
 */
export const writeBoxOfficeJson = async () => {
  const boxOfficeData = await getBoxOffice();

  const boxOffice = await boxOfficeData.map((movie) => getMoviesInfo(movie));

  await Promise.all(boxOffice)
    .then((result) => {
      fs.writeFileSync(
        "./src/public/json/boxOffice.json",
        JSON.stringify(result)
      );
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * 크롤링을 통해 불러온 개봉예정 데이터 JSON 파일로 만들기
 */
export const writeComingSoonJson = async () => {
  const comingSoonData = await getComingSoon();

  const comingSoon = await comingSoonData.map((movie) => getMoviesInfo(movie));

  await Promise.all(comingSoon)
    .then((result) => {
      fs.writeFileSync(
        "./src/public/json/comingSoon.json",
        JSON.stringify(result)
      );
    })
    .catch((error) => {
      throw error;
    });
};
