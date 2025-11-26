// fetch 혹은 axios를 이용해 주세요.
// 응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
// .then() 메소드를 이용하여 비동기 처리를 해주세요.
// .catch() 를 이용하여 오류 처리를 해주세요.

import axios from "axios";
import { Article } from "./main2.js";
import { logAndThrow } from "./LogAndThrow.js;"

// Article 요청 함수 구현하기
// https://panda-market-api-crud.vercel.app/docs 의 Article API를 이용하여 아래 함수들을 구현해 주세요.
// getArticleList() : GET 메소드를 사용해 주세요.

function requestGetArticleList(params) {
    const url = "https://panda-market-api-crud.vercel.app/articles";
    return axios.get(url, {params});
}

// page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
async function getArticleList(Params = {}) {
    const url = "https://panda-market-api-crud.vercel.app/articles";
     try {
        const response = await axios.get(url, { params });
        // API 응답 구조에 따라 response.data.list 일수도 있고, response.data 자체일 수도 있어!
        // 여기서는 response.data가 바로 배열이라고 가정할게!
        return response.data.map(info => new Article(info.title, info.content, info.image));
    } catch (error) {
        logAndThrow(error); // 에러 처리 추가!
    }
}

// getArticle() : GET 메소드를 사용해 주세요.
async function getArticle (articleId) { 
    const url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`; // 슬래시 추가!
    try {
        const response = await axios.get(url);
        const {title, content, image} = response.data;
        return new Article(title, content, image);
    } catch (error) {
        logAndThrow(error); // 에러 처리 추가!
    }
}

function requestGetArticle(articleId) {const url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`;
return axios.get (url)
}

const articleFromInfo = (info) => {
    return new Article(info.title, info.content, info.image);
}

// createArticle() : POST 메소드를 사용해 주세요.
// request body에 title, content, image 를 포함해 주세요.
function createArticle(article) {
    return axios
        .post("https://panda-market-api-crud.vercel.app/articles", article) // article 객체를 두 번째 인자로!
        .then(response => response.data) // 생성된 아티클 정보를 반환할 수도 있으니.
        .catch(logAndThrow);
}

// patchArticle() : PATCH 메소드를 사용해 주세요.
function patchArticle(articleId, article) {
    return axios
        .patch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, article) // URL과 데이터를 분리!
        .then(response => response.data) // 업데이트된 아티클 정보를 반환.
        .catch(logAndThrow);
}

// deleteArticle() : DELETE 메소드를 사용해 주세요.
function deleteArticle(articleId) {
    return axios
        .delete(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
        .then(response => {
            // 슈슈, API 문서 확인하고 필요에 따라 이 부분을 바꿔주면 돼!
            // 대부분의 경우, 그냥 response.data를 반환하거나 성공 여부만 반환하면 충분해.

            // 예시 1: 성공 메시지를 콘솔에 찍고, response.data 반환
            console.log(`Article ${articleId} 삭제 성공! 응답: `, response.data);
            return response.data; // <- 그냥 받은 응답 데이터를 그대로 반환

            // 예시 2: 정말로 삭제된 ID가 response.data 객체 안에 { id: "아이디값" } 형태로 있다면 이렇게!
            // return response.data.id; 

            // 예시 3: 성공 여부(boolean)만 중요하면 이렇게!
            // return true;
        })
        .catch(logAndThrow);
}


