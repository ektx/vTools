<template>
  <div class="bar-mod">
    <ul>
      <li v-for="nav in navs" :key="nav.icon" @click="current = nav">
        <svg-icon :class="['svg-icon', {hold: nav.hold}]" :icon="nav.icon" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "active-bar",
  data() {
    return {
      navs: [
        {
          icon: "directory",
          hold: true
        },
        {
          icon: "star",
          hold: false
        },
        {
          icon: "qrcode",
          hold: false
        },
        {
          icon: "search",
          hold: false
        }
      ],
      current: {}
    };
  },
  watch: {
    current(val, old) {
      if (old) old.hold = false;
      val.hold = true;
    }
  },
  mounted() {
    this.current = this.navs[0];

    window.addEventListener(
      "keydown",
      function(e) {
        if (e.metaKey && e.keyCode == "S".charCodeAt(0)) {
          e.preventDefault();
          alert("kl");
        }
      },
      false
    );
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin.scss";

.bar-mod {
  width: 50px;
  background-color: var(--mainBGColor);
  @include BGTransition;

  ul {
    margin: 30px 0 0;

    li {
      display: flex;
      height: 50px;
      justify-content: center;
    }
  }

  .svg-icon {
    width: 24px;
    fill: var(--waitColor);
    cursor: pointer;
    transition: fill 0.3s ease-in-out;
  }

  .svg-icon.hold,
  .svg-icon:hover {
    fill: var(--mainColor);
  }
}
</style>
