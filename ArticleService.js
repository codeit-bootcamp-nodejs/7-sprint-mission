import axios from "axios";
const API_URL = `https://panda-market-api-crud.vercel.app`;

const getArticleList = ({ page, pageSize, keyword }) => {
  const query = `?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;

  return axios
    .get(`${API_URL}/articles${query}`)
    .then((res) => {
      console.log("Get article list success:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Get article list failed:", err.response?.data || err.message);
      return err.response?.data;
    });
};

const getArticle = (id) => {
  return axios
    .get(`${API_URL}/articles/${id}`)
    .then((res) => {
      console.log("Get article success:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Get article failed:", err.response?.data || err.message);
      return err.response?.data;
    });
};

const createArticle = (data) => {
  return axios
    .post(`${API_URL}/articles`, data)
    .then((res) => {
      console.log("Create article success:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Create article failed:", err.response?.data || err.message);
      return err.response?.data;
    });
};

const patchArticle = (id, data) => {
  return axios
    .patch(`${API_URL}/articles/${id}`, data)
    .then((res) => {
      console.log("Patch article success:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Patch article failed:", err.response?.data || err.message);
      return err.response?.data;
    });
};

const deleteArticle = (id) => {
  return axios
    .delete(`${API_URL}/articles/${id}`)
    .then((res) => {
      console.log("Delete article success:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Delete article failed:", err.response?.data || err.message);
      return err.response?.data;
    });
};

export { getArticleList, getArticle, createArticle, patchArticle, deleteArticle };
