<template>
  <div
    :id="'wrap_' + onlyId"
    :class="['sm-text-editor', { 'sm-previewMode': getViewMode }]"
    v-if="!(isHidden && !always)"
  >
    <template v-if="!getViewMode">
      <!-- <div class="title" v-if="title">{{ title }}</div> -->
      <quillEditor
        id="quillEditor"
        :style="{
          width: width,
          height: height ? height + heightUnit : '180px',
        }"
        v-model="content"
        ref="quillEditorRef"
        :class="['editor', readonlyBgCN, { hideCommonWord: !showCommonWord }]"
        :options="editorOption"
        :disabled="isReadonly"
        @on-blur="onEditorBlur"
        @on-change="onEditorChange"
      ></quillEditor>
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
      <Uploader :after-read="afterRead" :id="onlyId" class="uploader" />
    </template>
    <template v-else>
      <div
        class="sm-form-content"
        v-if="content != '' && content !== null"
        v-html="content"
      ></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Uploader, Picker, Popup, showToast  } from 'vant';
import type { PickerOption, UploaderFileListItem,PickerConfirmEventParams } from 'vant';
import type { QuillOptionsStatic } from 'quill';
import quillEditor from './editor.vue';
import { ref, reactive, computed, onMounted, inject } from 'vue';
import { commonProps } from '../hooks/commonProps';
import {
  permissionComputed,
  commonState,
  commonInject,
} from '../hooks/permission';
import { GenerateUUID } from '../util/UUIDUtil';
import { getApi, SmApice } from '../hooks/getApice';
import { showTitleFun } from '../hooks/specialComponent';
import { useService } from '../services/index';

const Service = useService();
const { SmFormItem, SmForm } = commonInject();
const smApice = inject<SmApice>('smApice', undefined);
const emits = defineEmits(['update:modelValue', 'on-blur', 'on-change']);
const { getWcont, uploadFile } = getApi(smApice);
// props
const props = defineProps({
  ...commonProps,
  modelValue: {
    type: String,
    default: null,
  },
  // 富文本编辑器标题
  title: {
    type: String,
    default: '富文本编辑器',
  },
  height: {
    type: [String, Number],
    default: '180',
  },
  heightUnit: {
    type: String,
    default: 'px',
  },
  // 富文本编辑器工具栏配置
  options: {
    type: [Array],
    default() {
      return [
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
        ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
        // [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
        [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
        [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
        // [{'direction': 'rtl'}], // 文本方向-----[{'direction': 'rtl'}]
        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
        // [{font: []}], // 字体种类-----[{ font: [] }]
        [{ align: [] }], // 对齐方式-----[{ align: [] }]
        ['clean'], // 清除文本格式-----['clean']
        ['image'], // 链接、图片、视频-----['link', 'image', 'video']
        // 自定义工具
        ['commonWord'], // 常用词
      ];
    },
  },
  // 常用词类型
  commonWordType: {
    type: String,
    default: 'notBind',
  },
});

// computed
const {
  isReadonly,
  isHidden,
  always,
  getViewMode,
  readonlyBgCN,
  borderStyleCN,
} = permissionComputed(props, SmForm);

// 常用词的显示隐藏
const showCommonWord = computed(() => {
  return props.commonWordType !== 'notBind' && !isReadonly.value;
});
const { showTitle } = showTitleFun(SmFormItem, SmForm);

// data
const content = ref<string>(props.modelValue);
const quillEditorRef = ref();
const onlyId = ref(GenerateUUID());
// 常用词
const wcontObj: { [key: string]: number } = {
  conventionalType: 0,
  approvalComments: 1,
  addressInfo: 2,
};
const wcontList = ref<PickerOption[]>([]);
const bcode = ref(window.theValues?.['JOB_BASE.BCODE'] || '');
const showPicker = ref(false);
const editorOption = reactive<QuillOptionsStatic>({
  placeholder: '请输入文本...',
  theme: 'snow',
  modules: {
    toolbar: {
      container: props.options,
      handlers: {
        image() {
          handleImageUpload();
        },
        commonWord() {
          if (!wcontList.value.length) {
            showToast('暂无可选择的常用词！');
            return;
          }
          showCommonWordPicker();
        },
      },
    },
  },
  readOnly: true,
});

// methods
//重写工具栏常用词
const showCommonWordPicker = () => {
  // console.log('123');
  if (!wcontList.value.length) {
    showToast('暂无可选择的常用词！');
    return;
  }
  showPicker.value = true;
};
//获取常用词
const getSuggestions = (wtype: string) => {
  //预览不需要;不显示也不需要请求
  if (getViewMode.value || !showCommonWord.value) {
    return;
  }
  Service.getWcont({
    wtype: wcontObj[wtype],
    bcode: bcode.value,
    wfield: '',
  })
    .then((response) => {
      wcontList.value = handleData(response);
    })
    .catch(function () {
      showToast('操作失败');
    });
};
// 常用词的列表确定
const onConfirm = ({ selectedOptions } : PickerConfirmEventParams) => {
  content.value = String(selectedOptions[0]?.text);
  showPicker.value = false;
};
// 解析处理数组
const handleData = (data: PickerOption[]) => {
  const handleArr: PickerOption[] = [];
  data.map((item: PickerOption) => {
    handleArr.push({
      text: item.Wcont,
    });
  });
  return handleArr;
};
//重写工具栏的上传图片
const handleImageUpload = () => {
  if (isReadonly.value) {
    showToast('已禁止上传');
    return;
  }
  //点击uploader 组件
  document.querySelector('#' + onlyId.value + ' > div > div > input')?.click();
};
//上传文件处理
const afterRead = (file: UploaderFileListItem | UploaderFileListItem[]) => {
  if (Array.isArray(file)) {
    file.forEach((item) => {
      upload(item);
    });
  } else {
    upload(file);
  }
};
//上传文件
const upload = (file: UploaderFileListItem) => {
  const params = new FormData();
  params.append('mFile', file.file!);
  params.append('isPreview', 'true');
  params.append('fileInfo', '');
  params.append('srcType', '0');

  Service.uploadFile(params)
    .then((res) => {
      const url =
        '/filemgr/comm/downFileByPath?type=image&macroPath=' + encodeURI(res);
      const img = `<img src='${url}'>`;
      content.value += img;
    })
    .catch((err) => {
      showToast(err);
    });
};
//失焦
const onEditorBlur = (e: string) => {
  emits('on-blur', e);
  if (props.validateEvent) {
    SmFormItem?.validate?.('blur');
  }
};
//修改值
const onEditorChange = (html: string) => {
  emits('update:modelValue', html);
  if (props.validateEvent) {
    SmFormItem?.validate?.('change');
  }
};
onMounted(() => {
  getSuggestions(props.commonWordType);
});
</script>
<script lang="ts">
export default {
  name: 'SmTextEditor',
};
</script>
