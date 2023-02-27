<template>
  <div class="sm-input__btn-select">
    <template v-if="!hideText">{{ btnText }}</template>
    <van-icon v-else class="sm-input__btn-arrow" name="arrow" />
  </div>
</template>
<script setup lang="ts">
import { Icon as VanIcon } from 'vant';
import { ref } from 'vue';

defineProps({
  btnText: {
    type: String,
    default: '选择',
  },
  hideText: Boolean,
  customIcon: {
    type: String,
    defautl: 'arrow',
  },
});
</script>
<scritp lang="ts">
export default {
  name: 'selectBtn',
};
</scritp>

<style scoped lang="scss">
.sm-input__btn-arrow {
  color: #c3cbcf;
}
</style>
