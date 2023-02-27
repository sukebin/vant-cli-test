/* eslint-disable no-use-before-define */

export type Checked = boolean | null;

export type ColumnsOption = Record<string, any> & {
  label?: string;
  value?: string | number;
  children?: ColumnsOption[];
  disabled?: boolean;
  checked?: Checked;
};

export type TabListOption = Record<string, any> & {
  Object: {
    options?: TabListPermisstion;
    tabName?: string;
  };
};
export type TabItemOption = Record<string, any> & {};
export type TabListPermisstion = Record<string, any> & {
  hidden: boolean;
};

// type Fun<T extends object={isHistory:boolean, isAgree:number, item:CountersignItem, data:CountersignItem[]}> = (args: T) => void

// 拓展事件回调
export type CallBackFun = Record<string, any> & {
  isHistory: boolean;
  isAgree: number;
  item: CountersignItem;
  data: CountersignItem[];
};
// 拓展事件
export type BtnConfig = Record<string, any> & {
  title?: string;
  status?: number;
  callback?: (T: CallBackFun) => void;
};

// 会签数据
export type CountersignItem = Record<string, any> & {
  actName?: string;
  realName?: string;
  userId?: string;
  approvalDate?: number|string;
  approvalOpinion?: string;
  isAgree?: number|string;
  actKey?: string;
  approvalStamp?: string;
  taskId?: string;
  jid?: string;
  rid?: string | null;
  // 拓展事件
  curBtnConfig?: BtnConfig;
};

export type SwiperItem = Record<string, any> & {
  imageUrl: string;
  isClick: boolean;
  name: string;
  linkUrl: string;
};

export type filePreview = Record<string,any> & {
  code:string,
  msg:string,
  result:string[]
}