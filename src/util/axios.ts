import mAxios from 'axios';
import type { AxiosStatic } from 'axios';
import { inject } from 'vue';

type AxiosMethod = 'get' | 'post';
// eslint-disable-next-line import/no-mutable-exports
// let newAxios: AxiosStatic;
mAxios.defaults.timeout = 10000000;

// -300:“请求了无权限调用的地址“
// -301:“无权限使用指定子系统"
// -302: "从授权服务获取授权信息时出错”
const errCode = {
  success: 0,
  fail: 1,
  tokenExpire: -110, // -110:“凭证已失效，需要重新验证"
  unAuthorizion: -201, // -201: "未认证"
};

// localStorage.setItem('token', 'AT-156-yK5egbX-wx0tPCI896RKOb5V1PEh0A8z') // 20.9测试token
// Add a request interceptor 请求拦截器
mAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!['X-AToken'] = token;
    }
    return config;
  },
  (error) =>
    // Do something with request error
    Promise.reject(error)
);

// Add a response interceptor 响应拦截器
mAxios.interceptors.response.use(
  (response) => {
    const result = response;

    return result.data;
  },
  (error) => {
    console.log('error----dataMsg', error);
    const authErrCode = error.response.headers['x-auth-ecode'];
    const authErrMsg = error.response.headers['x-auth-emsg'];
    if (authErrCode) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        msg: `${authErrCode} ${decodeURIComponent(authErrMsg)}`,
      });
    }

    //  判断刷脸
    const needFaceAuth = error.response.data.initSdkFlag || false;
    if (needFaceAuth) {
      console.log('need');
    } else {
      const { code } = error.response.data;

      if (
        code &&
        (code === errCode.tokenExpire || code === errCode.unAuthorizion)
      ) {
        // store.dispatch('clearToken')
        // const password = '7AF2D10B73AB7CD8F603937F7697CB5FE432C7FF' // 126
        //
        localStorage.setItem('token', '');
        // const password = 'F18F057EA44A945A083A00E6FCC11637D186042D'; // 20.9
        const password = '7AF2D10B73AB7CD8F603937F7697CB5FE432C7FF'; // 20.23
        return mAxios
          .get('/cas/oauth2.0/token', {
            params: {
              grant_type: 'password',
              client_id: 'sfpasys',
              username: 'admin',
              password,
            },
          })
          .then((res: any) => {
            localStorage.setItem('token', res.access_token);

            const { method } = error.config;
            if (method === 'get') {
              return mAxios[method as AxiosMethod](error.config.url, {
                params: error.config.params,
              });
            }

            return mAxios[method as AxiosMethod](
              error.config.url,
              error.config.data
            );
          });
      }
      // Toast(msg || ( error.message || "发生一个错误"));
    }

    return Promise.reject(error);
  }
);
// type WindowAxios = { axios: any } & Window & typeof globalThis;

// if (!(window as WindowAxios).axios) {
//   newAxios = axios;
// } else {
//   newAxios = (window as WindowAxios).axios;
// }
// newAxios = axios; // 默认axios
// export default newAxios;

/**
 *
 * @returns 由主工程RenderForm.vue提供axios依赖
 */
export function useAxios() {
  // 找不到axios注入，默认使用mAxios
  const axios = inject<AxiosStatic>('axios',mAxios);
  return axios;
}
export type { AxiosStatic };

// eslint-disable-next-line import/no-mutable-exports
// export let axios: AxiosStatic = null;

// /**
//  *  ！！！ ESM的export导出值引用在组件库无效，尚不明确原因；改用依赖注入实现
//  * @param axios 主工程提供的axios
//  */
// export function setupAxios(aAxios: any) {
//   console.log('🚀 ~ file: axios.ts:115 ~ setupAxios ~ axios', axios);
//   axios = aAxios;
//   console.log('🚀 ~ file: axios.ts:117 ~ setupAxios ~ axios', axios);
// }
