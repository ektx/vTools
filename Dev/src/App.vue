<template>
    <div id="app" :class="{'dark-scheme': isDark}">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: "app",
  data () {
    return {
      isDark: false
    }
  },
  methods: {
    toggleTheme () {
      this.isDark = !this.isDark
    }
  }
};
</script>

<style lang="scss">
@import url("./assets/css/reset-1.5.0.css");
@import "./assets/css/theme.scss";

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
