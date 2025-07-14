<template>
    <div class="filter-builder" @click="preventHide">
        <h2><i class="icofont-arrow-left" @click="$emit('hide')"></i>{{ title }}</h2>
        <div class="cntn">
            <p v-if="!filters" class="no-filter">No hay filtros</p>

            <EditableField 
                v-for="(filter, i) in filters"
                :key="`filter-${i}`"
                :disableSave="true"
                :_key="filter.key"
                :type="filter.type"
                :value="filter.value"
                :label="filter.display"
                :options="filter.options"

                @change="filter.value = $event"
                :style="{ maxWidth:'220px' }"
            />

        </div>
        <button @click="$emit('done')">{{ btnText || 'Buscar' }} <i class="icofont-arrow-right"></i></button>
    </div>
</template>

<script>
    import EditableField from './EditableField.vue';

    export default {
        props: {
            title: String,
            filters: { type: [Array, null] },
            btnText: String
        },
        components: {
            EditableField
        },
        methods: {
            preventHide(e) {
                e.stopPropagation();
            }
        }
    }
</script>

<style scoped lang="scss">
    .filter-builder {
        background-color: #fff;
        max-width: 560px;
        max-height: 450px;
        width: auto;
        padding: 10px;
        overflow: hidden;
        border-radius: 5px;

        display: flex;
        flex-direction: column;

        h2 {
            display: flex;
            align-items: center;
            text-align: left;
            margin-bottom: 15px;
            i {
                font-size: 30px;
                margin-right: 15px;
                cursor: pointer;
            }
        }
        button {
            align-self: flex-end;
            margin-top: 10px;
            padding: 4px 10px;

            display: flex;
            align-items: center;
            justify-content: center;
            i {
                font-size: 18px;
                margin-top: 4px;
                margin-left: 7px;
            }
        }
        .cntn {
            width: calc(100% - 10px);
            padding: 10px 5px;
            height: auto;

            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            overflow-x: auto;
            .no-filter {
                color: #b6b6b6;
                cursor: default;
                text-align: center;
            }
        }
    }
</style>