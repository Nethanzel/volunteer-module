<template>
    <div class="lastest-practice dash-card">
        <h4><i class="icofont-tasks"></i> Últimas prácticas:</h4>

        <img class="rotating" src="../../assets/spinner.png" alt="loading" v-if="isLoading">

        <template v-else>
            <div class="content">
                <p class="no-content" v-if="!practices.length">No hay prácticas</p>
                
                <LitePraticeRow v-else
                    :data="practices"
                    :week="daysOfWeek"
                    @show="handleShowDetails"
                />

            </div>
        </template>

        <transition name="circle-blur">
            <div class="blury-cnt" @click="showBlur = false" v-if="showBlur">
                <PracticeManager
                    @hide="showBlur = false"
                    :title="'Detalles de la práctica'"
                    :record="selectedRow"
                    :members="nombres"
                />
            </div>
        </transition>

    </div>
</template>

<script>
    import Request from "../../request/instance";
    import LitePraticeRow from "./LitePraticeRow.vue";
    import PracticeManager from "../PracticeManager.vue";
    
    export default {
        components: {
            LitePraticeRow,
            PracticeManager
        },
        data() {
            return {
                isLoading: true,
                practices: [],
                daysOfWeek: {},
                selectedRow: null,
                showBlur: false,
                nombres: []
            }
        },
        async mounted() {
            this.getLastPractices();

            let requests = [ Request.Get.diasDeLaSemana() ];
            let [semana] = await Promise.all(requests).catch(() => null);

            if (semana?.status == 200) this.daysOfWeek = semana.data;
        },
        methods: {
            getLastPractices() {
                Request.Get.Practices(null, null)
                .then(res => this.practices = res.data.rows)
                .catch(() => null)
                .finally(() => this.isLoading = false)
            },
            handleShowDetails(e) {
                if (e.schedule) e.schedule.dayOfWeekText = this.daysOfWeek[e.schedule.dayOfWeek];
                this.selectedRow = e;
                this.showBlur = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lastest-practice {
        width: 100%;
        h4 {
            margin-bottom: 10px;
            cursor: default;
            display: flex;
            align-items: center;
            i {
                font-size: 24px;
                margin-right: 7px;
            }
        }

        .no-content {
            color: #c3c3c3;
            font-size: 13px;
        }

        .rotating {
            height: 20px;
            width: 20px;
            margin: auto;
        }

        .content {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
            align-content: flex-start;
            height: 100%;
        }
    }
</style>