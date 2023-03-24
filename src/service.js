import axios from "axios";

export const serviceGet = (url, urlParams) =>
  axios
    .get(url, {
      params: urlParams,
    })
    .then((response) => {
      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    });

export const modelGetOperation = ({ queryKey }) => {
  const [model, action, params] = queryKey;
  return serviceGet(`/${model}/${action}`, params);
};
