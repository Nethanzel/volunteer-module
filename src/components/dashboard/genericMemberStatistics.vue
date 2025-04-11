<template>
    <div class="member-statistics dash-card">
        <h4><i class="icofont-users-social"></i> Estado del registro de miembros:</h4>

        <img class="rotating" src="../../assets/spinner.png" alt="loading" v-if="isLoading">

        <div class="content" v-else>
            <p class="active"><b><i class="icofont-thumbs-up"></i> Activo: {{ data.active }}</b></p>
            <p class="inactive"><b><i class="icofont-thumbs-down"></i> Inactivo: {{ data.inactive }}</b></p>
            <p class="nocheck" v-if="_allowViewNonConfirmedMembersPermission" ><b><i class="icofont-not-allowed"></i> Sin confirmar: {{ data.nonConfirmed }}</b></p>
            <p class="total"><b><i class="icofont-check-circled"></i> Total: {{ data.total }}</b></p>
        </div>
    </div>
</template>

<script>
    import Request from '../../request/instance';
    export default {
        data() {
            return {
                isLoading: true,
                data: {}
            }
        },
        mounted() {
            Request.Get.MemberResume()
            .then(res => this.data = res.data)
            .catch(() => null)
            .finally(() => this.isLoading = false)
        },
        computed: {
            _allowViewNonConfirmedMembersPermission() {
                return this.$store.getters.isAllowedToPermission(['VNC'])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .member-statistics {
        width: 100%;

        h4 {
            margin-bottom: 10px;
            cursor: default;
            display: flex;
            align-items: center;
            i {
                font-size: 22px;
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
            p {
                font-size: 13.5px;
                border: 1px solid #c3c3c385;
                border-radius: 5px;
                padding: 5px 8px 5px 5px;
                margin: 5px 8px;
                cursor: default;

                b {
                    i {
                        font-size: 18px;
                        margin-right: 4px;
                    }
                }
            }

            .nocheck {
                background-color: #ffb30059;
            }
            .active {
                background-color: #00ff5e42;
            }
            .inactive {
                background-color: #c8c8c859;
            }
            .total {
                background-color: #00bbff42;
            }
        }
    }
</style>