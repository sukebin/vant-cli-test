/*
 * @Author: hjwu
 * @LastEditors: hjwu
 * @Description:
 *
 *
 */
import { useAxios } from '../util/axios';
import { getType } from '../sm-file-upload/file-upload';
import type {
  FileItem,
  Status,
  FileIconKey,
} from '../sm-file-upload/file-upload';

export type ComponentType = 'imagebox' | 'filebox';

// 获取文件大小
export const getFileSize = (requestUrl: string, url: string) =>
  useAxios().get<string, any>(`${requestUrl}?pathOrId=${encodeURI(url)}`);

/**
 * @description: 初始化数据，将字符串数据转成fileList
 * @param {*}  value  v-model值
 */
export async function initData(
  value: string,
  componentType: ComponentType,
  getFileSizeUrl: string
) {
  const values = value;
  const nowArr: FileItem[] = [];
  if (typeof values === 'string' && values) {
    const arr = values.split('::');
    for (let i = 0; i < arr.length; i++) {
      const str = arr[i].split('|');
      const obj: FileItem = {
        name: str[0],
        url: str[1],
        status: str[2] as Status,
        message: str[3],
        progress: str[4],
      };
      if (componentType === 'imagebox' && obj.url) {
        obj.url =
          '/filemgr/comm/downFileByPath?type=image&macroPath=' +
          encodeURI(obj.url);
      }
      if (componentType === 'filebox') {
        let size: string | number = str[5];

        if (!size) {
          try {
            // eslint-disable-next-line no-await-in-loop
            size = obj.url ? await getFileSize(getFileSizeUrl, obj.url) : '';
          } catch (err) {
            size = 'null';
          }
        }
        obj.size = size;
        obj.icon = (str[6] as FileIconKey) || getType(obj.url);
      }
      nowArr[i] = obj;
    }
  }

  return Promise.resolve(nowArr);
}

/**
 * @description: 格式化文件列表
 * @param {*} fileList  文件列表
 * @return {*} 返回以'::'隔开的字符
 */
export function transferToStr(
  fileList: FileItem[],
  componentType: ComponentType
) {
  const vals = fileList;
  if (vals && vals.length > 0) {
    const imgArr: string[] = [];
    vals.forEach((item) => {
      // item 中没有status字段表示从接口获取过来的
      if (
        !['failed'].includes(item.status) ||
        !Object.hasOwnProperty.call(item, 'status')
      ) {
        const url =
          componentType === 'imagebox'
            ? decodeURI(item.url!).replace(
                '/filemgr/comm/downFileByPath?type=image&macroPath=',
                ''
              )
            : item.url;
        let str = `${item.name}|${url}|${item.status}|${item.message}|${item.progress}`;
        if (componentType === 'filebox') {
          str += `|${item.size}|${item.icon}`;
        }
        console.log(str);
        imgArr.push(str);
      }
    });
    console.log(imgArr);
    return imgArr.join('::');
  }
}
