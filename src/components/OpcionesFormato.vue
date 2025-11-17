<template>
    <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 transition-colors duration-300" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2" :class="disabled ? 'text-gray-400 dark:text-gray-600' : ''">
            <span v-if="!disabled" class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Opciones de Formateo e Inserción de Datos</span>
            <span v-else class="dark:text-gray-500">Opciones de Formateo e Inserción de Datos</span>
        </h2>

        <div class="flex flex-col space-y-4">
            <div>
                <label :class="['block mb-2 font-medium', disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200']">Formatear fechas</label>
                <select v-model="selectedDateFormat" :disabled="disabled"
                    :class="[
                        'mt-1 block w-full p-2.5 border-2 rounded-lg transition-all duration-300 shadow-sm',
                        disabled
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                            : 'border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                    ]">
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
                    :disabled="disabled"
                    :class="[
                        'mt-2 block w-full p-2.5 border-2 rounded-lg transition-all duration-300 shadow-sm',
                        disabled
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                            : 'border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                    ]">
                <p v-if="selectedDateFormat && selectedDateFormat !== 'custom'" class="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    Formato seleccionado: <strong>{{ selectedDateFormat }}</strong>
                </p>
            </div>

            <label class="flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="replaceNulls" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400', 'transition-colors']">Reemplazar campos faltantes por NULL</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="useSingleQuotes" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400', 'transition-colors']">Utilizar comillas simples para las cadenas de caracteres</span>
            </label>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, computed } from 'vue';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

const selectedDateFormat = ref('');
const customDateFormat = ref('');
const replaceNulls = ref(false);
const useSingleQuotes = ref(false);

const emit = defineEmits('update:opcionesFormato');

// Computed para obtener el formato de fecha final
const formatDates = computed(() => {
    if (selectedDateFormat.value === 'custom') {
        return customDateFormat.value;
    }
    return selectedDateFormat.value || '';
});

watch([selectedDateFormat, customDateFormat, replaceNulls, useSingleQuotes], () => {
    emit('update:opcionesFormato', {
        formatDates: formatDates.value,
        replaceNulls: replaceNulls.value,
        useSingleQuotes: useSingleQuotes.value,
    });
});

</script>

<style scoped></style>
