import { axiosRequest } from "./main.js";

const getProductList = (params) => {
  const { page, pageSize, orderBy, keyword } = params;
  const query = `?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&keyword=${keyword}`;

  return axiosRequest(
    "get",
    `/products${query}`,
    null,
    "Get product list success.",
    "Get product list failed."
  );
};

const getProduct = (productId) => {
  return axiosRequest(
    "get",
    `/products/${productId}`,
    null,
    "Get product success.",
    "Get product failed."
  );
};

const createProduct = (data) => {
  return axiosRequest(
    "post",
    `/products`,
    data,
    "Create product success.",
    "Create product failed."
  );
};

const patchProduct = (id, data) => {
  return axiosRequest(
    "patch",
    `/products/${id}`,
    data,
    "Patch product success.",
    "Patch product failed."
  );
};

const deleteProduct = (id) => {
  return axiosRequest(
    "delete",
    `/products/${id}`,
    null,
    "Delete product success.",
    "Delete product failed."
  );
};

export { getProductList, getProduct, createProduct, patchProduct, deleteProduct };
