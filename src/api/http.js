import axios from 'axios'
import qs from 'qs'
import {
  serialize
} from '@/util/util'
axios.defaults.timeout = 5000; //响应时间
axios.defaults.baseURL = 'http://124.71.148.15:8004'; //配置接口地址
axios.defaults.withCredentials = true
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  //在发送请求之前做某件事
  //携带请求头
  let token = window.localStorage.getItem("accessToken")
  //下面两种方式都行
  config.headers['accessToken'] = token
  return config;
}, (error) => {
  console.log('错误的传参')
  return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  //对响应数据做些事
  if (!res.data.success) {
    return Promise.resolve(res);
  }
  // headers中配置serialize为true开启序列化
  if (res.method === 'post' && res.headers.serialize) {
    res.data = serialize(res.data)
    delete res.data.serialize
  }

  if (res.method === 'get') {
    res.paramsSerializer = function (params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat'
      })
    }
  }
  return res;
}, (error) => {
  console.log('网络异常')
  return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 返回一个Promise(发送get请求)
export function get(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: param
      })
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export default {
  post,
  get,
}