<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4" :class="disabled ? 'text-gray-400' : ''">Opciones de Inserción de Datos</h2>

        <div class="flex flex-col space-y-4">
            <label class="flex items-center" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="useReplace" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-gray-300 rounded transition-colors duration-200',
                        disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 focus:ring focus:ring-blue-200'
                    ]">
                <span :class="disabled ? 'text-gray-400' : ''">Usar REPLACE en lugar de INSERT</span>
            </label>

            <div class="flex items-center space-x-2" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="enableInsertMultipleClauses" type="checkbox" :disabled="disabled"
                    :class="[
                        'h-5 w-5 border-gray-300 rounded transition-colors duration-200',
                        disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 focus:ring focus:ring-blue-200'
                    ]">
                <label :class="disabled ? 'text-gray-400' : 'text-gray-700'">Usar una sentencia INSERT/REPLACE con múltiples cláusulas</label>
                <input v-model="insertMultipleClauses" :disabled="disabled || !enableInsertMultipleClauses" type="number"
                    :class="[
                        'p-2 border rounded focus:ring focus:ring-blue-200 w-24 transition-colors duration-200',
                        disabled || !enableInsertMultipleClauses
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300'
                    ]">
            </div>

            <div>
                <label :class="['block mb-1', disabled ? 'text-gray-400' : 'text-gray-700']">Agregar frase después de las palabras clave INSERT/REPLACE</label>
                <select 
                    v-model="additionalPhrase" 
                    :disabled="disabled || useReplace || validPhrases.length === 0"
                    :class="[
                        'mt-1 block w-full p-2 border rounded transition-colors duration-200',
                        disabled || useReplace || validPhrases.length === 0
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 focus:ring focus:ring-blue-200'
                    ]">
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
