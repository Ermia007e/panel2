import axios from "axios";


const baseURL = "https://classapi.sepehracademy.ir/api"

const instance = axios.create({
  baseURL: baseURL,
});

const onSuccess = (response) => {
  return response.data;
};

const onError = (err) => {
  console.log(err);


  if (err?.response.status === 401) 
  

  return Promise.reject(err);
};

instance.interceptors.response.use(onSuccess, onError);

instance.interceptors.request.use((opt) => {

  const token = localStorage.getItem("token")
  if (token) opt.headers.Authorization = `Bearer ${token}` ;
  return opt;
});

export default instance;
