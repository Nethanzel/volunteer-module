<template>
    <div class="content" v-if="slides.length">
        <img v-if="loadin" class="rotating" src="../assets/spinner.png" alt="loading">

        <div class="slides" v-if="!loadin">
            <div class="images">
                <img v-if="imgLoading" class="rotating" src="../assets/spinner.png" alt="loading">

                <template v-for="(slide, i) in slides.length">                    
                    <img
                        v-if="slidePosition == i"
                        :class="slideAnimation"
                        :src="slides[i].image"
                        alt="event image"
                        :key="i"
                        @load="imgLoading = false"
                    >
                </template>
            </div>
            
        </div>
        <div class="detail" v-if="!loadin">
            <div class="positions">
                <div class="points">
                    <p
                        v-for="pos in slides.length"
                        :class="{selected: slidePosition == pos-1}"
                        :key="pos"
                        @click="goToSlide(pos -1)"
                    >
                    </p>
                </div>
            </div>

            <div class="eventDetail">
                <h2>{{ slides[slidePosition].title }}</h2>
                <p>{{ slides[slidePosition].comment }}</p>
            </div>
        </div>

    </div>
</template>

<script>
    import axiosRequest from '../request/instance';
    export default {
        data() {
            return {
                slidePosition: 0,
                slideInterval: undefined,
                slideAnimation: 'animateRight',
                slides: [],
                loadin: true,
                imgLoading: true
            }
        },
        methods: {
            slideChange() {
                this.imgLoading = true;
                this.slidePosition++;
                if (this.slideAnimation !== "animateRight") this.slideAnimation = "animateRight";
                if (this.slidePosition >= this.slides.length) this.slidePosition = 0;
            },
            goToSlide(pos) {
                this.imgLoading = true;

                clearInterval(this.slideInterval);

                if (pos < this.slidePosition) this.slideAnimation = "animateLeft"
                this.slidePosition = pos;

                this.slideInterval = setInterval(() => this.slideChange(), 10000);
            },
            getHighlights() {
                axiosRequest.Get.openHighlights()
                .then(res => {
                    if (res.status == 200) {
                        this.slides = res.data;
                        if (this.slides.length > 1) this.slideInterval = setInterval(() => this.slideChange(), 5000);
                    }
                })
                .catch(() => null)
                .finally(() => this.loadin = false)
            }
        },
        mounted() {
            this.getHighlights()
        },
        destroyed() {
            clearInterval(this.slideInterval);
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
        justify-content: flex-end;
        position: relative;

        .rotating {
            margin: auto;
            width: 35px;
            height: 35px;
        }

        .slides {
            width: 100%;
            height: 100%;
            position: relative;
            .images {
                width: 100%;
                height: 100%;
                display: flex;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .rotating {
                    margin: auto;
                    width: 35px;
                    height: 35px;
                    position: absolute;
                }
            }
        }
        .detail {
            width: 100%;
            margin-top: auto;
            overflow: hidden;
            position: absolute;
            background: linear-gradient(to bottom, transparent 0%, #ffffff80 30%, #ffffffe6 60%, #ffffff 100%);

            .positions {
                width: 100%;
                height: 15vh;
                position: static;

                display: flex;
                align-items: flex-end;
                margin-bottom: px;

                .points {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;

                    p {
                        background-color: #000;
                        border-radius: 50%;
                        cursor: pointer;
                        transition: .3s;
                        margin: 10px;
                        height: 15px;
                        width: 15px;
                        opacity: .3;
                    }
                    .selected {
                        opacity: 1;
                        height: 20px;
                        width: 20px;
                    }
                }
            }
            .eventDetail {
                display: flex;
                flex-direction: column;
                width: calc(100% - 20px);
                height: calc(20% - 30px);
                padding: 15px 10px;
                h2 {
                    margin-bottom: 5px;
                    margin-left: 10px;
                    text-align: left;
                }
                p {
                    max-width: 680px;
                    padding: 5px 15px;

                    cursor: default;
                    text-overflow: ellipsis;
                    white-space: wrap;
                    overflow: hidden;
                    
                }
            }
        }
    }

    @media only screen and (max-width: 550px) {
        .content {
            .detail {
                .eventDetail {
                    p {
                        font-size: 15px;
                    }
                }
                .positions {
                    .points {
                        p {
                            height: 12px;
                            width: 12px;
                        }
                        .selected {
                            height: 15px;
                            width: 15px;
                        }
                    }
                }
            }
        }
    }
</style>