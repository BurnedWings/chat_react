import axios from "axios";
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
const requests = axios.create({
  baseURL: '/api',
  timeout: 5000
})

requests.interceptors.request.use(
  function (config) {
    
    if (localStorage.getItem(`chat_token`)) {
      config.headers.Authorization = localStorage.chat_token;
    }
    nprogress.start()
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
)

requests.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    nprogress.done()
    return response.data;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(new Error('fail'));
  }
)
export default requests