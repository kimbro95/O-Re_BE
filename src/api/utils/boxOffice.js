import fs from "fs";
import axios from "axios";

import config from "../../config/index.js";
import { dateFormat } from "./date.js";

/**
 * OPEN API를 통해 불러온 박스오피스 데이터 JSON
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
 * KOBIS OPEN API - 데이터 조회시점 전날 박스오피스 순위
 * @return { rank, movieNm, openDt} 순위, 영화제목, 개봉일
 */
export const getBoxOffice = async () => {
  const { KOBIS_BASE_URL } = config.kobis;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = dateFormat(yesterday, "YYYYMMDD");

  try {
    const response = await (
      await axios.get(`${KOBIS_BASE_URL}&targetDt=${targetDate}`)
    ).data.boxOfficeResult["dailyBoxOfficeList"];

    const boxOfficeData = response.map(({ rank, movieNm, openDt }) => ({
      rank,
      movieNm,
      openDt: openDt.replaceAll("-", ""),
    }));

    return boxOfficeData;
  } catch (error) {
    throw error;
  }
};

/**
 * KMDB OPEN API - KOBIS 영화제목, 개봉일 데이터로 포스터 이미지 가져와서 데이터 합치기
 * @param {rank, movieNm, openDt}  순위, 영화제목, 개봉일
 * @returns { rank, title, poster} 순위, 영화제목, 포스터 이미지
 */
export const getMoviesInfo = async (moive) => {
  try {
    const { KMDB_BASE_URL } = config.kmdb;
    const response = await (
      await fetch(
        `${KMDB_BASE_URL}&title=${moive.movieNm}&releaseDts=${moive.openDt}`
      )
    ).json();

    return {
      rank: moive.rank,
      title: moive.movieNm,
      poster: response?.Data?.[0]?.Result?.[0]?.posters.split("|")[0] || "",
    };
  } catch (error) {
    throw error;
  }
};
