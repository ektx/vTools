<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "app"
};
</script>

<style lang="scss" scoped>
@import url("./assets/css/reset-1.5.0.css");

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
