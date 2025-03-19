<template>
    <div class="stepcontainer">

        <FormulateForm 
            class="stepzero"
            v-model="formResult"
            invalid-message="Completa la informacion requerida"
        >
            <div class="min-container">
                <p>Seleccione la opción que mejor corresponda:</p>

                <p
                    v-if="required"
                    :style="{ color: '#ff3300', marginTop: '0px', fontSize: '13px', fontWeight:'bold',
                        marginLeft: '20px', fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
                    }"
                >Esta información es necesaria</p>

                <div type="group" class="custom-radio" :style="{marginTop: '10px'}">
                    
                    <div 
                        class="option"
                        :style="{}"
                        @click="selectOption($event, 'rt-1', 'memberCategory', 1)"
                    >
                        <input :value="1" :id="'rt-1'" type="radio" name="memberCategory" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>Soy nuevo miembro, llevo poco tiempo prácticando</label> 
                    </div>

                    <div 
                        class="option"
                        :style="{}"
                        @click="selectOption($event, 'rt-2', 'memberCategory', 2)"
                    >
                        <input :value="2" :id="'rt-2'" type="radio" name="memberCategory" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>Tengo cierto tiempo prácticando, pero aun soy grado menor o avanzado (Principiante, Verde, Azul)</label> 
                    </div>

                    <div 
                        class="option"
                        :style="{}"
                        @click="selectOption($event, 'rt-3', 'memberCategory', 3)"
                    >
                        <input :value="3" :id="'rt-3'" type="radio" name="memberCategory" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label>He sido o soy miembro desde hace tiempo y ya soy Sifu (grados Morado en adelante)</label> 
                    </div>

                </div>
            </div>

            <button @click="validateForm">Siguiente <i class="icofont-arrow-right"></i></button>
        </FormulateForm>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formResult: {},
                required: false
            }
        },
        methods: {
            highlightSelected(element, child) {
                const siblings = element.parentElement.getElementsByTagName("div");
                for (let e of siblings) {
                    if (e.children[child]) e.children[child].checked = !e.children[child].checked;
                    e.style.backgroundColor = '#fff';
                    e.style.opacity = '.3';
                }
                element.style.backgroundColor = '#f7fffa';
                element.style.opacity = '1';
            },
            selectOption(e, i, name, value) {
                e.stopPropagation();
                this.formResult[name] = value;
                this.highlightSelected(e.target, i);
            },
            validateForm() {
                if (!this.formResult.memberCategory) {
                    this.$throwAppMessage({ 
                        message: "Debe seleccionar una opción!",
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    this.required = true;
                    return;
                }

                this.$emit("category", this.formResult.memberCategory);
            }
        }
    }
</script>

<style scoped lang="scss">
    .stepzero {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
</style>