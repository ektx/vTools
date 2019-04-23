<template>
    <div class="bar-mod">
        <ul>
            <li v-for="nav in navs" :key="nav.icon" @click="current = nav">
                <svg-icon :class="['svg-icon', {hold: nav.hold}]" :icon="nav.icon"/>
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
                    icon: 'directory',
                    hold: true
                },
                {
                    icon: 'star',
                    hold: false
                },
                {
                    icon: 'tag',
                    hold: false
                },
                {
                    icon: 'search',
                    hold: false
                }
            ],
            current: {}
        }
    },
    watch: {
        current (val, old) {
            if (old) old.hold = false
            val.hold = true
        }
    },
    mounted () {
        this.current = this.navs[0]
    }
};
</script>

<style lang="scss" scoped>
.bar-mod {
    width: 50px;

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
        fill: #ccc;
        cursor: pointer;
        transition: fill .3s ease-in-out;
    }

    .svg-icon.hold,
    .svg-icon:hover {
        fill: #333;
    }
}
</style>
