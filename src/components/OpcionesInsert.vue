<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4">Opciones de Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <label class="flex items-center">
                <input v-model="useReplace" type="checkbox"
                    class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Usar REPLACE en lugar de INSERT
            </label>

            <div class="flex items-center space-x-2">
                <input v-model="enableInsertMultipleClauses" type="checkbox"
                    class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                <label class="text-gray-700">Usar una sentencia INSERT/REPLACE con múltiples cláusulas</label>
                <input v-model="insertMultipleClauses" :disabled="!enableInsertMultipleClauses" type="number"
                    class="p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 w-24">
            </div>

            <div>
                <label class="block text-gray-700">Agregar frase después de las palabras clave INSERT/UPDATE</label>
                <input v-model="additionalPhrase" type="text"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';

const useReplace = ref(false);
const enableInsertMultipleClauses = ref(false);
const insertMultipleClauses = ref('');
const additionalPhrase = ref('');

const emit = defineEmits('update:opcionesInsert');

watch([useReplace, enableInsertMultipleClauses, insertMultipleClauses, additionalPhrase], () => {
    emit('update:opcionesInsert', {
        useReplace: useReplace.value,
        enableInsertMultipleClauses: enableInsertMultipleClauses.value,
        insertMultipleClauses: insertMultipleClauses.value,
        additionalPhrase: additionalPhrase.value,
    });
});
</script>

<style scoped></style>
