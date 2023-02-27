/*
 * @Author: your name
 * @Date: 2021-11-29 17:41:15
 * @LastEditTime: 2022-12-27 16:05:25
 * @LastEditors: hjwu
 * @Description: 缓存相同请求数据，避免多个同类型控件，请求多次相同数据
 * @FilePath: \maind:\workspaces\sm-form-libraryV3\src\util\requestCached.ts
 */
// 缓存请求任务
import { useAxios } from './axios';

import cryptoJs from 'crypto-js';

type CachedPoolObj = Record<string, any> & {
  ID: string;
};
type RequsetPromise = () => Promise<any>;
const cachedPool = <CachedPoolObj>{ ID: '' }; // 缓存池子
// let requestURLMap = {};
const waitTaskMap = <CachedPoolObj>{ ID: '' };
// var requestCount = 0;
export default class RequestCached {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  // static clearCached() {
  //   console.error('RequestCached清除缓存拉');
  //   waitTaskMap = {};
  //   cachedPool = {};
  // }
  /** 加载盖章列表
   * @description:
   * @param {*} vueInstance 组件实例，销毁时需要清除缓存
   * @return {*}
   */
  static getStampdefTreeByUserId(url: string) {
    const ID = cryptoJs.MD5(`${url}`).toString();
    const requsetPromise = (): Promise<any> =>
      // console.log('url------', url);
      useAxios().get(url);
    // requestCount++;
    // console.log('获取次数', requestCount);
    return this._getCachedByID(ID, requsetPromise);
  }

  /**
   * @description: 根据ID获取缓存数据
   * @param {*} ID
   * @return {*}
   */
  static _getCachedByID(
    ID: string,
    requsetPromise: RequsetPromise
  ): Promise<{ res: any; clearCacheHandler: () => void }> {
    const respone = cachedPool[ID];
    // console.log('cachedPool------', cachedPool);
    if (respone) {
      // 本地已经有缓存，直接返回
      return Promise.resolve({ res: respone, clearCacheHandler: () => null });
    }
    // 判断是否有请求队列 有则等待，没有则发起请求，添加到请求队列
    return new Promise((resolve, reject) => {
      let waitList = waitTaskMap[ID];
      if (!waitList || waitList.length === 0) {
        waitList = [];
        // console.log('发起请求---', waitList);
        waitTaskMap[ID] = waitList;
        requsetPromise().then(
          (res) => {
            // console.log('请求拉---', waitTaskMap);
            cachedPool[ID] = res;
            const _waitList = waitTaskMap[ID];
            do {
              const task = _waitList.pop();
              task.resolve({
                res,
                clearCacheHandler() {
                  // RequestCached.clearCached();
                  // console.error(' vueInstance.$once(hook:beforeDestroy');
                  // console.log('==12333==cachedPool==',cachedPool)
                  delete cachedPool[ID];
                  delete waitTaskMap[ID];
                  // console.log('====cachedPool==',cachedPool)
                },
              });
            } while (_waitList.length > 0);
          },
          (rej) => {
            const _waitList = waitTaskMap[ID];
            do {
              const task = _waitList.pop();
              task.reject(rej);
            } while (_waitList.length > 0);
          }
        );
        // vueInstance.$off('hook:beforeDestroy');
        // vueInstance.$once('hook:beforeDestroy');
      } else {
        // console.log('有请求了，等一下');
      }
      waitList.push({ resolve, reject });
      // console.log('waitTaskMap---22222', waitTaskMap);
    });
  }
}

/**
 * 
   axios
        .get(
          '/formengine/stamp/showStamp?jid=' +
            this.jid +
            '&stampReocrdData=' +
            this.stampReocrdData
        )
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
