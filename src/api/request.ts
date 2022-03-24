/**
 * request.js
 * 通过promise对axios做二次封装，针对用户端参数，做灵活配置
 */
import instance from './interceptor';
/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(url: string, params: any, method: string) {
  return new Promise((resolve, reject) => {
    let data = {};
    // get请求使用params字段
    if (method === 'get') data = { params };
    // post请求使用data字段
    if (method === 'post') data = { data: params };
    instance({
      url,
      method,
      ...data
    })
      .then((res: any) => {
        if (res.code === 0) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((error: { message: any }) => {
        console.error(error.message);
      })
      .finally(() => {});
  });
}
// 封装GET请求
function Get(url: string, params: any) {
  return request(url, params, 'get');
}
// 封装POST请求
function Post(url: string, params: any) {
  return request(url, params, 'post');
}

export { Get, Post };
