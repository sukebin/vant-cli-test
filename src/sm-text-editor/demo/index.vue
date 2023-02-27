<template>
  <demo-section>
    <demo-block class="demo-sm-text-editor" title="基础用法">
      <SmFormItem title="富文本">
        <SmTextEditor v-model="val1" />
      </SmFormItem>
    </demo-block>
    <demo-block class="demo-sm-text-editor" title="自定义高度">
      <SmFormItem
        title="富文本自定义高度"
        :special-cp="true"
        single-position="top"
      >
        <SmTextEditor v-model="val2" height="250" />
      </SmFormItem>
    </demo-block>
    <demo-block class="demo-sm-text-editor" title="只读">
      <SmTextEditor v-model="val2" :permission="permission" />
    </demo-block>
    <demo-block class="demo-sm-text-editor" title="常用词">
      <SmTextEditor v-model="val2" common-word-type="conventionalType" />
    </demo-block>
  </demo-section>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SmTextEditor from '../index.vue';
import SmFormItem from '../../sm-form-item/index.vue';

const val1 = ref('<p>1234567890</p></p>');
const val2 = ref('<p>1234567890</p></p>');
const permission = reactive(['readonly']);
</script>
<style lang="scss" scoped>
.demo-sm-text-editor {
  .sm-text-editor {
    padding: 0 15px;
  }
}
</style>
