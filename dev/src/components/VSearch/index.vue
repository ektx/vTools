<template>
	<div class="v-search-mod">
		<div class="v-search-inner">
			<input
				type="text"
				v-bind="$attrs"
				v-model="searchVal"
                v-focus="focus"
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
        value: {
            type: [Number, String]
        },
        delay: {
            type: Number,
            default: 0
        },
        focus: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            delayEvt: null
        }
    },
    computed: {
        searchVal: {
            get () {
                return this.value
            },
            set (val) {
                if (this.delay) {
                    clearTimeout(this.delayEvt)

                    this.delayEvt = setTimeout(()=> {
                        this.$emit('input', val)
                    }, this.delay)
                } else {
                    this.$emit('input', val)
                }
            }
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
		border: none;
		outline: none;
		background: transparent;
		border-radius: 100%;
		cursor: pointer;
		transform: translate(0%, -50%);
		transition: 
            background-color .3s ease-in-out,
            opacity .3s ease-in-out;

		svg {
            width: 12px;
            height: 12px;
            padding: 4px;
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