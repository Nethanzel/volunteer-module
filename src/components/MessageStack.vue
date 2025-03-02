<template>
    <transition-group id="message-stack" name="fade" tag="div">
        <div
            v-for="(message, i) in messageStackReversed" 
            :class="['message', message.type]"
            :key="`message-${i}`"
        >
            <p><i :class="message.icon"></i> {{ message.message }}</p>
        </div>
    </transition-group>
</template>

<script>
    import Vue from 'vue';

    export default {
        data() {
            return {
                messageStack: []
            }
        },
        mounted() {
            Vue.prototype.$throwAppMessage = this.AddMessage.bind(this);
        },
        methods: {
            AddMessage(confg) {
                confg.id = Date.now();
                this.messageStack.push(confg);
                setTimeout(() => this.RemoveMessage(confg.id), 8000);
            },
            RemoveMessage(id) {
                let index = this.messageStack.findIndex(m => m.id == id);               
                if (index > -1) {
                    this.messageStack.splice(index, 1);
                }
            }
        },
        computed: {
            messageStackReversed() {
                return this.messageStack.slice();
            }
        }
    }
</script>

<style lang="scss" scoped>
#message-stack {
    top: 100px;
    right: 20px;
    width: 300px;
    z-index: 1000;
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    .message {
        background-color: #e2e2e2;
        padding: 10px 5px;
        margin: 8px 0;
        border-radius: 5px;
        border: 1px solid #00000029;
        border-left: 7px solid #646464;
        user-select: none;
        p {
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: bold;
            white-space: pre-line;
            i {
                font-size: 26px;
                margin-right: 15px;
                margin-left: 5px;
            }
        }
    }

    .error {
        background-color: #ffdcdc;
        border: 1px solid #ff000029;
        border-left: 7px solid #ff0000;
    }

    .warn {
        background-color: #ffeedc;
        border: 1px solid #ff840029;
        border-left: 7px solid #ff8c00;
    }

    .ok {
        background-color: #e1fedb;
        border: 1px solid #15b70029;
        border-left: 7px solid #0ced00;
    }
}

/* Animación */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter {
  opacity: 0;
  transform: translateX(100%);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(200%);
}
</style>