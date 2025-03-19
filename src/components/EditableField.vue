<template>
    <div class="field">
        <p>{{ label }}</p>

        <input v-if="showInput" :ref="type" :type="type" @input="inputExactWidth" v-model="usedValue" />

        <select v-if="showSelect" :ref="type" @change="inputExactWidth">
            <option v-for="(opt, i) in options" :selected="value == opt.key" :value="opt.key" :key="i">{{ opt.value }}</option>
        </select>

        <textarea v-if="showTextArea" :ref="type" @input="inputExactWidth" v-model="usedValue"></textarea>

        <i v-if="showSave && !_disableSave" class="icofont-check" @click="saveChange"></i>
        <img class="rotating" src="../assets/spinner.png" alt="loading">
    </div>
</template>

<script>
    export default {
        props: {
            _key: String,
            type: String,
            label: String,
            options: Array,
            isYesNo: Boolean,
            disableSave: Boolean,
            value: { type: [String, Number, Boolean] },
        },
        data() {
            return {
                showSave: false,
                usedValue: ""
            }
        },
        beforeMount() {
            setTimeout(() => this.initShowSave(), 10);
            this.usedValue = this.value;
            this.inputExactWidth();
        },
        mounted() {
        },
        methods: {
            inputExactWidth() {
                if (!this.$refs[this.type]) return;

                if (this.showSelect) {
                    const select = this.$refs[this.type];
                    let x = (select.options[select.selectedIndex].text.length +5) + "ch";
                    this.usedValue = select.options[select.selectedIndex].value;                    
                    select.style.width = x;
                }

                this.$emit('change', this.$refs[this.type]?.value);
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
            },
            initShowSave() {
                if (this.value == null || this.value == undefined || this.value == "") this.showSave = false;
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
            },
            usedValue(n) { 
                if (n == "" && (this.value == null || this.value == undefined || this.value == "")) return this.showSave = false;
                this.showSave = n != `${this.value}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        display: inline-flex;
        align-items: flex-start;
        flex-wrap: wrap;
        max-width: 295px;
        width: 100%;
        padding: 10px;
        margin: 5px 10px;
        margin-bottom: 15px;
        border: 1px solid #c4c4c4a2;
        border-left: 4px solid #000;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        position: relative;
        P {
            margin: 0 10px 0 0;
            font-weight: bold;
            cursor: default;

            width: 100%;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        input, select, textarea {
            border: none;
            min-width: 125px;
            max-width: 245px;
            padding: 5px 8px;
            margin-right: 10px;
            margin-top: 8px;
            background-color: transparent;
            &:focus {
                outline: 2px solid #c7c7c7;
                background-color: #e2e2e2;
            }
        }

        input[type=date] {
            min-width: 110px !important;
        }

        input {
            field-sizing: content;
        }

        textarea {
            max-width: unset;
            height: 55px !important;
            margin: 5px 0px 8px 0px;
            width: calc(100% - 18px) !important;
        }

        i {
            font-size: 22px;
            cursor: pointer;
            color: #000000a2;
            position: relative;
            margin-left: auto;
            margin-top: auto;
        }

        .rotating {
            height: 20px;
            width: 20px;
            margin-left: auto;
            margin-top: auto;
            display: none;
        }
    }
</style>