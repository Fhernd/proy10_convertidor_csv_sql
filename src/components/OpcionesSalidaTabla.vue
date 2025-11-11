<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4">Opciones de Salida de la Tabla</h2>

        <div class="flex flex-col space-y-4">
            <div class="mb-4">
                <label for="table-name" class="block text-gray-700 font-bold mb-2">Nombre de la Tabla:</label>
                <input id="table-name" v-model="tableName" type="text" placeholder="Introduce el nombre de la tabla"
                    class="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-200">
            </div>

            <label class="flex items-center">
                <input v-model="replaceSpaces" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Sustitución de espacios por guiones bajos en nombres de columnas
            </label>

            <label class="flex items-center">
                <input v-model="allVarchar" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Dejar como VARCHAR todos los campos
            </label>

            <label class="flex items-center">
                <input v-model="createView" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Crear vista
            </label>

            <label class="flex items-center">
                <input v-model="dropTable" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Eliminar tabla si existe antes de crearla
            </label>

            <label class="flex items-center">
                <input v-model="selectPrimaryKey" type="checkbox" class="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                Selección de columnas que integran la llave primaria
            </label>

            <!-- Panel de selección de columnas para llave primaria -->
            <div v-if="selectPrimaryKey && columnas && columnas.length > 0" 
                 class="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">
                    Seleccionar columnas para llave primaria compuesta
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                    Marca las columnas que formarán parte de la llave primaria compuesta. Puedes seleccionar una o más columnas.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    <label v-for="(col, index) in columnas" 
                           :key="index"
                           class="flex items-center p-2 bg-white border border-gray-300 rounded hover:bg-blue-50 cursor-pointer transition-colors">
                        <input 
                            type="checkbox" 
                            :value="col"
                            v-model="primaryKeyColumns"
                            class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200">
                        <span class="text-sm text-gray-700">{{ col }}</span>
                    </label>
                </div>
                <div v-if="primaryKeyColumns.length > 0" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p class="text-sm font-medium text-blue-800">
                        Columnas seleccionadas ({{ primaryKeyColumns.length }}): 
                        <span class="font-normal">{{ primaryKeyColumns.join(', ') }}</span>
                    </p>
                </div>
                <div v-else class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p class="text-sm text-yellow-800">
                        ⚠️ No has seleccionado ninguna columna. La tabla se creará sin llave primaria.
                    </p>
                </div>
            </div>
            <div v-else-if="selectPrimaryKey && (!columnas || columnas.length === 0)" 
                 class="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p class="text-sm text-yellow-800">
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
