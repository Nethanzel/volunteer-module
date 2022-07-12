<template>
    <div>
        <div class="dataview">
            <div class="element" v-for="voluntario in Voluntarios" :key="voluntario.identity">
                <p>{{voluntario.identity}}</p>
                <p>{{voluntario.nombre}} {{voluntario.apellido}}</p>
                <p>Estación {{voluntario.estacion.numero}} - {{voluntario.estacion.municipio}}</p>
                <p>{{formatDate(voluntario.createdAt)}}</p>
            </div>
        </div>
        <div class="pagination">
            <p 
                v-for="page in pages" 
                :key="page" 
                @click="getVolunteers(page)"
                :style="{
                    color: page == cPage ? 'white' : 'black',
                    backgroundColor: page == cPage ? 'red' : 'transparent',
                    border: page == cPage ? '1px solid gray' : '1px solid black',
                }"
            >{{page}}</p>
        </div>
    </div>
</template>

<script>
import Request from "./../request/instance.js";
export default {
    data() {
        return {
            Voluntarios: null,
            pages: 0,
            cPage: 0
        }
    },
    methods: {
        async getVolunteers(page) {
            let requestResult = await Request.Get.Voluntarios(page ? page : 1);
            if(requestResult.status == 200) {
                let { rows, limit, count } = requestResult.data;
                this.Voluntarios = rows;
                this.pages = Math.ceil(count / limit);
                this.cPage = page ? page : 1;
            } else {
                //show errors here
            }
        },
        formatDate(date) {
            if(date) {
                let dateInstance = new Date(date);
                let newDate = `${dateInstance.getDate()}/${dateInstance.getMonth() + 1}/${dateInstance.getFullYear()} a las 
                ${dateInstance.getHours()}:${dateInstance.getMinutes()}:${dateInstance.getSeconds()}`;
                return newDate;
            }
            return "No hay fecha"
        }
    },
    mounted() {
        this.getVolunteers();
    }
}
</script>

<style lang="scss">
.pagination {
    border: 2px solid black;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 5px;
    margin: 10px;
    p {
        border: 1px solid black;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        cursor: pointer;
        text-align: center;
        padding: 3px;
        margin: 0 10px;
    }
}

.dataview {
    display: flex;
    flex-wrap: wrap;
    .element {
        margin: 10px 15px;
        max-width: 370px;
        border: 2px solid red;
        p {
            margin: 5px 10px;
        }
    }
}
</style>