<template>
  <div class="container">
    <img src="../assets/text-logo.png" alt="logo">
    <h1>Formulario de inscripción</h1>
    <div id="viewer" ref="viewer" v-if="!resultCode">
      <stepOne @validation="catchResult($event)" v-if="slides.pos == 1" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <stepTwo @validation="catchResult($event)" v-if="slides.pos == 2" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-three @validation="catchResult($event)" v-if="slides.pos == 3" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-four @validation="catchResult($event)" v-if="slides.pos == 4" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-five @validation="catchResult($event)" v-if="slides.pos == 5" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
      <step-six @accepted="catchResult($event)" v-if="slides.pos == 6" :class="{animateRight : animationToggle, animateLeft : !animationToggle}" />
    
      <div v-if="slides.pos == 7" class="await">
        <img src="../assets/spinner.png" class="rotating">
        <h2>Guardando registro...</h2>
      </div>
    </div>

    <div class="steps" v-if="!resultCode">
        <img v-if="validating" src="../assets/spinner.png" class="_spinner rotating">
        <div v-else class="stepsView">
          <p 
            v-for="i in slides.count" 
            :key="i" 
            :style="{
              color: i != slides.pos ? (i < slides.pos ? 'white' : 'gray') : 'black',
              border: i != slides.pos ? (i < slides.pos ? 'none' : '1px solid gray') : '2px solid red',
              backgroundColor: i != slides.pos ? (i < slides.pos ? '#008000a8' : 'transparent') : 'transparent',
            }">
            <span>{{i}}</span>
          </p>
        </div>
    </div>

    <ActionResult v-if="resultCode != null" :status="resultCode" :from="'registro'" :userCode="resultUserCode" @return="handleResultBack" @retry="finishCollection" />

  </div>
</template>

<script>
import stepOne from "./inscripcionComponents/stepOne.vue";
import stepTwo from "./inscripcionComponents/stepTwo.vue";
import stepThree from "./inscripcionComponents/stepThree.vue";
import stepFour from "./inscripcionComponents/stepFour.vue";
import stepFive from "./inscripcionComponents/stepFive.vue";
import stepSix from "./inscripcionComponents/stepSix.vue";
import ActionResult from "../components/ActionResult.vue";
import Request from "../request/instance.js";

export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive,
    stepSix,
    ActionResult
  },
  data() {
    return {
      slides: {
        count: 5,
        pos: 1
      },
      data: {},
      letMego: false,
      resultCode: null,
      resultUserCode: null,
      validating: false,
      animationToggle: false
    }
  },
  methods: {
    nextStep(pos) {
        if(!pos) {
            this.validating = false;
            this.animationToggle = true;
            this.slides.pos++;
            if (this.slides.pos > 6) setTimeout(() => this.finishCollection(), 500);
            this.$refs.viewer.scrollTo(0, 0);
        }
        else {
            this.animationToggle = true;
            this.slides.pos = pos;
        }
    },
    catchResult(e) {
        if (e.pos > 5) {
            this.nextStep();
            return;
        }

        this.data[`step_${e.pos}`] = e.result;
        this.validationStatus = true;
        this.letMego = true;
        this.nextStep();
    },
    async finishCollection() {
        this.resultCode = null;
        if(Object.keys(this.data).length >= 0) {
            await Request.Post.newMember(this.data)
                .then(res => {
                  if (res.status == 201) this.resultUserCode = res.data?.userCode ?? null;
                  this.resultCode = res.status;
                })
                .catch(e => this.resultCode = e.response?.status > 0 ? e.response?.status : 503)
                .finally(() => this.validating = false);
        }
        else {
            this.$throwAppMessage({ 
                message: "Informacion incompleta",
                icon: "icofont-close-circled",
                type: 'error',
            });
            //this.slides.pos = 1;
        }
    },
    handleResultBack() {
        this.resultCode = null;
        this.slides.pos = 1;
    }
  }
}
</script>

<style lang="scss">
.container {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: calc(100vh - (90px));
    padding-bottom: 15px;
    img {
        max-width: 300px;
    }
    h1,h2 {
        margin: 0;
        margin-bottom: 10px;
        text-align: center;
        cursor: default;
    }
}

#viewer {
  width: 100%;
  min-height: calc(100% - 220px);
  overflow: hidden;
  overflow-y: auto;
  border-top: 1px solid #00000029;
  border-bottom: 1px solid #00000029;
}

.stepcontainer {
  padding-top: 15px;
  padding-bottom: 15px;
  overflow: hidden;
}

.stepsix, .stepfive, .stepfour, .stepthree, .steptwo, .stepone {
    border: 2px solid #aaaaaa5e;
    padding: 15px 0px 15px 0px;

    background-color: #0000000f;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

    max-width: 600px;
    min-width: 320px;
    margin: 0 auto;

    width: 100%;

    button {
        width: auto;
        font-weight: bold;
        margin: 10px 35px 0 auto;
        padding: 7px 15px 10px 15px;

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        display: flex;
        align-items: center;

        i {
            font-size: 20px;
            margin-left: 5px;
        }
    }
    ._spinner {
        height: 25px;
        width: 25px;
    }

    h2 {
        font-size: 21px;
    }
}

.min-container {
  margin: 20px auto;
  padding: 10px 5px 10px 15px;
  border-left: rgb(75, 226, 0) 5px solid;
  min-width: calc(100% - 100px);
  width: calc(100% - (30px + 70px));
  h2 {
    margin-top: 0;
    cursor: default;
  }
  p {
    cursor: default;
  }
  button {
    display: flex;
    align-items: center;
    font-weight: bold;
    margin: 10px 0 0 auto;
    padding: 5px 15px;

    i {
        margin: 0;
        margin-right: 5px;
    }
  }
}

.inputBreak {
  .formulate-input {
    margin: 5px 0;
  }
}

.rowData {
  border: 1px solid #0000003a;
  border-left: 4px solid #000000;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #ffffff;
  padding: 5px 10px;
  margin: 10px 0;
  transition: .4s;
  cursor: pointer;
  display: flex;
  
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    margin-right: 10px;

    i {
      font-size: 30px;
    }
  }

  p {
    margin: 4px;
  }
}

.rowData:hover {
  background: #ffd5d5;
}

.await {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .rotating {
        height: 25px;
        width: 25px;
    }
    h2 {
        margin: 0;
        margin-left: 10px;
    }
}

._spinner {
  margin: 15px auto 0 auto;
  height: 40px;
  width: 40px;
}

@media only screen and (max-width: 900px) {
    .stepcontainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .stepsix, .stepfive, .stepfour, .stepthree, .steptwo, .stepone {
        width: calc(100% - 10px);
    }

    .formulate-input-wrapper {
        padding-right: 15px;
    }
}

@media only screen and (max-width: 600px) {
    .min-container {
        margin: 10px 0px 10px 15px;
        padding: 10px 5px 15px 10px;
        width: calc(100% - (20px));
        button {
            margin-right: 15px;
        }
    }
}

@media only screen and (max-width: 400px) {
    .container {
        h1 {
            font-size: 26.5px;
        }
    }

    .min-container {
        margin: 10px 0px 10px 10px;
        padding: 10px 5px 15px 10px;
        width: calc(100% - (20px));
    }
}

</style>