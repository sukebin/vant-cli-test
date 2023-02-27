<template>
  <div class="sm-input" v-if="!(isHidden && !always)">
    <template v-if="!getViewMode">
      <Field
        :border="false"
        :class="[
          !multipleLines ? 'center-value input' : ' input multiplelines-box',
          readonlyBgCN,
          borderStyleCN,
        ]"
        v-model="inputVal"
        :name="name"
        :placeholder="isReadonly ? '' : defaultPrompt"
        :readonly="isReadonly"
        :clearable="!isReadonly"
        :autosize="!multipleLines ? false : { maxHeight: Number(height) }"
        :type="!multipleLines ? 'text' : 'textarea'"
        :rows="getRows"
        :style="{
          //  overflow: 'auto',
          width: width ? width + widthUnit : '100%',
          height: height ? height + 'px' : '',
          minHeight: height ? '' : defaultHeight,
        }"
        @blur="onBlur"
        @click="onClick"
      >
        <template #button v-if="commonWordType != 'notBind' && !isReadonly">
          <div class="commonWordBtn" @click="getCommonWord">常用词</div>
        </template>
      </Field>
      <div v-if="!isReadonly&&commonWordType != 'notBind'">
        <Popup v-model:show="showPicker" position="bottom" get-container="body">
          <Picker
            title="常用词"
            show-toolbar
            :columns="wcontList"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </Popup>
      </div>
    </template>
    <template v-else>
      <span class="sm-form-content" v-if="inputVal !== ''">{{ inputVal }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Field, Popup, Picker, showToast } from 'vant';
import { ref, onMounted, watch, computed, inject } from 'vue';
import { commonProps } from '../hooks/commonProps';
import {
  permissionComputed,
  commonState,
  commonInject,
} from '../hooks/permission';
import type { PickerOption,PickerConfirmEventParams  } from 'vant';
import { libraryConfig, BaseLibraryConfig } from '../plugins';
import { useService } from '../services/index';

const Service = useService();
const emits = defineEmits(['update:modelValue', 'on-blur', 'change']);

// inject
const { SmFormItem, SmForm } = commonInject();

const props = defineProps({
  ...commonProps,
  modelValue: {
    type: [String, Number],
    default: null,
  },
  // 标识符
  name: {
    type: String,
    default: '',
  },
  // 输入框头部文本(标题)
  title: {
    type: String,
    default: '标题',
  },
  // 默认提示
  defaultPrompt: {
    type: String,
    default: '请输入文本信息',
  },
  // 是否多行
  multipleLines: {
    type: Boolean,
    default: false,
  },
  // 检验规则
  rules: {
    type: Array,
    default() {
      return [];
    },
  },
  // 输入的最大字符数
  maxlength: {
    type: [String, Number],
    default: null,
  },
  // 是否显示字数统计，需要设置maxlength
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  // 输入框高度
  height: {
    type: [String, Number],
    default: '50',
  },
  // 输入框高度单位
  heightUnit: {
    type: String,
    default: 'px',
  },
  // 常用词类型
  commonWordType: {
    type: String,
    default: 'notBind',
    // default:'conventionalType'
  },
});

const { defaultHeight } = commonState();

const inputVal = ref(props.modelValue);
const wcontObj: { [key: string]: number } = {
  conventionalType: 0,
  approvalComments: 1,
  addressInfo: 2,
};
const wcontList = ref<PickerOption[]>([]);

const bcode = ref();
const showPicker = ref(false);
let openValidate = false;

// computed
const {
  isReadonly,
  isHidden,
  always,
  getViewMode,
  readonlyBgCN,
  borderStyleCN,
} = permissionComputed(props, SmForm);

const getRows = computed(() => {
  const rowHeight = Number(props.height);
  return Math.ceil((rowHeight - 20) / 24);
});
// method
/**
 * @description: 获取常用词数据
 * @param {Number} wtype 常用词的类型 0-常规类型，1-审批意见，2-地址信息
 */
const getSuggestions = (wtype: string) => {
  // 表单控件预览的时候不请求
  if (libraryConfig.scene === 'selectPreview') {
    return;
  }

  // 不绑定常用词(notBind)，或者不存在关联的业务代码时，不执行
  // fixbug: 74082 去除props.bcode，看PC的预览是bcode为空都请求
  if (wtype === 'notBind') {
    return;
  }
  Service.getWcont({
    wtype: wcontObj[wtype],
    bcode: bcode.value,
  })
    .then((response) => {
      wcontList.value = handleData(response);
    })
    .catch((err) => {
      showToast('操作失败');
    });
};

// 点击"常用词"触发
const getCommonWord = () => {
  // console.log('----常用词---');
  // if (!wcontList.value.length) {
  //   showToast('暂无可选择的常用词！');
  //   return;
  // }

  // showPicker.value = true;
};
// 点击常用词 -选择器的"确定"按钮触发
const onConfirm = ({ selectedOptions } : PickerConfirmEventParams) => {
    // inputVal.value = String(selectedOptions[0]?.text);
    // showPicker.value = false;
};
// 输入框失去焦点时触发
const onBlur = (e: string) => {
  // if (!isReadonly.value && props.validateEvent) {
  //   emits('on-blur', e);
  //   SmFormItem?.validate?.('blur');
  // }
};
const onClick = () => {
  // 当输入框只读且内容为号码时，可以拨打电话
  // const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
  // const telReg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
  // const telPhoneMethod = window.$bridge?.telPhone;
  // let clickStr = String(inputVal.value);
  // if (isReadonly.value) {
  //   if (telPhoneMethod && (phoneReg.test(clickStr) || telReg.test(clickStr))) {
  //     telPhoneMethod(clickStr);
  //   }
  // }
};

// 解析处理数组
const handleData = (data: PickerOption[]) => {
  const handleArr: PickerOption[] = [];
  // data.map((item: PickerOption) => {
  //   handleArr.push({
  //     text: item.Wcont,
  //   });
  // });
  return handleArr;
};

onMounted(() => {
  // props.bcode = 'lyy_vehicleInfo';
  openValidate = true;
  // getSuggestions(props.commonWordType);
});

watch(
  () => props.modelValue,
  (newValue) => {
    inputVal.value = newValue;
    if (openValidate && props.validateEvent) {
      SmFormItem?.validate?.('change');
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => inputVal.value,
  (val) => {
    emits('change', val);
    emits('update:modelValue', val);
  }
);
</script>

<script lang="ts">
export default {
  name: 'SmInput',
};
</script>
