<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4">Opciones de Formateo e Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <div>
                <label class="block text-gray-700">Formatear fechas</label>
                <input v-model="formatDates" type="text"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
            </div>

            <label class="flex items-center">
                <input v-model="replaceNulls" type="checkbox"
                    class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Reemplazar campos faltantes por NULL
            </label>

            <label class="flex items-center">
                <input v-model="useSingleQuotes" type="checkbox"
                    class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Utilizar comillas simples para las cadenas de caracteres
            </label>

            <label class="flex items-center">
                <input v-model="useBackticks" type="checkbox"
                    class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Nombres de tablas y columnas con carácter ` (backtick)
            </label>
        </div>

        <button @click="applyOptions"
            class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Aplicar Opciones
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const formatDates = ref('');
const replaceNulls = ref(false);
const useSingleQuotes = ref(false);
const useBackticks = ref(false);

const applyOptions = () => {
    const options = {
        formatDates: formatDates.value,
        replaceNulls: replaceNulls.value,
        useSingleQuotes: useSingleQuotes.value,
        useBackticks: useBackticks.value
    };

    console.log("Opciones aplicadas:", options);
    alert("Opciones aplicadas con éxito!");
};
</script>

<style scoped></style>
