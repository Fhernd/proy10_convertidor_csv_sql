<template>
    <div class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-bold mb-4">Opciones de Salida de la Tabla</h2>

        <div class="flex flex-col space-y-4">
            <label class="flex items-center">
                <input v-model="replaceSpaces" type="checkbox" class="mr-2">
                Sustitución de espacios por guiones bajos en nombres de columnas
            </label>

            <label class="flex items-center">
                <input v-model="allVarchar" type="checkbox" class="mr-2">
                Dejar como VARCHAR todos los campos
            </label>

            <label class="flex items-center">
                <input v-model="createView" type="checkbox" class="mr-2">
                Agregar vista o tabla
            </label>

            <label class="flex items-center">
                <input v-model="dropTable" type="checkbox" class="mr-2">
                Eliminar tabla si existe antes de crearla
            </label>

            <label class="flex items-center">
                <input v-model="selectPrimaryKey" type="checkbox" class="mr-2">
                Selección de columnas que integran la llave primaria
            </label>
        </div>

        <button @click="applyOptions" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Aplicar Opciones
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const replaceSpaces = ref(false);
const allVarchar = ref(false);
const createView = ref(false);
const dropTable = ref(false);
const selectPrimaryKey = ref(false);

const applyOptions = () => {
    const options = {
        replaceSpaces: replaceSpaces.value,
        allVarchar: allVarchar.value,
        createView: createView.value,
        dropTable: dropTable.value,
        selectPrimaryKey: selectPrimaryKey.value,
    };

    console.log("Opciones aplicadas:", options);
    alert("Opciones aplicadas con éxito!");
};
</script>

<style scoped></style>
