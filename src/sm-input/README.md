# SmInput 组件

### 介绍

SmInput 是一个文本框组件

### 引入

```javascript
import Vue from 'vue';
import { SmInput } from 'smui-form-library';

Vue.use(SmInput);
```

## 代码演示

### 基础用法

```html
<template>
  <sm-input v-model="val"></sm-input>
  {{val}}
</template>
<script>
  export default {
    data() {
      return {
        val: '',
      };
    },
    methods: {},
  };
</script>
```

### 自定义宽

```html
<template>
  <sm-input v-model="val" width="300" widthUnit="px" />
  <script>
    export default {
      data() {
        return {
          val: '',
        };
      },
      methods: {},
    };
  </script>
</template>
```

### 自定义高

```html
<template>
  <sm-input v-model="val" height="100" />
  <script>
    export default {
      data() {
        return {
          val: '',
        };
      },
      methods: {},
    };
  </script>
</template>
```

### 多行文本框

```html
<template>
  <sm-input v-model="val" multipleLines height="300" />
  <script>
    export default {
      data() {
        return {
          val: '',
        };
      },
      methods: {},
    };
  </script>
</template>
```

### 权限控制

可选值：见[权限处理](#/permission)

```html
<template>
  只读
  <sm-input :permission="permission2" v-model="value" />
  隐藏
  <sm-input :permission="permission1" />
  <br />
  总是可用
  <sm-input :permission="permission3" />
  <br />
  必填(不能为空)
  <sm-input :permission="permission4" />
</template>
<script>
  export default {
    data() {
      return {
        value: '只读，不可修改',
        permission1: ['hidden'],
        permission2: ['readonly'],
        permission3: ['hidden', 'always'],
        permission4: ['notnull'],
      };
    },
  };
</script>
```

### 常用词类型

可选值：

- notBind —— 不绑定常用词，默认
- conventionalType —— 常规类型
- approvalComments —— 审批意见
- addressInfo —— 地址信息

```html
<template>
  <sm-input
    v-model="val"
    :defaultPrompt="defaultPrompt"
    commonWordType="conventionalType"
  ></sm-input>
  <p>{{val}}</p>
</template>
<script>
  export default {
    data() {
      return {
        val: '',
        defaultPrompt: '请选择',
      };
    },
    methods: {},
  };
</script>
```

## API

### Props

| 属性           | 说明                                                                                                                | 类型             | 默认值           | 备注                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------- | --------------------------------------------- |
| value          | 值，使用 v-model 实现双向绑定                                                                                       | _String, Number_ |                  |                                               |
| defaultPrompt  | 默认提示，输入框占位文本                                                                                            | _String_         | `请输入文本信息` |                                               |
| name           | 名称，标识符                                                                                                        | _String_         |                  |                                               |
| title          | 输入框标题                                                                                                          | _String_         | `标题`           |                                               |
| width          | 宽度                                                                                                                | _String, Number_ | `100`            | 单位为 %和 px                                 |
| widthUnit      | 宽度单位                                                                                                            | _String_         | `%`              | 单位为 %和 px                                 |
| height         | 高度                                                                                                                | _String, Number_ | `50`             | 单位为 px                                     |
| rules          | 校验规则                                                                                                            | _Rule[]_         |                  |                                               |
| multipleLines  | 是否多行，若是多行，即为文本框 textarea                                                                             | _Boolean_        | `false`          |                                               |
| permission     | 权限控制，可多选                                                                                                    | _Array_          | `['edit']`       |                                               |
| commonWordType | 常用词类型,可选值:notBind(不绑定常用词),conventionalType(常规类型),approvalComments(审批意见),addressInfo(地址信息) | _String_         | `notBind`        | 不存在所关联的业务代码（bcode）时, 该功能无效 |

### Methods

| 方法名 | 说明 | 参数 |
| ------ | ---- | ---- |
|        |      |      |
