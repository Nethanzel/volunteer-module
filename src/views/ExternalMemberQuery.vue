<template>
    <div class="query">
        <img v-if="isLoadin" class="rotating" src="../assets/spinner.png" alt="loading">
        <ActionResult 
            v-if="!isLoadin && resultCode > 299" 
            :from="'externalMemberQuery'"
            :status="resultCode"
        />

            <div class="view" v-if="!isLoadin && memberData">
                <div class="head">
                    <img 
                        :src="bufferToBase64(memberData.Archivos[0].content.data, memberData.Archivos[0].contentType)"
                        alt="profile image"
                    >
                    <div class="info">
                        <h1>{{ `${memberData.nombre} ${memberData.apellido}` }}</h1>

                        <div class="data">
                            <p class="age"><i class="icofont-wall-clock"></i>{{ calcularEdad(memberData.nacimiento) }} años de edad</p>
                            <p class="school"><i class="icofont-star"></i>Escuela {{ memberData.escuela.nombre }}</p>
                            <p class="memberType"><i class="icofont-duotone icofont-groups"></i>Miembro {{ memberData.TipoMiembro.tipo }}</p>
                        </div>

                        <div 
                            class="level" 
                            v-if="memberData.Grado && $store.getters.isAuthorized"
                            :style="{ outline: `1px solid #${memberData.Grado.color}`, borderLeft:`5px solid #${memberData.Grado.color}` }"
                        >
                            <div class="icon">
                                <img 
                                    v-if="memberData.Grado.color != '00000000'"
                                    src="../assets/grade-rep.png" alt="level-icon" 
                                    :style="{ backgroundColor:`#${memberData.Grado.color}`, outline:`1px solid #${memberData.Grado.color}` }"
                                >
                                <i
                                    class="icofont-baby"
                                    v-else
                                >
                                </i>
                            </div>
                            <div class="cntnt">
                                <p :style="{ marginBottom:'0px' }"><span>{{ memberData.Grado.prefix }} </span>{{ memberData.Grado.grado }}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="detail">
                    <template v-if="memberData.contactoEmergencia.length">
                        <h3>Contactos de emergencia</h3>
                        <div class="detail-card" v-for="(contact, i) in memberData.contactoEmergencia" :key="`ec-${i}`">
                            <div class="icn">
                                <i class="icofont-ui-user"></i>
                            </div>
                            <div class="cnt">
                                <p>{{ contact.relation }}</p>
                                <p>{{ contact.name }}</p>
                                <p>{{ formatPhoneNumber(contact.phone) }}</p>
                            </div>
                            <div class="call">
                                <i class="icofont-duotone icofont-phone" v-if="$store.getters.isAuthorized"></i>
                            </div>
                        </div>
                    </template>

                    <h3 class="_title">Datos importantes</h3>

                    <template v-if="memberData.enfermedad">
                        <div class="info-message warn">

                            <div class="icon">
                                <i class="icofont-warning"></i>
                            </div>

                            <div class="content">
                                <p class="title">
                                    Este miembro indicó que sufre las siguientes condiciones de salud:
                                </p>

                                <p>
                                    {{ memberData.enfermedadDetalles }}
                                </p>
                            </div>

                        </div>
                    </template>
                    <p v-else class="info-place-holder">No indicó que sufre alguna condición de salud</p>

                    <template v-if="memberData.alergia">
                        <div class="info-message warn">

                            <div class="icon">
                                <i class="icofont-warning"></i>
                            </div>

                            <div class="content">
                                <p class="title">
                                    Este miembro indicó alergias a:
                                </p>

                                <p>
                                    {{ memberData.alergiaDetalles }}
                                </p>
                            </div>

                        </div>
                    </template>
                    <p v-else class="info-place-holder">No indicó alergias a medicamentos</p>

                </div>
            </div>
    </div>
</template>

<script>
    import Request from '../request/instance';
    import ActionResult from '../components/ActionResult.vue';
    import { bufferToBase64 } from '../utils/image';
    import { calcularEdad, formatPhoneNumber } from '../utils/inforFormat';

    export default {
        components: {
            ActionResult
        },
        data() {
            return {
                isLoadin: true,
                memberData: null,
                resultCode: null
            }
        },
        mounted() {
            if (!this.$route.query['member-id']) {
                this.resultCode = 400;
                this.isLoadin = false;
                return;
            }

            Request.Get.MiembroByCode(this.$route.query['member-id'])
                .then(res => {
                    this.resultCode = res.status;
                    if (res.status == 200) this.memberData = res.data;
                })
                .catch((e) => this.resultCode = e.response?.status)
                .finally(() => this.isLoadin = false)
        },
        methods: {
            bufferToBase64,
            calcularEdad,
            formatPhoneNumber
        }
    }
</script>

<style scoped lang="scss">
    .query {
        display: flex;
        flex-direction: column;
        min-height: calc(100dvh - (75px + 30px));
        padding: 15px 0;
        width: 100%;
        .rotating {
            margin: auto;
            width: 35px;
            height: 35px;
        }
        .view {
            border: 2px solid #aaaaaa5e;
            background-color: #0000000f;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;

            max-width: 450px;
            min-width: 330px;
            margin: auto;
            .head {
                display: flex;
                flex-direction: column;
                padding: 5px;
                overflow: hidden;
                p {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                h1 {
                    padding: 0;
                    margin: 0 auto 5px auto;
                }
                img {
                    max-width: 150px;
                    object-fit: cover;
                    margin: 0 auto;
                    border-radius: 50%;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    padding: 0 5px 0 5px;
                    .data {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        max-width: 330px;
                        padding: 0 0 0 0;
                        margin: 0 auto 0 auto;
                        p {
                            cursor: default;
                            font-size: 13px;
                            margin: 3px 5px;
                            padding: 5px 10px 5px 7px;
                            background-color: #939393;
                            color: #fff;

                            border-top-left-radius: 12px;
                            border-bottom-left-radius: 12px;
                            border-top-right-radius: 12px;
                            border-bottom-right-radius: 12px;

                            display: flex;
                            justify-content: center;

                            i {
                                margin: 0 5px 0 0;
                                font-size: 15px;
                            }
                        }
                    }
                }
                .level {
                    padding-left: 7px;
                    margin-top: 8px;
                    margin-left: auto;
                    margin-right: auto;
                    p {
                        font-size: 13px;
                        margin-left: 7px;
                    }
                    img {
                        width: 20px;
                        height: 20px;
                        min-width: unset;
                        min-height: unset;
                    }
                }
            }
            .detail {
                width: calc(100% - (20px));
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                p, h3 {
                    cursor: default;
                }
                .info-place-holder {
                    margin: 10px 0;
                    color: #939393;
                    &:last-child {
                        margin-top: 0px;
                    }
                }
                .info-message {
                    margin-top: 10px;
                    width: calc(100% - (50px));
                    &:last-child {
                        margin-top: 0;
                        margin-bottom: 5px;
                    }
                }
                .detail-card {
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>