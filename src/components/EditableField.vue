<template>
    <div class="field" :style="{ flexDirection: type == 'text-area' ? 'column' : 'row' }">
        <p :style="{ alignSelf: type == 'text-area' ? 'baseline' : 'unset' }">{{ label }}:</p>
        <input v-if="showInput" :ref="type" :type="type" :value="usedValue" @input="inputExactWidth">
        <select v-if="showSelect" :ref="type" @change="inputExactWidth">
            <option v-for="(opt, i) in options" :selected="usedValue == opt.key" :value="opt.key" :key="i">{{ opt.value }}</option>
        </select>
        <textarea v-if="showTextArea" :ref="type" :value="usedValue" @input="inputExactWidth"></textarea>
        <i v-if="showSave && !_disableSave" class="icofont-check" @click="saveChange" :style="{ alignSelf: type == 'text-area' ? 'end' : 'unset' }"></i>
        <img class="rotating" src="../assets/spinner.png" alt="loading">
    </div>
</template>

<script>
    export default {
        props: {
            type: String,
            label: String,
            value: { type: [String, Number, Boolean] },
            _key: String,
            options: Array,
            isYesNo: Boolean,
            disableSave: Boolean
        },
        data() {
            return {
                showSave: false,
                usedValue: this.value
            }
        },
        mounted() {
            this.inputExactWidth()
        },
        methods: {
            inputExactWidth() {
                if (!this.$refs[this.type]) return;

                let x = 0;

                if (this.showInput) x = (this.$refs[this.type]?.value.length +1) + "ch";
                if (this.showSelect) x = (this.$refs[this.type].options[this.$refs[this.type].selectedIndex].text.length +5) + "ch";

                this.showSave = this.isYesNo ? JSON.parse(this.$refs[this.type]?.value) != this.value : this.$refs[this.type]?.value != this.value;
                this.$refs[this.type].style.width = x;

                if (this._disableSave) this.$emit('change', this.$refs[this.type]?.value);
            },
            saveChange(e) {
                let obj = {
                    key: this._key ?? this.toCamelCase(this.label),
                    value: this.$refs[this.type]?.value
                }

                if (this.isYesNo) obj.value = JSON.parse(this.$refs[this.type]?.value);
                if (this.type == 'number') obj.value = Number(this.$refs[this.type]?.value);

                this.$emit("save", { field: obj, target: e.target });
            },
            toCamelCase(text) {
                return text
                    .toLowerCase()
                    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
                        index === 0 ? match.toLowerCase() : match.toUpperCase()
                    )
                    .replace(/\s+/g, '');
            }
        },
        computed: {
            showInput() {
                let types = ["text", "number", "date"];
                return types.includes(this.type);
            },
            showSelect() {
                return this.type.toLowerCase() == "select";
            },
            showTextArea() {
                return this.type.toLowerCase() == "text-area";
            },
            _disableSave() {
                return this.disableSave == null ? false : this.disableSave 
            }
        },
        watch: {
            value(n) {
                this.usedValue = n;
                this.showSave = n != this.usedValue;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        display: inline-flex;
        align-items: center;
        max-width: 295px;
        width: 100%;
        padding: 10px;
        margin: 5px 10px;
        margin-bottom: 15px;
        border: 1px solid #c4c4c4a2;
        border-left: 4px solid #000;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        P {
            margin: 0 10px 0 0;
            font-weight: bold;
            cursor: default;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        input, select, textarea {
            border: none;
            min-width: 85px;
            max-width: 170px;
            padding: 5px 8px;
            margin-right: 10px;
            background-color: transparent;
            &:focus {
                outline: 2px solid #c7c7c7;
                background-color: #e2e2e2;
            }
        }

        input[type=date] {
            min-width: 110px !important;
        }

        textarea {
            max-width: unset;
            height: 55px !important;
            margin: 5px 10px 8px 10px;
            width: calc(100% - 20px) !important;
        }

        i {
            font-size: 22px;
            color: #000000a2;
            cursor: pointer;
            margin-left: auto;
        }

        .rotating {
            height: 20px;
            width: 20px;
            margin-left: auto;
            display: none;
        }
    }
</style>