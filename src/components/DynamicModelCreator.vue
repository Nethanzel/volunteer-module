<template>
    <div class="creator" @click="preventHide($event)">
        <div class="head">
            <div class="ico">
                <i class="icofont-arrow-left" @click="$emit('hide')"></i>
            </div>
            <div class="title">
                <h2>{{ title }}</h2>
            </div>
        </div>
        <EditableField 
            v-for="(field, i) in fields" :key="i" 
            :type="field.type" 
            :label="field.display" 
            :value="null" 
            :_key="field.key" 
            :disableSave="true" 
            :options="field.options"

            @change="field.value = $event"
        />

        <button v-if="!executin" @click="createObj">Terminar</button>
        <img v-else class="rotating" src="../assets/spinner.png" alt="loading">
    </div>
</template>

<script>
    import EditableField from './EditableField.vue';
    export default {
        props: {
            fields: Array,
            title: String
        },
        components: {
            EditableField
        },
        data() {
            return {
                executin: false
            }
        },
        methods: {
            preventHide(e) {
                e.stopPropagation();
            },
            stopExcutin() {
                this.executin = false;
            },
            createObj() {
                let obj = {};
                this.executin = true;
                this.fields.forEach(field => obj[field.key] = field.value);
                this.$emit('done', obj);
            }
        },
        mounted() {
            this.$emit('ready', this.stopExcutin);
        }
    }
</script>

<style lang="scss" scoped>
    .creator {
        display: flex;
        flex-direction: column;
        padding: 10px;
        max-width: 340px;
        min-width: 335px;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        .head {
            display: flex;
            margin-bottom: 10px;
            
            .title {
                h2 {
                    user-select: none;
                    margin-bottom: 0px;
                }
            }
            .ico {
                padding-right: 20px;
                i {
                    font-size: 35px;
                    cursor: pointer;
                }
            }
            .ico, .title {
                display: flex;
                align-items: center;
            }
        }
        button {
            width: 125px;
            margin-top: 15px;
            margin-left: auto;
        }
        .rotating {
            width: 36px;
            height: 36px;
            margin-top: 15px;
            margin-left: auto;
            margin-right: calc(125px / 2 - 36px / 2);
        }
    }
</style>