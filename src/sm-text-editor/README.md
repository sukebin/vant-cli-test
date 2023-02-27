# sm-text-editor 组件

### 介绍

sm-text-editor 是一个富文本编辑器组件

### 引入

```javascript
import Vue from 'vue';
import { sm-text-editor } from 'smui-form-library';

import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

Vue.use(sm-text-editor);
```

## 代码演示

### 基础用法

```html
<SmTextEditor title="富文本标题" v-model="val"></SmTextEditor>
```

### 自定义高度

```html
<SmTextEditor title="富文本标题" v-model="val" height="300"></SmTextEditor>
```

### 只读

```html
<SmTextEditor
  title="富文本预览模式标题"
  v-model="val1"
  :permission="permission"
></SmTextEditor>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SmTextEditor from '../index.vue';
import SmFormItem from '../../sm-form-item/index.vue';

const val1 = ref('<p>1234567890</p></p>');
const permission = reactive(['readonly']);
</script>
```

### 常用词

```html
<demo-block class="demo-sm-text-editor" title="常用词">
  <SmTextEditor v-model="val1" common-word-type="conventionalType" />
</demo-block>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SmTextEditor from '../index.vue';
import SmFormItem from '../../sm-form-item/index.vue';

const val1 = ref('<p>1234567890</p></p>');
</script>
```

## API

### Props

| 参数           | 说明                                                                                                                | 类型             | 默认值         | 备注                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------- | --------------------------------------------- |
| value          | 值，使用 v-model 实现双向绑定                                                                                       | _String,Number_  |                |                                               |
| height         | 高度                                                                                                                | _String, Number_ | `180`          | 单位为 px                                     |
| title          | 富文本编辑器标题                                                                                                    | _String_         | `富文本编辑器` |                                               |
| commonWordType | 常用词类型,可选值:notBind(不绑定常用词),conventionalType(常规类型),approvalComments(审批意见),addressInfo(地址信息) | _String_         | `notBind`      | 不存在所关联的业务代码（bcode）时, 该功能无效 |
| permission     | 权限控制，可多选                                                                                                    | _Array_          | `['edit']`     |                                               |

