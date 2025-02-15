<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4">Opciones de Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <label class="flex items-center">
                <input v-model="useReplace" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Usar REPLACE en lugar de INSERT
            </label>

            <div>
                <label class="block text-gray-700">Usar una sentencia INSERT/REPLACE con múltiples cláusulas</label>
                <input v-model="insertMultipleClauses" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
            </div>

            <div>
                <label class="block text-gray-700">Agregar frase después de las palabras clave INSERT/UPDATE</label>
                <input v-model="additionalPhrase" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
            </div>
        </div>

        <button @click="applyOptions" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Aplicar Opciones
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const useReplace = ref(false);
const insertMultipleClauses = ref('');
const additionalPhrase = ref('');

const applyOptions = () => {
    const options = {
        useReplace: useReplace.value,
        insertMultipleClauses: insertMultipleClauses.value,
        additionalPhrase: additionalPhrase.value,
    };

    console.log("Opciones aplicadas:", options);
    alert("Opciones aplicadas con éxito!");
};
</script>

<style scoped></style>
