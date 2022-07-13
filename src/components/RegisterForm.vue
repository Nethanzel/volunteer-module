<template>
  <div class="container">
    <div id="viewer">
      <stepOne @validation="catchResult($event)" v-if="slides.pos == 1" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <stepTwo @validation="catchResult($event)" v-if="slides.pos == 2" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-three @validation="catchResult($event)" v-if="slides.pos == 3" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-four @validation="catchResult($event)" v-if="slides.pos == 4" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-five @validation="catchResult($event)" @send="finishCollection" v-if="slides.pos == 5" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
    </div>
    
    <div class="controls">
        <div class="stepsView">
            <p 
                v-for="i in slides.count" 
                :key="i" 
                :style="{
                    color: i != slides.pos ? (i < slides.pos ? 'white' : 'gray') : 'black',
                    fontWeight: slides.pos == i ? 'bold' : 'lighter',
                    backgroundColor: i != slides.pos ? (i < slides.pos ? '#008000a8' : 'transparent') : 'transparent',
                    fontSize: '13px',
                    border: i != slides.pos ? (i < slides.pos ? 'none' : '1px solid gray') : '1px solid red',
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
            <p v-if="slides.pos != 1" @click="backStep(null)">Anterior</p>
            <p v-if="slides.pos != slides.count && letMego" @click="nextStep(null)"
              :style="{

              }"
            >Siguiente</p>
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
 
 import Request from "../request/instance.js";

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
      letMego: false,
      animationToggle: false,
      validationStatus: false,
      validating: false,
      data: {}
    }
  },
  methods: {
    nextStep(pos) {
      if(!pos) {
        this.validating = true;
        if(this.validationStatus) {
          return setTimeout(() => {
            this.animationToggle = true;
            this.validating = false;
            this.validationStatus = false;
            this.slides.pos++;
          }, 1000);
        }
        this.$formulate.submit(`step_${this.slides.pos}`);
        this.validating = false;
      } else {
        this.animationToggle=true;
        this.slides.pos = pos;
      }
    },
    backStep(pos) {
      if(!pos) {
        this.validationStatus = false;
        delete this.data[`step_${pos}`];
        this.letMego = false;

        this.animationToggle=false;
        this.slides.pos--;  
      } else {
        delete this.data[`step_${pos}`];
        this.letMego = false;
        this.validationStatus = false;

        this.animationToggle=false;
        this.slides.pos--;  
      }
    },
    catchResult(e) {
      if(e) {
        this.data[`step_${e.pos}`] = e.result;
        this.validationStatus = true;
        this.letMego = true;
      } else {
        delete this.data[`step_${e.pos}`];
        this.letMego = false;
        this.validationStatus = false;
      }
    },
    async finishCollection() {
      if(Object.keys(this.data).length == 5) {
        let response = await Request.Post.newVolunteer(this.data).catch(e => e.response);
        this.$router.push({ name: 'Resultado', params: { status: response.status, from: "registro" } });
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
      margin-top: 15px;

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