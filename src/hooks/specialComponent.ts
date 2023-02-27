/*
 * @LastEditTime: 2022-09-29 15:59:16
 * @LastEditors: wMs
 * @Description: 特殊控件中对齐方式特殊处理， --> 富文本，会签，签名盖章，签名意见
 * 特殊控件内部存在标题，sm-form-item也有标题，所以需要特殊判断
 */
import { computed } from 'vue';
import type { InjectFormItem, InjectForm } from '../sm-form/form';

// 特殊控件标题是否展示
export function showTitleFun(SmFormItem: InjectFormItem, SmForm: InjectForm) {
  return {
    showTitle: computed(() => {
      const { title, singlePosition } = SmFormItem || {};
      const { labelPosition } = SmForm || {};
      let isShow = false;
      if (title && labelPosition === 'top' && !singlePosition) {
        isShow = true;
      } else if (singlePosition && singlePosition === 'top') {
        isShow = true;
      }
      return isShow;
    }),
  };
}
