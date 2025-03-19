<template>
    <div class="filter-builder" @click="preventHide">
        <h2><i class="icofont-arrow-left"></i>{{ title }}</h2>
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
            />

        </div>
        <button>Terminar</button>
    </div>
</template>

<script>
    import EditableField from './EditableField.vue';

    export default {
        props: {
            title: String,
            filters: { type: [Array, null] }
        },
        components: {
            EditableField
        },
        methods: {
            preventHide(e) {
                e.stopPropagation();
            },
        }
    }
</script>

<style scoped lang="scss">
    .filter-builder {
        background-color: #fff;
        min-width: 410px;
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
        }
        .cntn {
            width: calc(100% - 10px);
            padding: 10px 5px;
            height: auto;

            display: flex;
            flex-wrap: wrap;
            .no-filter {
                color: #b6b6b6;
                cursor: default;
                text-align: center;
            }
        }
    }
</style>