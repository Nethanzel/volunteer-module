<template>
  <div class="login">

    <form class="promptContainer" @submit="runAuthenticate($event)" v-if="!$store.getters.isValidatingAccess">

      <div class="logo">
        <img src="../assets/logo.png" alt="logo">
        <p>Verificación de acceso:</p>
      </div>

      <div class="inp_Wrapper" :style="{ pointerEvents: isAuthenticatin ? 'none' : 'initial', opacity: isAuthenticatin ? '.75' : '1' }">
        <p>Cédula (sin guíones):</p>
        <div class="box icon">
            <i class="icofont-ui-user"></i>
            <input :style="{ minWidth: 'unset', border: 'unset', padding: '5px 10px 5px 0px' }" name="username" type="text" autocomplete="username" ref="unInput" v-model="inp_Name">
        </div>
      </div>

      <div class="inp_Wrapper" :style="{ pointerEvents: isAuthenticatin ? 'none' : 'initial', opacity: isAuthenticatin ? '.75' : '1' }">
        <p>Contraseña:</p>
        <div class="box icon" >
          <i class="icofont-key"></i>
          <input name="password" type="password" autocomplete="current-password" v-model="inp_Password">
        </div>
      </div>

      <div class="actionWrapper" :style="{ height: '40px' }">
        <button v-if="!isAuthenticatin" :disabled="!btn_Enabled"><i class="icofont-arrow-right"></i> Entrar!</button>
        <p v-if="isAuthenticatin" :style="{ fontSize: '19px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'0 auto', cursor: 'default' }">
          <i class="icofont-spinner-alt-6 rotating" :style="{ fontSize: '25px', marginRight: '8px', userSelect: 'none' }"></i>
          Autenticando...
        </p>
      </div>

      <div class="options" :style="{justifyContent:'right', padding:'20px 0 5px 0'}">
        <p class="option" @click="() => false"><i class="icofont-key"></i> Olvidé mi contraseña</p>
      </div>
    </form>

    <img v-else class="rotating await" src="../assets/spinner.png" alt="loadin">
  </div>
</template>
  
<script>
  import axiosRequest from '../request/instance';

  export default {
    components: {
    },
    data() {
      return {
        isAuthenticatin: false,
        inp_Name: "",
        inp_Password: "",
      }
    },
    computed: {
      btn_Enabled(instance) {
        return instance.inp_Name.trim().length > 4 && instance.inp_Password.length > 5;
      },
      isAuthorized() {
        return this.$store.getters.isAuthorized;
      }
    },
    methods: {
      runAuthenticate(e) {
        this.isAuthenticatin = true;
        e?.preventDefault();
        axiosRequest.Post.login({ user: this.inp_Name, password: this.inp_Password })
        .then(res => this.$store.commit("startSession", res.data))
        .catch(() => null)
        .finally(() => {
          this.isAuthenticatin = false;
        });
      },
      runAuthenticateByKeyPress(keyEvent) {
        if (keyEvent.keyCode == 13) {
          if (this.btn_Enabled) this.runAuthenticate();
        }
      }
    },
    mounted() {
      if (this.isAuthorized) return this.$router.push({ name: "Opciones" });
      window.addEventListener('keypress', this.runAuthenticateByKeyPress);
    },
    unmounted() {
      window.removeEventListener('keypress', this.runAuthenticateByKeyPress);
    },
    watch: {
      isAuthorized(n) {
        if (n) this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 75px);
  width: 100%;
  overflow: auto;
  h2 {
    margin: auto 0 0 0;
  }

  .promptContainer {
    max-width: 310px;
    height: auto;
    border-radius: 5px;
    padding: 5px 15px;
    align-self: flex-start;
    margin: auto;

    text-align: center;

    p {
      cursor: default;
    }

    .inp_Wrapper {
      margin: 15px;
      .box {
        padding: 0 0 0 5px;
        i {
          margin-right: 10px;
        }
        
        input {
          height: 28px;
        }
      }
    }

    .actionWrapper {
      button {
        margin: 0 auto;
        font-size: 17px;
        i {
          font-size: 25px;
        }
      }
    }

    .options {
      text-align: end;
      .option {
        cursor: pointer;
      }
    }

    .logo {
      margin: 5px 0 20px 0;

      img {
        height: 125px;
      }
      h1 {
        user-select: none;
        font-size: 35px;
        span {
          color: rgb(0, 228, 30);
        }
      }
      p {
        font-size: 17px;
        font-weight: bold;
      }
    }
  }

  .await {
    width: 50px;
    height: 50px;
  }

  @media (prefers-color-scheme: dark) {
    .promptContainer {
      background-color: #000;
      color: #fff;
    }
  }
  @media (prefers-color-scheme: light) {
    .promptContainer {
      background-color: #0000000f;
      outline: 2px solid #00000028;
    }
  }

}
</style>
  