<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4" :class="disabled ? 'text-gray-400' : ''">Opciones de Formateo e Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <div>
                <label :class="['block mb-1', disabled ? 'text-gray-400' : 'text-gray-700']">Formatear fechas</label>
                <select v-model="selectedDateFormat" :disabled="disabled"
                    :class="[
                        'mt-1 block w-full p-2 border rounded transition-colors duration-200',
                        disabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 focus:ring focus:ring-blue-200'
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
                        'mt-2 block w-full p-2 border rounded transition-colors duration-200',
                        disabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 focus:ring focus:ring-blue-200'
                    ]">
                <p v-if="selectedDateFormat && selectedDateFormat !== 'custom'" class="mt-1 text-xs text-gray-600">
                    Formato seleccionado: <strong>{{ selectedDateFormat }}</strong>
                </p>
            </div>

            <label class="flex items-center" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="replaceNulls" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-gray-300 rounded transition-colors duration-200',
                        disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 focus:ring focus:ring-blue-200'
                    ]">
                <span :class="disabled ? 'text-gray-400' : ''">Reemplazar campos faltantes por NULL</span>
            </label>

            <label class="flex items-center" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="useSingleQuotes" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-gray-300 rounded transition-colors duration-200',
                        disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 focus:ring focus:ring-blue-200'
                    ]">
                <span :class="disabled ? 'text-gray-400' : ''">Utilizar comillas simples para las cadenas de caracteres</span>
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
