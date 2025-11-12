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
                <label class="block text-gray-700 mb-1">Agregar frase después de las palabras clave INSERT/REPLACE</label>
                <select 
                    v-model="additionalPhrase" 
                    :disabled="useReplace || validPhrases.length === 0"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="">(Ninguna)</option>
                    <option v-for="phrase in validPhrases" :key="phrase" :value="phrase">
                        {{ phrase }}
                    </option>
                </select>
                <div v-if="useReplace" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⚠️ REPLACE no soporta modificadores adicionales.
                </div>
                <div v-else-if="validPhrases.length === 0" class="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                    ℹ️ No hay modificadores disponibles para {{ sgbdName }}.
                </div>
                <div v-else-if="additionalPhrase" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
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
