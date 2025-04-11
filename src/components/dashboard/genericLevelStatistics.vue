<template>
    <div class="level-statistics dash-card">
        <h4><i class="icofont-duotone icofont-groups"></i> Cantidad de miembros por grado:</h4>

        <img class="rotating" src="../../assets/spinner.png" alt="loading" v-if="isLoading">

        <template v-else>
            <div class="content">
                <div 
                    class="level"
                    v-for="(grado, i) of levels"
                    :style="{ outline: `1px solid #${grado.color}`, borderLeft:`5px solid #${grado.color}` }"
                    :key="`lvl-${i}`"
                >
                    <div class="icon">
                        <img 
                            v-if="grado.color != '00000000'"
                            src="../../assets/grade-rep.png" alt="level-icon" 
                            :style="{ backgroundColor:`#${grado.color}`, outline:`1px solid #${grado.color}` }"
                        >
                        <i
                            class="icofont-baby"
                            v-else
                        >
                        </i>
                    </div>
                    <div class="cntnt">
                        <p :style="{ marginBottom:'0px' }">{{grado.grado}}: {{ getLevelCount(grado.id) }}</p>
                    </div>
                </div>
            </div>
        </template>

    </div>
</template>

<script>
    import Request from "../../request/instance";
    export default {
        data() {
            return {
                isLoading: true,
                levels: [],
                resume: []
            }
        },
        async mounted() {
            let requests = [ Request.Get.Grados(), Request.Get.LevelResume() ];
            let [grados, resume] = await Promise.all(requests).catch(() => null).finally(() => this.isLoading = false);

            if (grados?.status == 200) this.levels = grados.data.rows;
            if (resume?.status == 200) this.resume = resume.data;
        },
        methods: {
            getLevelCount(id) {
                return this.resume.find(x => x.GradoId == id)?.memberCount ?? 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .level-statistics {
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
            .level {
                margin: unset;
                padding: 6px 8px 6px 5px;
                margin: 6px;
                .icon {
                    max-width: 20px;
                    margin-right: 8px;
                    img {
                        min-width: unset;
                        min-height: unset;
                        height: 18px;
                        width: 18px;
                    }
                    i {
                        font-size: 21px;
                    }
                }
                .cntnt {
                    p {
                        font-size: 12.5px;
                    }
                }
            }
        }
    }
</style>