<template>
  <div class="container">
    <div id="viewer">
      <stepOne @validation="catchResult($event)" v-if="slides.pos == 1" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <stepTwo @validation="catchResult($event)" v-if="slides.pos == 2" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-three @validation="catchResult($event)" v-if="slides.pos == 3" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-four @validation="catchResult($event)" v-if="slides.pos == 4" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
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
        <div class="toggle" v-if="!validating">
            <p v-if="slides.pos != 1" @click="backStep">Anterior</p>
            <p v-if="slides.pos != slides.count" @click="nextStep">Siguiente</p>
        </div>
        <img src="../assets/spinner.png" class="spinner rotating" v-else>
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
        pos: 4
      },
      animationToggle: false,
      validationStatus: false,
      validating: false,
      data: {}
    }
  },
  methods: {
    nextStep() {
      this.validating = true;

      if(this.validationStatus) {
        return setTimeout(() => {
          this.animationToggle=true;
          this.validating = false;
          this.slides.pos++;
          this.validationStatus = false;
        }, 1000);
      }
      this.$formulate.submit(`step_${this.slides.pos}`);
      this.validating = false;
    },
    backStep() {
      this.validationStatus = false;
      this.animationToggle=false;
      this.slides.pos--;
    },
    catchResult(e) {
      console.log(e);
      if(e) {
        if(!this.data[`step_${e.pos}`]) {
          this.data[`step_${e.pos}`] = e.result;
          this.validationStatus = true;
        }
      }
    }
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

.spinner {
    height: 35px;
    width: 35px;
}

//*CSS para girar infinito*//
@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating .5s linear infinite;
  -moz-animation: rotating .5s linear infinite;
  -ms-animation: rotating .5s linear infinite;
  -o-animation: rotating .5s linear infinite;
  animation: rotating .5s linear infinite;
}
//** Fin girar infinito **/

</style>