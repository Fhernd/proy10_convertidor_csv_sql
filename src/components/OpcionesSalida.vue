<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columns="columnas" :tiposDatosSgbd="tiposDatosSgbd" />
    </div>
</template>

<script setup>
import {defineProps, ref } from "vue";

import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

const columnas = ref(props.columnas);
const sgbdSeleccionado = ref(props.sgbdSeleccionado);
const tiposDatosSgbd = ref([]);
</script>