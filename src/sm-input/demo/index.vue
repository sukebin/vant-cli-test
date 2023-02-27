<template>
  <demo-section>
    <demo-block class="demo-sm-input" title="基础用法">
      <sm-input v-model="val"></sm-input>
    </demo-block>
    <demo-block class="demo-sm-input" title="自定义宽">
      <sm-input v-model="val1" width="300" width-unit="px"></sm-input>
    </demo-block>
    <demo-block class="demo-sm-input" title="自定义高">
      <sm-input v-model="val2" height="100" />
    </demo-block>
    <demo-block class="demo-sm-input" title="多行文本框">
      <sm-input v-model="val3" multiple-lines />
    </demo-block>
    <demo-block class="demo-sm-input" title="常用词类型">
      <sm-input
        v-model="val4"
        common-word-type="conventionalType"
        :default-prompt="defaultPrompt"
      ></sm-input>
    </demo-block>
  </demo-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SmInput from '../index.vue';

const val = ref('');
const val1 = ref('');
const val2 = ref('');
const val3 = ref('');
const val4 = ref('');
const val5 = ref(
  '测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据'
);
const defaultPrompt = ref('请选择');
const pattern = ref('/\d{6}/');
const permission = ref(['hidden', 'notnull', 'edit']);
</script>
<style lang="scss" scoped>
.demo-sm-input {
  .sm-input {
    padding: 0 15px;
  }
}
</style>
