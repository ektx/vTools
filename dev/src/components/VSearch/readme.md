# VSearch 

vue.js search component

## 使用

Js 中调用：

```javascript
import VSearch from '@/components/VSearch'
```

页面中：

```html
<VSearch v-model="value"/>

<VSearch v-model="newKey"/>
```

```javascript
new Vue({
	el: '#box',
	data: {
		// 要取值的对象
		value: ''
	},
	methods: {
		helloTest (val) {
			console.log(val)
		}
	}
})
```

### props

| 方法 | 类型 | 说明 | 默认值 |
| --- | --- |:---:|
| delay	| `Number` | 设置延迟功能 | 0 |
| focus | `Boolean` | 聚焦功能 | `false` |

### 事件

| 方法      | 说明                     |
| ------- | ---------------------- |
| input   | 输入事件，返回用户输入信息          |
| reset   | 清空按钮功能，清空时触发事件         |