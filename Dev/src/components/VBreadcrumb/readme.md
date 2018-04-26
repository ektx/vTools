# VBreadcrumb

vue.js 面包屑功能

## 使用

```html
<tempalte>
	<div>
    	<!-- 面包屑组件 浏览器跳转方式 -->
		<VBreadcrumb></VBreadcrumb>

		<!-- 面包屑组件 自定义跳转方式 -->
		<VBreadcrumb ref="vbreadcrumb" v-on:sendBreadCrumbEvt="emitBreadCrumbEvt"></VBreadcrumb>
    </div>
</tempalte>

<script>
// 本地使用 src/components
import VBreadcrumb from '@/components/VBreadcrumb'

export default {
  components: { VBreadcrumb },
  methods: {
    emitBreadCrumbEvt (data) {
        console.log(data) // => {url: '/home'}
    }
  }
}
</script>

```

## 说明

| 标签                     | 说明           |
| ---------------------- | ------------ |
| ref                    | 用于自定义事件回调 id |
| v-on:sendBreadCrumbEvt | 点击面包屑回调事件    |

