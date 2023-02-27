/*
 * @Author: hjwu
 * @LastEditors: lyy
 * @Description:
 *
 *
 */
import {
  ProcessDrawData,
  ProcessDetail,
  HorizontalListItem,
} from '../sm-process-display/process-display';
import type { ColumnsOption, filePreview } from '../hooks/commonType';
import type { StampListItem } from '../sm-sign-stamp/sign-stamp';
import { type AxiosStatic, useAxios } from '../util/axios';
import type { PickerOption } from 'vant';
import type { ApprovalBoard } from '../sm-signature/signature';
import qs from 'qs';
import sha1 from 'sha1';

// let targetAxios: AxiosStatic;

class Service {
  static targetAxios: AxiosStatic;

  // 编号 - 自动编号
  static async autoBuildNo(params: {
    rid: string;
    jid: string;
    formData: object;
  }) {
    return this.targetAxios.post<string, object>(
      `/formengine/expression/autoBuildNo?rid=${params.rid}&jid=${params.jid}`,
      params.formData
    );
  }

  // 会签 - 获取系统时间
  static async getSystemApprovalConfig(params: {
    jid: string;
    fname: string;
    fformate: string;
  }) {
    return this.targetAxios.post<string>(
      '/formengine/jobApproval/getSystemApprovalConfig',
      params,
      {
        // @ts-ignore
        silence: true,
      }
    );
  }

  // 获取常用词列表
  static async getWcont(params: {
    wtype: number;
    bcode: string;
    wfield?: string;
  }) {
    return this.targetAxios.post<string, PickerOption[]>(
      `/suppmgr/personal/getWcont?wtype=${params.wtype}&bcode=${params.bcode}&wfield=`
    );
  }

  // 二维码 - 获取二维码图片路径
  static async getQrcodeUrl(params: { content: string; qrcodeType: boolean }) {
    return this.targetAxios.post<any, string>(
      '/formengine/support/convertContentToQrcode',
      qs.stringify(params)
    );
  }

  // 流程展示 - 获取环节
  static async getProcessShow(params: {
    processInstanceId: string;
    processDefinitionId: string;
  }) {
    return this.targetAxios.get<string, HorizontalListItem[]>(
      '/flowengine/form/getProcessShow',
      {
        params,
      }
    );
  }

  // 流程展示 - 获取流程图
  static async getFlowProcessDiagram(params: { processInstanceId: string }) {
    // return targetAxios.get<IClaimTask[]>('/flowengine/system/claimTask', {
    //   params,
    // });
    return this.targetAxios.get<string, ProcessDrawData>(
      '/flowengine/info/getFlowProcessDiagram',
      {
        params,
      }
    );
  }

  // 流程展示 - 获取所有环节信息
  static async getTasksByProcessInstanceIdList(params: {
    processInstanceId: string;
  }) {
    return this.targetAxios.get<string, ProcessDetail[]>(
      '/flowengine/info/listTasksByProcessInstanceId',
      {
        params,
      }
    );
  }

  // 获取组织树列表
  static async getOrganTree(params: FormData) {
    return this.targetAxios.post<string, ColumnsOption[]>(
      '/mainweb/organ/getOrganTree',
      params
    );
  }

  // 初始化地图数据
  static async configPromise() {
    return this.targetAxios.get(
      '/mapviewmgr/serviceManagement/queryMapBaseConfig'
    );
  }

  static async dataDirectoryPromise(params: { type: number }) {
    return this.targetAxios.get('/mapviewmgr/dataDirectory/query', {
      params,
    });
  }

  static async basemapPromise(params: { qyzt: boolean }) {
    return this.targetAxios.get('/mapviewmgr/baseMap/queryByQyzt', {
      params,
    });
  }

  // 文件上传 - 上传文件
  static async uploadFile(
    params: FormData
    //    {
    //   mFile: File;
    //   isPreview: boolean;
    //   fileInfo: string;
    //   srcType: string;
    // }
  ) {
    return this.targetAxios.post<any, string>(
      '/filemgr/comm/uploadFile',
      params,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  // 文件上传 - 删除文件
  static async delFile(params: string[]) {
    return this.targetAxios.post('/filemgr/fileWeb/delFileInfo', params);
  }

  // 文件上传 - 文件预览
  static async filePreviewUrl(params: { macroPath: string; rebuild: number }) {
    return this.targetAxios.post<any, filePreview>(
      '/filemgr/comm/filePreview',
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  // 文件预览封装
  static async filePreview(
    params: { macroPath: string; rebuild: number },
    reloadNum = 0
  ) {
    return new Promise<filePreview>((resolve, reject) => {
      this.filePreviewUrl(params)
        .then((res) => {
          if (res.code === '0') {
            resolve(res);
          } else if (res.code === '1') {
            reloadNum++;
            if (reloadNum >= 10) {
              reject(new Error('文件正在生成中，请稍后再试'));
            } else {
              setTimeout(() => {
                resolve(this.filePreview(params, reloadNum));
              }, 1000);
            }
          } else {
            let errMsg = '';
            switch (res.code) {
              case '-1':
                errMsg = '源文件不支持预览/转换出错：文件不存在';
                break;
              case '1':
                errMsg = '预览图正在生成中/正在重新生成预览文件';
                break;
              case '2':
                errMsg = '预览图不存在，请重新生成';
                break;
              default:
                errMsg = '出错啦！请稍后再试';
                break;
            }
            reject(new Error(errMsg));
            // reject({ code: res.code, msg: errMsg } );
          }
        })
        .catch((err) => {
          const errMsg = err.response.data.msg;
          reject(new Error(errMsg || '操作失败，请重试'));
        });
    });
    // return this.filePreview(params).then(res=>{
    //   if(res.code==='1'){
    //     reloadNum++;
    //     if (reloadNum >= 10) {
    //       // showToast ('文件正在生成中，请稍后再试');
    //       return ;
    //     }
    //     setTimeout(() => {
    //      return  this.filePreview1(params, reloadNum);
    //     }, 1000);
    //   }else{
    //     return Promise.resolve(res)
    //   }
    // })
  }

  // 文件夹下载
  static async downFiles(params: { name: string; rid: string }) {
    return this.targetAxios.get(
      '/filemgr/comm/downFiles?macroPath=' +
        encodeURI(`${params.name}|${params.rid}`),
      { responseType: 'blob' }
    );
  }

  // 文件下载
  static async downFileByPath(params: {
    fileName: string;
    macroPath?: string;
    responseType: string;
  }) {
    return this.targetAxios.get('/filemgr/comm/downFileByPath', {
      params,
    });
  }

  // 签名盖章 - 获取印章数据
  // getShowStamp:'/formengine/stamp/showStamp', // 签名盖章 - 获取印章数据
  static async getShowStamp(params: { jid: string; stampReocrdData: string }) {
    // return targetAxios.get(`/formengine/stamp/showStamp?jid=${params.jid}&stampReocrdData=${params.stampReocrdData}`), // 签名盖章 - 获取印章数据[旧]
    return this.targetAxios.get<string, StampListItem>(
      `/suppmgr/stamp/showStamp?jid=${params.jid}&stampReocrdData=${params.stampReocrdData}`
    ); // 签名盖章 - 获取印章数据[3.5.0使用新接口]
  }

  // 签名盖章 - 解密
  static async decryption(params: { id?: string; readword: string }) {
    return this.targetAxios.get<string, StampListItem>(
      `/suppmgr/support/decryption?id=${params.id}&readword=${params.readword}`
    );
  }

  // 签名印章 - 进行盖章
  static async onSignatureStamp(params: {
    jid: string;
    stampDefId?: string;
    readword: string;
    link: string;
    formData: string;
  }) {
    // onSignatureStamp:'/formengine/stamp/signatureStamp', [旧版本使用]
    return this.targetAxios.post<string, any>(
      `/suppmgr/stamp/signatureStamp?jid=${params.jid}&stampDefId=${
        params.stampDefId
      }&readword=${sha1(params.readword)}&blink=${params.link}&formData=${
        params.formData
      }`
    ); // 3.5.0使用新接口
  }

  // 手写板 - 历史签名
  static async getApprovalBoardList() {
    return this.targetAxios.get<string, ApprovalBoard[]>(
      `/suppmgr/stamp/getApprovalBoardList`
    );
  }

  // 手写板 - 添加历史签名
  static async addApprovalBoard(macroPath: string) {
    return this.targetAxios.get<string, any>(
      '/suppmgr/stamp/addApprovalBoard?macroPath=' + encodeURI(macroPath)
    );
  }

  // 手写板 -删除历史签名
  static async deleteApprovalBoard(rid: string) {
    return this.targetAxios.get<string, any>(
      '/suppmgr/stamp/deleteApprovalBoardByRid?rid=' + rid
    );
  }
}

/**
 * useAxios内部用到了依赖注入，需要在setup提前调用，否则会拿不到【异步请求之后，再调用useAxios会拿不到】
 * @returns Service
 */
export function useService() {
  Service.targetAxios = useAxios();
  return Service;
}
