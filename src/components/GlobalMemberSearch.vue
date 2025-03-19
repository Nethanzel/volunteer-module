<template>
    <div class="search" @click="preventHide($event)">
        <p class="close"><i class="icofont-close" @click="$emit('close')"></i></p>
        <div class="inp_Wrapper" :style="{ pointerEvents: isLookinUp ? 'none' : 'initial', opacity: isLookinUp ? '.75' : '1' }">
            <div class="box icon">
                <i class="icofont-search-user"></i>
                <input 
                    :style="{ minWidth: 'unset', border: 'unset', padding: '5px 10px 5px 0px' }" 
                    name="name"
                    type="text"
                    @input="handleInput"
                >
            </div>
        </div>

        <p class="title no-query" v-if="!selected.length && !_results.length && !isLookinUp">{{ sugestionText }}</p>

        <p class="title" v-if="selected.length">Seleccionado ({{ selected.length }})</p>
        <div class="selected-results" v-if="selected.length">
            <p 
                v-for="(selected, i) in selected"
                :key="`usr-${i}`"
                :class="{ result: true, selected: true }"
                @click="handleRemoveSelected(selected)"
            >
                <i class="icofont-ui-user"></i>
                <span>{{ `${selected.nombre} ${selected.apellido}` }}</span>
                <i class="icofont-close"></i>
            </p>
        </div>

        <img v-if="isLookinUp" class="rotating" src="../assets/spinner.png" alt="loading">

        <p class="title" v-if="_results.length">Resultados ({{ _results.length }})</p>
        <div class="results" v-if="_results.length">
            <p 
                v-for="(result, i) in _results"
                :key="`usr-${i}`"
                :class="{ result: true, selected: false }"
                @click="handleSelection(result)"
            >
                <i class="icofont-ui-user"></i>
                <span>{{ `${result.nombre} ${result.apellido}` }}</span>
            </p>

        </div>

        <button :disabled="!selected.length" @click="endSelection">Terminar</button>
    </div>
</template>

<script>
    import Request from '../request/instance';

    export default {
        data() {
            return {
                isLookinUp: false,
                searchTimeout: null,
                results: [],
                selected: [],
                sugestionText: "Escriba un nombre"
            }
        },
        methods: {
            preventHide(e) {
                e.stopPropagation();
            },
            handleInput(e) {
                if (this.searchTimeout) clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => this.runSearch(e.target.value), 1000)
            },
            runSearch(val) {
                this.isLookinUp = true;
                Request.Get.NombreMiembros(null, val)
                    .then((res) => {
                        if (res.status == 200) {
                            if (res.data.length) this.results = res.data;
                            else this.sugestionText = "No hay resultados"
                        }
                    })
                    .catch(() => null)
                    .finally(() => this.isLookinUp = false);
            },
            handleSelection(r) {
                this.selected.push(r);
            },
            handleRemoveSelected(r) {
                this.selected = this.selected.filter(x => x.id != r.id);
            },
            endSelection() {
                this.$emit("selected", this.selected);
            }
        },
        computed: {
            _results() {
                let selected = this.selected.map(obj => obj.id).filter(id => id != undefined);
                let left = this.results.filter(x => !selected.includes(x.id));
                return left;
            }
        }
    }
</script>

<style scoped lang="scss">
    .search {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #ffffff;
        padding: 10px 20px;
        border-radius: 10px;
        width: 310px;
        max-height: 530px;
        overflow: hidden;
        .close {
            margin-left: auto;
            cursor: pointer;
            font-size: 18px;
        }
        .rotating {
            height: 25px;
            width: 25px;
            margin: auto;
        }
        .inp_Wrapper {
            outline: 1px solid #80808080;
            border-radius: 5px;
            padding-left: 0;
            margin-bottom: 10px;
            width: calc(100% - 10px);
        }
        .title {
            align-self: flex-start;
            cursor: default;
            user-select: none;
        }
        .no-query {
            color: #80808080;
            text-align: center;
            width: 100%;
        }
        .results, .selected-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            overflow-y: auto;

            width: calc(100% - 15px);
            max-height: 200px;

            margin-top: 10px;
            margin-bottom: 10px;
            min-height: 30px;
            margin-left: auto;
            margin-right: auto;
            .result {
                display: flex;
                align-items: center;
                margin: 4px 0;
                padding: 3px 5px;
                cursor: pointer;
                user-select: none;
                border-radius: 5px;
                border: 1px solid #c4c4c4a2;
                background-color: #e1e1e180;
                width: calc(100% - 15px);

                i:first-child {
                    margin-right: 8px;
                }
                i:last-child {
                    margin-left: auto;
                }
                span {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .selected {
                background-color: #bdffb780;
                opacity: 1;
            }
        }
        button {
            align-self: flex-end;
            padding: 4px 10px;
            margin: 0;
            margin-top: 10px;
        }
    }
</style>