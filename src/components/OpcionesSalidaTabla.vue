<template>
    <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 transition-colors duration-300" :class="{ 'opacity-60 pointer-events-none': disabled }">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2" :class="disabled ? 'text-gray-400 dark:text-gray-600' : ''">
            <span v-if="!disabled" class="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Opciones de Salida de la Tabla</span>
            <span v-else class="dark:text-gray-500">Opciones de Salida de la Tabla</span>
        </h2>

        <div class="flex flex-col space-y-4">
            <div class="mb-4">
                <label for="table-name" :class="['block font-bold mb-2', disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200']">Nombre de la Tabla:</label>
                <input id="table-name" v-model="tableName" type="text" placeholder="Introduce el nombre de la tabla"
                    :disabled="disabled"
                    :class="[
                        'w-full p-3 border-2 rounded-lg transition-all duration-300 shadow-sm',
                        disabled
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 hover:border-purple-400 dark:hover:border-purple-500'
                    ]">
            </div>

            <label class="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="replaceSpaces" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400', 'transition-colors']">Sustitución de espacios por guiones bajos en nombres de columnas</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="allVarchar" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400', 'transition-colors']">Dejar como VARCHAR todos los campos</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="createView" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400', 'transition-colors']">Crear vista</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="dropTable" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400', 'transition-colors']">Eliminar tabla si existe antes de crearla</span>
            </label>

            <label class="flex items-center p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group" :class="{ 'cursor-not-allowed': disabled }">
                <input v-model="selectPrimaryKey" type="checkbox" :disabled="disabled"
                    :class="[
                        'mr-2 h-5 w-5 border-2 rounded transition-all duration-200',
                        disabled
                            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
                    ]">
                <span :class="[disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400', 'transition-colors']">Selección de columnas que integran la llave primaria</span>
            </label>

            <!-- Panel de selección de columnas para llave primaria -->
            <div v-if="selectPrimaryKey && columnas && columnas.length > 0" 
                 class="mt-4 p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-blue-900/30 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span class="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Seleccionar columnas para llave primaria compuesta</span>
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Marca las columnas que formarán parte de la llave primaria compuesta. Puedes seleccionar una o más columnas.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    <label v-for="(col, index) in columnas" 
                           :key="index"
                           class="flex items-center p-3 bg-white dark:bg-gray-700 border-2 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all duration-300 group">
                        <input 
                            type="checkbox" 
                            :value="col"
                            v-model="primaryKeyColumns"
                            :disabled="disabled"
                            :class="[
                                'mr-2 h-4 w-4 border-2 rounded transition-all duration-200',
                                disabled
                                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : 'border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
                            ]">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ col }}</span>
                    </label>
                </div>
                <div v-if="primaryKeyColumns.length > 0" class="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg shadow-sm">
                    <p class="text-sm font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                        <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Columnas seleccionadas ({{ primaryKeyColumns.length }}): 
                        <span class="font-normal text-purple-700 dark:text-purple-300">{{ primaryKeyColumns.join(', ') }}</span>
                    </p>
                </div>
                <div v-else class="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg shadow-sm">
                    <p class="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                        <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No has seleccionado ninguna columna. La tabla se creará sin llave primaria.
                    </p>
                </div>
            </div>
            <div v-else-if="selectPrimaryKey && (!columnas || columnas.length === 0)" 
                 class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p class="text-sm text-yellow-800 dark:text-yellow-300">
                    ⚠️ No hay columnas disponibles. Por favor, evalúa primero el contenido CSV.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
    columnas: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const tableName = ref('datos');
const replaceSpaces = ref(false);
const allVarchar = ref(false);
const createView = ref(false);
const dropTable = ref(false);
const selectPrimaryKey = ref(false);
const primaryKeyColumns = ref([]);

const emit = defineEmits(['update:opcionesSalidaTabla']);

const applyOptions = () => {
    const options = {
        tableName: tableName.value,
        replaceSpaces: replaceSpaces.value,
        allVarchar: allVarchar.value,
        createView: createView.value,
        dropTable: dropTable.value,
        selectPrimaryKey: selectPrimaryKey.value,
        primaryKeyColumns: selectPrimaryKey.value ? [...primaryKeyColumns.value] : [],
    };

    emit('update:opcionesSalidaTabla', options);
};

// Limpiar selección de columnas cuando se desmarca el checkbox
watch(selectPrimaryKey, (newValue) => {
    if (!newValue) {
        primaryKeyColumns.value = [];
    }
    applyOptions();
});

// Observar cambios en las columnas para limpiar selecciones inválidas
watch(() => props.columnas, (newColumnas) => {
    // Remover columnas que ya no existen
    if (newColumnas && newColumnas.length > 0) {
        primaryKeyColumns.value = primaryKeyColumns.value.filter(col => 
            newColumnas.includes(col)
        );
    } else {
        primaryKeyColumns.value = [];
    }
    applyOptions();
}, { deep: true });

watch([tableName, replaceSpaces, allVarchar, createView, dropTable, primaryKeyColumns], () => {
    applyOptions();
}, { deep: true });
</script>

<style scoped></style>
