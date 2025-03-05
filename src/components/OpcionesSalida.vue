<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columnas="columnas" :sgbdSeleccionado="sgbdSeleccionado" />
    </div>
</template>

<script setup>
import { defineProps, ref, watchEffect } from "vue";
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

const columnas = ref(props.columnas);
const sgbdSeleccionado = ref(props.sgbdSeleccionado);

watchEffect(() => {
    console.log("Columnas:", columnas.value);
    console.log("SGBD Seleccionado:", sgbdSeleccionado.value);
});
</script>
