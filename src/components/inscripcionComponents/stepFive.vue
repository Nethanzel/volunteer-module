<template>
   <div>
        <h1>Areas de desarrollo de la institución</h1>
        <FormulateForm class="stepfive" v-model="formResult">
            
            <div class="min-container" :style="{width: '85%'}">
                <p :style="{marginBottom: '10px'}">¿A que area te gustaria pertenecer?</p>
                <div type="group" class="volTypes">

                    <p>
                        <FormulateInput type="radio" id="dep1" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="dep1">Socorro y Gestion del Riesgo</label> 
                        <br>
                        <span>Descripcion del area.</span>
                    </p>

                    <p>
                        <FormulateInput type="radio" id="dep2" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="dep2">Juventud</label>
                        <br>
                        <span>Descripcion del area.</span>
                    </p>

                    <p>
                        <FormulateInput type="radio" id="dep3" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="dep3">Salud Comunitaria</label>
                        <br>
                        <span>Descripcion del area.</span>
                    </p>

                    <p>
                        <FormulateInput type="radio" id="dep4" name="departamento" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="dep4">Doctrina y Proteccion</label>
                        <br>
                        <span>Descripcion del area.</span>
                    </p>

                </div>
            </div>

            <div class="min-container" :style="{marginTop: '20px', width: '85%'}">
                <p :style="{marginBottom: '10px'}">Tipo de miembro de la institución</p>
                <div type="group" class="volTypes">

                    <p>
                        <FormulateInput type="radio" id="vol1" name="tipoVoluntario" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="vol1">Activo</label> 
                        <br>
                        <span>Descripcion del voluntario.</span>
                    </p>

                    <p>
                        <FormulateInput type="radio" id="vol2" name="tipoVoluntario" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="vol2">Pasivo</label> 
                        <br>
                        <span>Descripcion del voluntario.</span>
                    </p>
                    
                    <p>
                        <FormulateInput type="radio" id="vol3" name="tipoVoluntario" :style="{display: 'inline-block', marginRight: '10px'}" />
                        <label for="vol3">Suspcritor</label> 
                        <br>
                        <span>Descripcion del voluntario.</span>
                    </p>

                </div>
            </div>
        </FormulateForm>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formResult: {}
        }
    },
    methods: {
        validate(e) {
            this.validations[e.name] = { validity: !(e.hasErrors) }
        }
    }
}
</script>

<style scoped lang="scss">
.stepfive{
    border: 2px solid rgb(170, 170, 170);
    max-width: 40vw;
    min-width: 40vw;
    padding: 10px;
}

.volTypes {
  display: flex;
  flex-wrap: wrap;
  p {
      border: 1px solid rgb(187, 187, 187);
      border-left: 4px solid rgb(105, 105, 105);
      margin: 5px 10px;
      min-width: 200px;
      max-width: 200px;
      padding: 5px 5px 5px 10px;

      cursor: pointer;
      font-size: 15px;
      margin-bottom: 5px;

        label  {
            margin-bottom: 10px;
            margin-top: 5px;
            font-weight: bold;
            font-size: 16px;
        }

        [type="radio"]:checked,
        [type="radio"]:not(:checked) {
            position: absolute;
            left: -9999px;
        }
        [type="radio"]:checked + label,
        [type="radio"]:not(:checked) + label
        {
            position: relative;
            padding-left: 25px;
            cursor: pointer;
            line-height: 18px;
            display: inline-block;
            color: rgb(0, 0, 0);
        }
        [type="radio"]:checked + label:before,
        [type="radio"]:not(:checked) + label:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 15px;
            height: 15px;
            border: 1px solid rgb(156, 156, 156);
            border-radius: 100%;
            background: #fff;
        }
        [type="radio"]:checked + label:after,
        [type="radio"]:not(:checked) + label:after {
            content: '';
            width: 11px;
            height: 11px;
            background: #ff0000;
            position: absolute;
            top: 3px;
            left: 3px;
            border-radius: 100%;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
        }
        [type="radio"]:not(:checked) + label:after {
            opacity: 0;
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        [type="radio"]:checked + label:after {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
  }
}

</style>