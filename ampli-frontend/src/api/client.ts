import { getFromAsyncStorage, Keys } from "@/utils/asyncStorage";
import axios, { type CreateAxiosDefaults } from "axios";

const baseURL = "http://192.168.100.79:8989";

const client = axios.create({
  baseURL,
});

type headers = CreateAxiosDefaults<any>["headers"];

export const getClient = async (headers?: headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) return axios.create({ baseURL });

  const defaultHeaders = {
    Authorization: "Bearer " + token,
    ...headers,
  };

  return axios.create({ baseURL, headers: defaultHeaders });
};

export default client;
