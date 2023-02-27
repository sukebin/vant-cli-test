/** 组件共用的props */

export const commonProps = {
  // 权限控制。
  permission: {
    type: Array,
    default: () => [],
  },
  // 提交状态： 展示控件还是提交控件 目前支持两个值，submit,readOnly
  globalSubmitState: {
    type: String,
    default: 'submit',
  },
  // 是否开启事件验证
  validateEvent: {
    type: Boolean,
    default: true,
  },

  // 输入框宽度
  width: {
    type: [String, Number],
    default: '100',
  },
  // 输入框宽度单位(px和%)
  widthUnit: {
    type: String,
    default: '%',
  },
  belongForm: {
    type: Boolean,
    default: true,
  },
  // 边框样式
  borderStyle: {
    type: String,
    default: 'all', // all,none,bottom,
  },
};

export function mergeCommonProps<T>(privateProps: T): typeof commonProps & T {
  return Object.assign(commonProps, privateProps);
}
