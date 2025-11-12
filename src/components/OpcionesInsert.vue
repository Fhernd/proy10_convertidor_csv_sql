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
                <input 
                    v-model="additionalPhrase" 
                    type="text"
                    :class="[
                        'mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200',
                        isValidPhrase ? 'border-gray-300' : 'border-red-500'
                    ]"
                    :placeholder="placeholderText"
                    @input="validatePhrase">
                <div v-if="!isValidPhrase && additionalPhrase.trim()" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    ⚠️ La frase ingresada no es válida{{ useReplace ? ' con REPLACE' : '' }} para {{ sgbdName }}. 
                    <span v-if="suggestedPhrases.length > 0">
                        Frases válidas: <strong>{{ suggestedPhrases.join(', ') }}</strong>
                    </span>
                    <span v-else-if="useReplace">
                        REPLACE no soporta modificadores adicionales.
                    </span>
                </div>
                <div v-if="isValidPhrase && additionalPhrase.trim()" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✓ Frase válida para {{ sgbdName }}
                </div>
                <div v-if="validPhrases.length > 0" class="mt-2 text-xs text-gray-600">
                    <strong>Frases válidas para {{ sgbdName }}:</strong> {{ validPhrases.join(', ') }}
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
const isValidPhrase = ref(true);

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

// Computed para el placeholder
const placeholderText = computed(() => {
    if (validPhrases.value.length === 0) {
        return `No hay modificadores disponibles para ${sgbdName.value}`;
    }
    return `Ejemplo: ${validPhrases.value[0]}`;
});

// Función para validar la frase
const validatePhrase = () => {
    const phrase = additionalPhrase.value.trim().toUpperCase();
    
    if (!phrase) {
        isValidPhrase.value = true;
        return;
    }
    
    // Verificar si la frase está en la lista de válidas
    let isValid = validPhrases.value.includes(phrase);
    
    // Si se usa REPLACE, algunas frases no son válidas
    // REPLACE no soporta IGNORE, LOW_PRIORITY, HIGH_PRIORITY, DELAYED
    if (useReplace.value && phrase) {
        const invalidForReplace = ['IGNORE', 'LOW_PRIORITY', 'HIGH_PRIORITY', 'DELAYED'];
        if (invalidForReplace.includes(phrase)) {
            isValid = false;
        }
    }
    
    isValidPhrase.value = isValid;
};

// Computed para sugerencias
const suggestedPhrases = computed(() => {
    if (isValidPhrase.value || !additionalPhrase.value.trim()) {
        return [];
    }
    
    const phrase = additionalPhrase.value.trim().toUpperCase();
    // Buscar frases similares
    return validPhrases.value.filter(p => 
        p.includes(phrase) || phrase.includes(p)
    );
});

watch([useReplace, enableInsertMultipleClauses, insertMultipleClauses, additionalPhrase], () => {
    validatePhrase();
    emit('update:opcionesInsert', {
        useReplace: useReplace.value,
        enableInsertMultipleClauses: enableInsertMultipleClauses.value,
        insertMultipleClauses: insertMultipleClauses.value,
        additionalPhrase: isValidPhrase.value ? additionalPhrase.value : '',
    });
});

// Revalidar cuando cambia useReplace
watch(useReplace, () => {
    validatePhrase();
});

// Validar cuando cambia el SGBD
watch(() => props.sgbdSeleccionado, () => {
    validatePhrase();
});
</script>

<style scoped></style>
