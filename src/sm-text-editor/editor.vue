<template>
  <div class="quill-editor">
    <div ref="editorRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { PropType } from 'vue';
import Quill from 'quill';
import type { QuillOptionsStatic } from 'quill';
// 配置
const defaultOptions: QuillOptionsStatic = {
  theme: 'snow',
  bounds: document.body,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: 'Insert text here ...',
  readOnly: false,
};
let quill: Quill | null;
//props
const props = defineProps({
  modelValue: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object as PropType<QuillOptionsStatic>,
    default: {},
  },
});
// data
const editorRef = ref();
let content: string;
const emits = defineEmits([
  'update:modelValue',
  'on-blur',
  'on-focus',
  'on-change',
]);
// methods
const initialize = () => {
  let initBlur = true;
  const options = Object.assign(defaultOptions, props.options);
  quill = new Quill(editorRef.value, options);
  // quill = new Quill(editorRef.value, defaultOptions);
  //禁用
  quill.enable(!props.disabled);
  //初始化值
  if (props.modelValue) {
    quill.pasteHTML(props.modelValue as string);
  }
  //输入框点击和失焦事件
  quill.on('selection-change', (range) => {
    if (!range) {
      if (initBlur) {
        return;
      }
      emits('on-blur', quill);
    } else {
      emits('on-focus', quill);
    }
    // 首次点击界面会触发一次
    initBlur = false;
  });
  //文本输入监听
  quill.on('text-change', (delta, oldContents, source) => {
    // console.log(delta, oldContents, source);
    let html = editorRef.value.children[0].innerHTML;
    if (html == '<p><br></p>') {
      html = '';
    }
    console.log('html',html)
    content = html;
    emits('update:modelValue', html);
    emits('on-change',  html );
  });
};
onMounted(() => {
  initialize();
});
watch(
  () => props.modelValue,
  (val) => {
    if (quill) {
      //防止重复插入数据，
      if (val && content !== val) {
        quill.pasteHTML(val);
      } else if (!val) {
        quill.setText('');
      }
    }
  }
);
watch(
  () => props.disabled,
  (val) => {
    if (quill) {
      quill.enable(!val);
    }
  }
);
</script>
<script lang="ts">
export default {
  name: 'QuillEditor',
};
</script>
<style>
.quill-editor {
  min-height: 180px;
}
</style>
