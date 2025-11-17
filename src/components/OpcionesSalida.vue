<template>
    <div class="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md w-full mt-5 transition-colors duration-300" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <OpcionesSalidaColumnas :columnas="columnas" :sgbdSeleccionado="sgbdSeleccionado" :disabled="disabled"
            @update:tiposColumnas="handleTiposColumnasUpdate" />
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watchEffect } from "vue";
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
    disabled: {
        type: Boolean,
        default: false
    }
});

const tiposColumnasSeleccionados = ref({});

const emit = defineEmits(["update:tiposColumnas"]);

/**
 * Actualiza los tipos de datos seleccionados para cada columna.
 * 
 * @param data {Object} - Objeto con los tipos de datos seleccionados para cada columna.
 */
const handleTiposColumnasUpdate = (data) => {
    tiposColumnasSeleccionados.value = data.tiposSeleccionados;

    emit("update:tiposColumnas", {
        tiposColumnas: tiposColumnasSeleccionados.value,
    });
};

watchEffect(() => {

});
</script>
