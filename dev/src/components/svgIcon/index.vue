<template>
    <svg>
        <use :xlink:href="iconName"/>
    </svg>
</template>

<script>
export default {
    name: 'svg-icon-com',
    props: {
        icon: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconName () {
            return `#svg-icon-${this.icon}`
        }
    }
}
</script>
