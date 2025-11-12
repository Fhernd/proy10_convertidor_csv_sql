<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4">Opciones de Formateo e Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <div>
                <label class="block text-gray-700 mb-1">Formatear fechas</label>
                <select v-model="selectedDateFormat" 
                    class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <option value="">(Sin formato)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 - Estándar SQL)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Europeo)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (Americano)</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                    <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                    <option value="YYYYMMDD">YYYYMMDD (Sin separadores)</option>
                    <option value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss (Con hora)</option>
                    <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss (ISO con hora)</option>
                    <option value="custom">Personalizado...</option>
                </select>
                <input v-if="selectedDateFormat === 'custom'" 
                    v-model="customDateFormat"
                    type="text"
                    placeholder="Ejemplo: YYYY-MM-DD"
                    class="mt-2 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
                <p v-if="selectedDateFormat && selectedDateFormat !== 'custom'" class="mt-1 text-xs text-gray-600">
                    Formato seleccionado: <strong>{{ selectedDateFormat }}</strong>
                </p>
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
    </div>
</template>

<script setup>
import { defineEmits, ref, watch, computed } from 'vue';

const selectedDateFormat = ref('');
const customDateFormat = ref('');
const replaceNulls = ref(false);
const useSingleQuotes = ref(false);
const useBackticks = ref(false);

const emit = defineEmits('update:opcionesFormato');

// Computed para obtener el formato de fecha final
const formatDates = computed(() => {
    if (selectedDateFormat.value === 'custom') {
        return customDateFormat.value;
    }
    return selectedDateFormat.value || '';
});

watch([selectedDateFormat, customDateFormat, replaceNulls, useSingleQuotes, useBackticks], () => {
    emit('update:opcionesFormato', {
        formatDates: formatDates.value,
        replaceNulls: replaceNulls.value,
        useSingleQuotes: useSingleQuotes.value,
        useBackticks: useBackticks.value,
    });
});

</script>

<style scoped></style>
