<template>
	<div class="v-search-mod">
		<div class="v-search-inner">
			<input
				type="text"
				:placeholder="placeholder"
				v-model="searchVal"
                v-focus="focus"
				@input="sendVal"
                @blur="blurEvt"
			>
			<button @click="resetInt">
				<svg viewBox="0 0 12 16">
					<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>
export default {
    name: 'VSearch',
    props: {
        // 清空按钮
        resetBtn: {
            type: Boolean,
            default: false
        },
        delay: {
            type: Number,
            default: 0
        },
        placeholder: {
            type: String,
            default: 'Search...'
        },
        focus: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            searchVal: '',
            btn: this.resetBtn,
            delayEvt: null
        }
    },
    directives: {
        focus: {
            update: function (el, binding) {
                if (typeof binding.value === 'boolean' && binding.value) {
                    el.focus()
                }
            }
        }
    },
    methods: {
        resetInt (event) {
            this.searchVal = ''
            this.$emit('reset', { event })
            this.$emit('input', '')
        },

        sendVal () {
            if (this.delay) {
                clearTimeout(this.delayEvt)

                this.delayEvt = setTimeout(()=> {
                    this.$emit('input', this.searchVal)
                }, this.delay)
            } else {
                this.$emit('input', this.searchVal)
            }
        },

        blurEvt (evt) {
            this.$emit('blur', evt)
        }
    }
}
</script>

<style lang="scss">
.v-search-inner {
	position: relative;
	overflow: hidden;
	font-size: 12px;

	& > button {
		position: absolute;
		right: 3px;
		top: 50%;
		display: flex;
		width: 1.8em;
		height: 1.8em;
		vertical-align: top;
		justify-content: center;
		border: none;
		outline: none;
		background: transparent;
		border-radius: 100%;
        visibility: visible;
		cursor: pointer;
		transform: translate(0%, -50%);
		transition: 
            background-color .3s ease,
            opacity .3s ease-in-out;

		svg {
            width: 14px;
            height: 14px;
			fill: rgba(0, 0, 0, .2);
            transform: rotate(45deg);
			transition: transform .3s ease;
		}

		&:hover {
			background-color: rgba(0, 0, 0, .05);

            svg {
				fill: rgba(0, 0, 0, .4)
            }
		}

		&:active {
			background-color: rgba(0, 0, 0, 0);
			transition: background-color 0s ease;
		}
	}
	
	& > input {
		display: block;
		width: 100%;
		padding: .25em 2.5em .3em 1em;
		background: rgba(255, 255, 255, .3);
		border: 1px solid rgba(0, 0, 0, .1);
		border-radius: 20px;
		box-sizing: border-box;
		outline: none;
		transition: border .3s ease-in-out;

		&::placeholder {
			color: #999;
		}

		&:hover {
			border-color: rgba(0, 0, 0, .2)
		}

		&:focus {
			border-color: rgba(0, 0, 0, .3);
		}

		&:placeholder-shown + button {
            opacity: 0;
            visibility: hidden;
		}
	}

}
</style>