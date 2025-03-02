<template>
    <div class="content">
        <div class="slides">
            <div class="images">
                <template v-for="(slide, i) in slides">
                    <img
                        v-if="slidePosition == i"
                        :class="slideAnimation"
                        :src="slide.image"
                        alt="event image"
                        :key="i"
                    >
                </template>
            </div>
            <div class="positions">
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
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                slidePosition: 0,
                slideInterval: undefined,
                slideAnimation: 'animateRight',
                slides: [
                    {
                        title: "Event Probe 1",
                        image: "https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
                    },
                    {
                        title: "Event Probe 2",
                        image: "https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png",
                    },
                    {
                        title: "Event Probe 3",
                        image: "https://cdn.pixabay.com/photo/2022/09/21/17/02/blue-background-7470781_1280.jpg",
                    },
                    {
                        title: "Event Probe 4",
                        image: "https://wallpapers.com/images/hd/pastel-green-aesthetic-desktop-gtyjhjvamfih27zr.jpg",
                    },
                    {
                        title: "Event Probe 5",
                        image: "https://static.vecteezy.com/system/resources/previews/035/714/700/non_2x/aesthetic-abstract-art-with-a-combination-of-shapes-and-blue-colors-suitable-for-background-and-poster-free-vector.jpg"
                    }
                ]
            }
        },
        methods: {
            slideChange() {
                this.slidePosition++;
                if (this.slideAnimation !== "animateRight") this.slideAnimation = "animateRight";
                if (this.slidePosition >= this.slides.length -1) this.slidePosition = 0;
            },
            goToSlide(pos) {
                clearInterval(this.slideInterval);

                if (pos < this.slidePosition) this.slideAnimation = "animateLeft"
                this.slidePosition = pos;

                this.slideInterval = setInterval(() => this.slideChange(), 5000);
            }
        },
        mounted() {
            this.slideInterval = setInterval(() => this.slideChange(), 5000);
        },
        unmounted() {
            clearInterval(this.slideInterval);
        }
    }
</script>

<style scoped lang="scss">
    .content {
        width: 100%;
        height: 100%;
        .slides {
            width: 100%;
            height: 80%;
            position: relative;
            overflow: hidden;
            .images {
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .positions {
                width: 100%;
                height: 150px;
                position: static;
                transform: translateY(-100%);
                background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 1) 90%);

                display: flex;
                justify-content: center;
                align-items: flex-end;

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
            width: calc(100% - 40px);
            height: calc(20% - 30px);
            padding: 15px 20px;
        }
    }
</style>