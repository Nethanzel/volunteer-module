<template>
  <div class="container">
    <div id="viewer">
      <stepOne v-if="slides.pos == 1" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <stepTwo v-if="slides.pos == 2" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-three v-if="slides.pos == 3" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-four v-if="slides.pos == 4" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-five v-if="slides.pos == 5" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
    </div>
    
    <div class="controls">
        <div class="stepsView">
            <p 
                v-for="i in slides.count" 
                :key="i" 
                @click="slides.pos=i" 
                :style="{
                    color: slides.pos == i ? '#fff' : '#000',
                    fontWeight: slides.pos == i ? 'bold' : 'lighter',
                    backgroundColor: slides.pos == i ? 'red' : 'transparent',
                    fontSize: '13px',
                    border: '1px solid red',
                    height: '16px',
                    width: '18px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    padding: '2px 0 0 0'
                }">
                  {{i}}
            </p>
        </div>
        <div class="toggle">
            <p v-if="slides.pos != 1" @click="backStep">Anterior</p>
            <p v-if="slides.pos != slides.count" @click="nextStep">Siguiente</p>
        </div>
    </div>
  </div>
</template>

<script>
import stepOne from "./inscripcionComponents/stepOne.vue";
import stepTwo from "./inscripcionComponents/stepTwo.vue";
import stepThree from "./inscripcionComponents/stepThree.vue";
import stepFour from "./inscripcionComponents/stepFour.vue";
import stepFive from "./inscripcionComponents/stepFive.vue";
 
export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive
  },
  data() {
    return {
      slides: {
        count: 5,
        pos: 1
      },
      animationToggle: false,
    }
  },
  methods: {
    nextStep() {
        this.slides.pos++; 
        this.animationToggle=true;
    },
    backStep() {
        this.slides.pos--;
        this.animationToggle=false;
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

//slide animations
.animateLeft {
    position:relative;
    animation:animateleft 0.3s
}

.animateRight {
    position:relative;
    animation:animateright 0.3s
}

@keyframes animateright {
    from {
        right:-300px;
        opacity:0
    }
    to {
        right:0;
        opacity:1
    }
}

@-o-keyframes animateright {
    from {
        right:-300px;
        opacity:0
    }
    to {
        right:0;
        opacity:1
    }
}

@keyframes animateleft {
    from {
        left:-300px;
        opacity:0
    }
    to {
        left:0px;
        opacity:1
    }
}

@-o-keyframes animateleft {
    from {
        left:-300px;
        opacity:0
    }
    to {
        left:0px;
        opacity:1
    }
}//*-*//

#viewer {
    max-height: 80vh;
    min-height: 80vh;
    width: 100%;
    padding-bottom: 50px;
    overflow: hidden;
    overflow-y: auto;
    display: flex;
    justify-content: center;
}

.controls {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        margin: 10px 25px 10px 25px;
        cursor: pointer;
        user-select: none;
        display: inline-block;
    }

    .stepsView {
        display: flex;
    }

    .toggle {
        display: flex;
    }
}

</style>