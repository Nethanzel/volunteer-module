<template>
    <div class="content">
        <h2>Escuelas y horarios de práctica</h2>
        <img v-if="loading" class="rotating" src="../assets/spinner.png" alt="loading">
        <div class="_schools">
            <div class="item" v-for="(escuela, i) in _schools" :key="`_sch-${i}`">
                <div class="head">
                    <img src="../assets/logo.png" alt="logo">
                    <div class="title">
                        <h4>{{ escuela.nombre }}</h4>
                        <p class="place">
                            <i class="icofont-location-pin"></i>
                            {{ titleCase(municipios.find(x => x.municipio_id == escuela.municipio).municipio) }} ({{ provincias.find(x => x.provincia_id == escuela.provincia).provincia }})
                        </p>
                    </div>
                </div>
                <div class="detail">
                    <h5>
                        <span v-if="escuela.schedule.length"><i class="icofont-tasks-alt"></i>Horarios</span>
                        <router-link :to="{ name: 'Registrar', params: { selectedSchool: escuela.id } }">
                            <span>Inscribirme</span>
                            <i class="icofont-arrow-right"></i>
                        </router-link>
                    </h5>

                    <h4 v-if="!escuela.schedule.length">No hay horarios</h4>

                    <div class="schedule" v-for="(schedule, x) in escuela.schedule" :key="`schule-${x}`">
                        <i class="icofont-wall-clock"></i>
                        <div>
                            <span><b>{{ diasDeLaSemana[schedule.dayOfWeek] }}</b>, de {{ schedule.startHour }} a {{ schedule.endHour }}</span>
                            <span>con el profesor {{ `${schedule.profesor.nombre} ${schedule.profesor.apellido}` }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Request from '../request/instance';
    import municipios from '../assets/data/municipios.json';
    import provincias from '../assets/data/provincias.json';
    import { titleCase } from '../utils/inforFormat';

    export default {
        data() {
            return {
                schools: [],
                diasDeLaSemana: {},
                loading: true,
                provincias,
                municipios
            }
        },
        methods: {
            titleCase,
            async Init() {
                let requests = [Request.Get.Escuelas(null, false, true), Request.Get.diasDeLaSemana()];
                let [esculeas, diasDeLaSemana] = await Promise.all(requests).catch(() => null).finally(() => this.loading = false);

                if (esculeas?.status == 200) this.schools = esculeas.data;
                if (diasDeLaSemana?.status == 200) this.diasDeLaSemana = diasDeLaSemana.data;
            }
        },
        mounted() {
            this.Init()
        },
        computed: {
            _schools() {
                return this.schools.rows?.filter(x => !x.deleted)
            }
        }
    }
</script>

<style scoped lang="scss">
    .content {
        width: 100%;
        height: 100%;
        max-height: 100dvh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 10px;
        }
        .rotating {
            margin: auto;
            width: 35px;
            height: 35px;
        }
        ._schools {
            display: flex;
            flex-wrap: wrap;
            overflow-y: auto;
            justify-content: center;
            .item {
                margin: 10px;
                width: 100%;
                overflow: hidden;
                min-height: 181px;
                padding: 7px 5px 5px 5px;
                max-width: calc(350px - (30px));
                background-color: #ffffffab;
                outline: 1px solid #48484870;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-left: 5px solid #484848;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                cursor: default;
                .head {
                    display: flex;
                    padding-bottom: 8px;
                    img {
                        height: 40px;
                        width: 40px;
                        margin-right: 10px;
                    }
                    .title {
                        width: calc(100% - (40px + 8px));
                        p {
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .place {
                            font-size: 15px;
                        }
                    }
                }
                .detail {
                    height: 100%;
                    overflow: hidden;
                    padding-bottom: 5px;

                    display: flex;
                    flex-direction: column;
                    p {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    h4 {
                        margin: auto;
                        text-align: center;
                        color: #a1a1a187;
                    }
                    h5 {
                        margin-left: 10px;
                        margin-right: 8px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        i {
                            font-size: 19px;
                            margin-right: 5px;
                        }
                        a {
                            font-size: 13px;
                            margin-top: 2px;
                            margin-left: auto;
                            font-weight: lighter;
                            text-decoration: none;
                            padding: 2px 3px 2px 8px;
                            background-color: #ffffff;
                            outline: 2px solid #ff7300;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            i {
                                font-size: 16px;
                                margin-right: 0;
                                margin-top: 2px;
                                margin-left: 5px;
                            }
                        }
                    }
                    .schedule {
                        font-size: 14px;
                        margin-left: 8px;
                        margin-right: 8px;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: flex-start;
                        padding: 5px 5px;
                        border-radius: 5px;
                        background: #ffffff;
                        color: #000000;
                        outline: 1px solid #3e3e3e86;
                        i {
                            /* margin-top: 3px;
                            margin-right: 8px; */
                            margin: auto 8px auto 0;
                            font-size: 25px;
                        }
                        &:last-child {
                            margin-bottom: 0px;
                        }
                        span {
                            display: block;
                        }
                    }
                }
                /* .inscription {
                    padding: 3px 5px 3px 0px;
                    text-align: end;
                    a {
                        text-decoration: none;
                    }
                } */
            }
        }
    }
</style>