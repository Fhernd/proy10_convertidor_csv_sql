<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columnas="columnas" :sgbdSeleccionado="sgbdSeleccionado" />
    </div>
</template>

<script setup>
import { defineProps, watchEffect } from "vue";
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

watchEffect(() => {
    
});
</script>
