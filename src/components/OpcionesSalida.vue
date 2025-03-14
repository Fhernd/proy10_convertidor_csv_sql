<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columnas="columnas" :sgbdSeleccionado="sgbdSeleccionado"
            @update:tiposColumnas="handleTiposColumnasUpdate" />
    </div>
</template>

<script setup>
import { defineProps, ref, watchEffect } from "vue";
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

const tiposColumnasSeleccionados = ref({});

/**
 * Actualiza los tipos de datos seleccionados para cada columna.
 * 
 * @param data {Object} - Objeto con los tipos de datos seleccionados para cada columna.
 */
const handleTiposColumnasUpdate = (data) => {
    tiposColumnasSeleccionados.value = data.tiposSeleccionados;
    console.log("Tipos de columnas actualizados:", tiposColumnasSeleccionados.value);
};

watchEffect(() => {

});
</script>
