import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

import { dateFormat } from "./date.js";
import config from "../../config/index.js";

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
 * 다음 영화 개봉예정작 예매율 순으로 크롤링
 * @return { rank, movieNm, openDt} 순위, 영화제목, 개봉일
 */
export const getComingSoon = async () => {
  try {
    const Crawling_URL = "https://movie.daum.net/premovie/theater?flag=C";

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const USER_AGENT =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36";
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({
      width: 1080,
      height: 1080,
    });

    await page.goto(Crawling_URL);
    await page.waitForTimeout(1000);
    const content = await page.content();
    const $ = cheerio.load(content);

    const moviesData = [];
    $(".list_movieranking li").each((idx, element) => {
      const title = $(element).find(".tit_item").text();
      const releaseDate = $(element)
        .find("span.txt_info > span.txt_num")
        .text()
        .split(".");

      moviesData.push({
        rank: idx + 1,
        movieNm: title.trim(),
        openDt: `20${releaseDate[0]}`,
      });

      // 상위 10개까지만
      if (idx === 9) return false;
    });

    await browser.close();
    return moviesData;
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
      rank: parseInt(moive.rank),
      title: moive.movieNm,
      nation: response?.Data?.[0]?.Result?.[0]?.nation || "",
      prodYear:
        parseInt(response?.Data?.[0]?.Result?.[0]?.prodYear) || moive.openDt,
      poster: response?.Data?.[0]?.Result?.[0]?.posters.split("|")[0] || "",
    };
  } catch (error) {
    throw error;
  }
};
