/*
 * @LastEditTime: 2022-12-23 15:55:31
 * @LastEditors: lyy
 * @Description:获取url中的参数
 */

import type { LocationQuery } from 'vue-router';

export const getUrlQuery = () => {
  let url = '';
  url = window.location.search;
  if (url.indexOf('?') === -1) {
    url = '?' + window.location.hash.split('?')[1];
  }
  const queryObj: LocationQuery = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substring(1).split('=');
      const key = decodeURIComponent(tempArr[0]);
      const val = decodeURIComponent(tempArr[1]);
      queryObj[key] = val;
    });
  }

  return queryObj;
};
