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
        </div>
    </div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';

const tableName = ref('datos');
const replaceSpaces = ref(false);
const allVarchar = ref(false);
const createView = ref(false);
const dropTable = ref(false);
const selectPrimaryKey = ref(false);

const emit = defineEmits(['update:opcionesSalidaTabla']);

const applyOptions = () => {
    const options = {
        tableName: tableName.value,
        replaceSpaces: replaceSpaces.value,
        allVarchar: allVarchar.value,
        createView: createView.value,
        dropTable: dropTable.value,
        selectPrimaryKey: selectPrimaryKey.value,
    };

    emit('update:opcionesSalidaTabla', options);
};

watch([tableName, replaceSpaces, allVarchar, createView, dropTable, selectPrimaryKey], () => {
    applyOptions();
}, { deep: true });
</script>

<style scoped></style>
