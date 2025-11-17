<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2" :class="disabled ? 'text-gray-400' : ''">
            <span v-if="!disabled" class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Opciones de Formateo e Inserción de Datos</span>
            <span v-else>Opciones de Formateo e Inserción de Datos</span>
        </h2>

        <div class="flex flex-col space-y-4">
            <div>
                <label :class="['block mb-2 font-medium', disabled ? 'text-gray-400' : 'text-gray-700']">Formatear fechas</label>
                <select v-model="selectedDateFormat" :disabled="disabled"
                    :class="[
                        'mt-1 block w-full p-2.5 border-2 rounded-lg transition-all duration-300 shadow-sm',
                        disabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-400'
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
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-400'
                    ]">
                <p v-if="selectedDateFormat && selectedDateFormat !== 'custom'" class="mt-1 text-xs text-gray-600">
                    Formato seleccionado: <strong>{{ selectedDateFormat }}</strong>
                </p>
            </div>

            <label class="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="replaceNulls" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-200 group-hover:border-blue-400'
                    ]">
                <span :class="[disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-blue-600', 'transition-colors']">Reemplazar campos faltantes por NULL</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="useSingleQuotes" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-200 group-hover:border-purple-400'
                    ]">
                <span :class="[disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-purple-600', 'transition-colors']">Utilizar comillas simples para las cadenas de caracteres</span>
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
