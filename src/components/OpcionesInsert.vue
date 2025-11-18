<template>
    <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 transition-colors duration-300" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2" :class="disabled ? 'text-gray-400 dark:text-gray-600' : ''">
            <span v-if="!disabled" class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Opciones de Inserción de Datos</span>
            <span v-else class="dark:text-gray-500">Opciones de Inserción de Datos</span>
        </h2>

        <div class="flex flex-col space-y-4">
            <label class="flex items-center p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group dark-hover-label" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="useReplace" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-white dark-hover-text', 'transition-colors']">Usar REPLACE en lugar de INSERT</span>
            </label>

            <div class="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group dark-hover-label" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="enableInsertMultipleClauses" type="checkbox" :disabled="disabled"
                    :class="[
                        'h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500'
                    ]">
                <label :class="[disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-white dark-hover-text', 'transition-colors flex-1']">Usar una sentencia INSERT/REPLACE con múltiples cláusulas</label>
                <input v-model="insertMultipleClauses" :disabled="disabled || !enableInsertMultipleClauses" type="number"
                    :class="[
                        'p-2 border-2 rounded-lg focus:ring-2 w-24 transition-all duration-300 shadow-sm',
                        disabled || !enableInsertMultipleClauses
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-200 dark:focus:ring-purple-800 hover:border-purple-400 dark:hover:border-purple-500'
                    ]">
            </div>

            <div>
                <label :class="['block mb-2 font-medium', disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-100']">Agregar frase después de las palabras clave INSERT/REPLACE</label>
                <select 
                    v-model="additionalPhrase" 
                    :disabled="disabled || useReplace || validPhrases.length === 0"
                    :class="[
                        'mt-1 block w-full p-2.5 border-2 rounded-lg transition-all duration-300 shadow-sm',
                        disabled || useReplace || validPhrases.length === 0
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                            : 'border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 hover:border-blue-400 dark:hover:border-blue-500'
                    ]">
                    <option value="">(Ninguna)</option>
                    <option v-for="phrase in validPhrases" :key="phrase" :value="phrase">
                        {{ phrase }}
                    </option>
                </select>
                <div v-if="useReplace" class="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded text-sm text-yellow-800 dark:text-yellow-300">
                    ⚠️ REPLACE no soporta modificadores adicionales.
                </div>
                <div v-else-if="validPhrases.length === 0" class="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-100">
                    ℹ️ No hay modificadores disponibles para {{ sgbdName }}.
                </div>
                <div v-else-if="additionalPhrase" class="mt-2 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded text-sm text-green-800 dark:text-green-300">
                    ✓ Modificador seleccionado: <strong>{{ additionalPhrase }}</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, computed } from 'vue';

const props = defineProps({
    sgbdSeleccionado: {
        type: String,
        default: 'mysql'
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

// Definir frases válidas por SGBD
const validPhrasesBySGBD = {
    mysql: ['IGNORE', 'LOW_PRIORITY', 'HIGH_PRIORITY', 'DELAYED'],
    postgresql: [], // PostgreSQL no tiene modificadores para INSERT
    sqlite: [], // SQLite no tiene modificadores para INSERT
    sqlserver: [] // SQL Server no tiene modificadores para INSERT
};

const useReplace = ref(false);
const enableInsertMultipleClauses = ref(false);
const insertMultipleClauses = ref('');
const additionalPhrase = ref('');

const emit = defineEmits('update:opcionesInsert');

// Computed para obtener las frases válidas según el SGBD
const validPhrases = computed(() => {
    const sgbd = (props.sgbdSeleccionado || 'mysql').toLowerCase();
    return validPhrasesBySGBD[sgbd] || [];
});

// Computed para el nombre del SGBD
const sgbdName = computed(() => {
    const sgbd = (props.sgbdSeleccionado || 'mysql').toLowerCase();
    const names = {
        mysql: 'MySQL',
        postgresql: 'PostgreSQL',
        sqlite: 'SQLite',
        sqlserver: 'SQL Server'
    };
    return names[sgbd] || 'MySQL';
});

// Watch para emitir cambios y limpiar additionalPhrase cuando se usa REPLACE
watch([useReplace, enableInsertMultipleClauses, insertMultipleClauses, additionalPhrase], () => {
    // Si se activa REPLACE, limpiar la frase adicional ya que REPLACE no la soporta
    if (useReplace.value && additionalPhrase.value) {
        additionalPhrase.value = '';
    }
    
    emit('update:opcionesInsert', {
        useReplace: useReplace.value,
        enableInsertMultipleClauses: enableInsertMultipleClauses.value,
        insertMultipleClauses: insertMultipleClauses.value,
        additionalPhrase: useReplace.value ? '' : additionalPhrase.value,
    });
});

// Limpiar additionalPhrase cuando se activa REPLACE
watch(useReplace, (newValue) => {
    if (newValue && additionalPhrase.value) {
        additionalPhrase.value = '';
    }
});
</script>

<style scoped></style>
