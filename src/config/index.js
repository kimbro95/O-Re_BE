import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("? Couldn't find .env file");
}

export default {
  // 포트번호
  port: parseInt(process.env.PORT, 10) || 3002,

  // 영화진흥위원회 요청 URL + API 키 값
  kobis: {
    KOBIS_BASE_URL: `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${process.env.KOBIS_API_KEY}`,
  },

  // KMDb 요청 URL + API 키 값
  kmdb: {
    KMDB_BASE_URL: `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&ServiceKey=${process.env.KMDB_API_KEY}`,
  },

  api: {
    prefix: "/api",
  },
};
