import { computed, ref, inject, InjectionKey } from 'vue';
import type { Prop, ExtractPropTypes } from 'vue';
import type { FormContext, FormItemContext,FormValidateContext } from '../sm-form/form';

export type PropsParams = Record<string, Prop<string, any>>;

export function permissionComputed(
  props: Readonly<ExtractPropTypes<any>>,
  formContext: FormContext | Record<string, any>
) {
  const always = computed(() => props.permission.indexOf('always') !== -1);
  const getViewMode = computed(() => {
    if (always.value || props.belongForm) {
      return false;
    }
    return formContext?.isViewMode || false;
  });
  const isReadonly = computed(
    () =>
      !!(
        (props.permission.indexOf('readonly') !== -1 &&
          props.permission.indexOf('always') === -1) ||
        formContext?.isViewMode ||
        props.permission.indexOf('alwaysReadOnly') !== -1
      )
  );

  return {
    notnull: computed(() => props.permission.indexOf('notnull') !== -1),
    isHidden: computed(() => props.permission.indexOf('hidden') !== -1),
    isReadonly,
    always,
    getViewMode,
    // 预览模式计算属性
    getPreviewStyle: computed(() => ({ fontWeight: 'bolder' })),
    // 全局只读背景颜色类名
    readonlyBgCN: computed(() => {
      // 区分预览模式和只读模式，预览模式将直接返回白色底色
      if (getViewMode.value) return 'readonlybg-white';
      return isReadonly.value ? `readonlybg-${formContext.readonlyBg}` : '';
    }),
    borderStyleCN: computed(() => `bdstyle-${props.borderStyle}`),
  };
}

// 公共data
export function commonState() {
  return {
    defaultHeight: ref('39px'),
  };
}

export const formItemKey: InjectionKey<FormItemContext | Record<string, any>> =
  Symbol('SmFormItem');
export const formKey: InjectionKey<FormContext | Record<string, any>> =
  Symbol('SmForm');
export const formValidate: InjectionKey<
  FormValidateContext | Record<string, any>
> = Symbol('SmFormValidate');
// 公共inject
export function commonInject() {
  return {
    SmFormItem: inject(formItemKey, {})!,
    SmForm: inject(formKey, {})!,
    SmFormValidate:inject(formValidate,{})!
  };
}
