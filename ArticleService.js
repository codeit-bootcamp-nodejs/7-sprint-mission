import axios from "axios";

const APIURL = "https://panda-market-api-crud.vercel.app";

export function getArticleList(page, pageSize, keyword) {
  return axios
    .get(`${APIURL}/articles`, {
      params: {
        page: page,
        pageSize: pageSize,
        keyword: keyword,
      },
    })
    .then((response) => {
      console.log("게시글 목록:", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.message || "서버 오류"}`
        );
      } else {
        console.error("요청 실패:", error.message);
      }
    });
}

export function getArticle(id) {
  return axios
    .get(`${APIURL}/articles/${id}`)
    .then((response) => {
      console.log("게시글 상세 조회 성공:", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.message || "게시글을 찾을 수 없습니다."}`
        );
      } else {
        console.error("요청 실패:", error.message);
      }
    });
}

export function createArticle(title, content, image) {
  const articleData = {
    title: title,
    content: content,
    image: image,
  };
  return axios
    .post(`${APIURL}/articles`, articleData)
    .then((response) => {
      console.log("게시글 생성 성공:", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.message || "생성 실패"}`
        );
      } else {
        console.error("요청 실패:", error.message);
      }
    });
}

export function patchArticle(id, updateData) {
  return axios
    .patch(`${APIURL}/articles/${id}`, updateData)
    .then((response) => {
      console.log("게시글 수정 성공:", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.message || "수정 실패"}`
        );
      } else {
        console.error("요청 실패:", error.message);
      }
    });
}
export function deleteArticle(id) {
  return axios
    .delete(`${APIURL}/articles/${id}`)
    .then((response) => {
      console.log("게시글 삭제 성공:", response.status, response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `Error ${error.response.status}: ${error.response.data.message || "삭제 실패"}`
        );
      } else {
        console.error("요청 실패:", error.message);
      }
    });
}
