<template>
   <div class="stepcontainer">
        <h2>Una última cosa...</h2>
        <FormulateForm 
            class="stepfive"
        >
            <div class="min-container">
                <h3>Agrega una foto (opcional)</h3>

                <img v-if="imageLoaded" :src="imageData" alt="record image">
                <p v-else><i class="icofont-duotone icofont-user"></i></p>
                <input ref="inputImage" @change="handleFileSelection" :style="{ display: 'none' }" type="file" accept=".jpg, .jpeg, .png, .gif, .bmp">
                
                <div :style="{ display:'flex', marginTop:'15px' }">
    
                    <button @click="$refs.inputImage.click()">
                        <i :class="{ 'icofont-refresh':imageLoaded, 'icofont-plus-circle':!imageLoaded }"></i> 
                        {{ imageLoaded ? 'Cambiar' : 'Seleccionar' }}
                    </button>
                    <button :style="{ marginLeft:'15px' }" v-if="imageLoaded" @click="cleanImage">
                        <i class="icofont-close-circled"></i> 
                        Quitar
                    </button>
                </div>
            </div>

            <button @click="validateForm"><i class="icofont-check" :style="{ marginLeft:'0px', marginRight:'5px' }"></i> Terminar registro</button>

        </FormulateForm>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imageLoaded: false,
            imageData: null,
            imageInfo: null
        }
    },
    methods: {
        validateForm() {
            this.$emit("validation", {result: { image: this.imageInfo }, pos: 5});
        },
        handleFileSelection(e) {
            if (e.target.files.length > 0) {                
                const vue = this;
                let imageFile = e.target.files[0];

                const fileSizeLimit = 1024 * 1024 * 3;
                if (imageFile.size > fileSizeLimit) {
                    this.$throwAppMessage({ 
                        message: `El archivo "${imageFile.name}" supera el tamaño máximo permitido (3MB)`,
                        icon: "icofont-close-circled",
                        type: 'error',
                    });
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function (e) {
                    vue.imageData = e.target.result;
                    vue.imageLoaded = true;

                    const arrayBuffer = await imageFile.arrayBuffer();
                    const uint8Array = Array.from(new Uint8Array(arrayBuffer));

                    vue.imageInfo = {
                        ext: imageFile.name.split(".").pop().toLowerCase(),
                        contentType: imageFile.type,
                        file: uint8Array
                    }
                }
                reader.readAsDataURL(imageFile);
            }
        },
        cleanImage() {
            this.imageLoaded = false;
            this.imageData = null;
            this.imageInfo = null;
        }
    }
}
</script>

<style lang="scss" scoped>
    .stepfive {
        display: flex;
        align-items: center;
        flex-direction: column;

        .min-container {
            display: flex;
            flex-direction: column;
            h3 {
                text-align: center;
                margin-bottom: 20px;
            }
            p, img {
                margin: 0 auto;
            }
            p {
                text-align: center;
                i {
                    font-size: 175px;
                }
            }
            img {
                width: 175px;
                height: 175px;
                object-fit: cover;
                border-radius: 50%;
                box-shadow: 5px 5px 5px 0px #000;
            }
        }
    }

    /* @media only screen and (max-width: 900px) {
        .stepfive {
            max-width: 100vw;
            min-width: 95vw;
        }
    } */
</style>