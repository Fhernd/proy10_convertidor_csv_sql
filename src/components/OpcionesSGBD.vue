<template>
    <div class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Configuración del SGBD</h2>
        <p class="text-gray-600 mb-6">Selecciona las opciones de configuración para la salida del sistema de gestión de
            base de datos.</p>

        <!-- Selección del motor de base de datos -->
        <label class="block mb-4">
            <span class="text-gray-700">Motor de Base de Datos:</span>
            <select v-model="selectedDBMS"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="sqlserver">SQL Server</option>
            </select>
        </label>

        <!-- Selección de tipos de datos disponibles -->
        <label class="block mb-4">
            <span class="text-gray-700">Tipos de Datos Permitidos:</span>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <label v-for="(type, index) in dataTypes" :key="index" class="flex items-center">
                    <input type="checkbox" v-model="selectedDataTypes" :value="type" class="mr-2">
                    {{ type }}
                </label>
            </div>
        </label>

        <!-- Configuración de la sintaxis de salida -->
        <label class="block mb-4">
            <span class="text-gray-700">Sintaxis de salida:</span>
            <select v-model="syntaxStyle"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                <option value="standard">SQL Estándar</option>
                <option value="custom">Personalizado</option>
            </select>
        </label>

        <!-- Opción de formato de datos -->
        <label class="block mb-4">
            <span class="text-gray-700">Formato de Salida:</span>
            <select v-model="outputFormat"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="sql">Script SQL</option>
            </select>
        </label>

        <!-- Botón de guardar configuración -->
        <button @click="saveConfiguration"
            class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none">
            Guardar Configuración
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedDBMS = ref("mysql");
const dataTypes = ref(["INT", "VARCHAR", "TEXT", "BOOLEAN", "DATE", "DECIMAL", "FLOAT"]);
const selectedDataTypes = ref([]);
const syntaxStyle = ref("standard");
const outputFormat = ref("json");

const saveConfiguration = () => {
    const config = {
        database: selectedDBMS.value,
        dataTypes: selectedDataTypes.value,
        syntax: syntaxStyle.value,
        format: outputFormat.value,
    };
    console.log("Configuración guardada:", config);
    alert("¡Configuración del SGBD guardada correctamente!");
};
</script>

<style scoped></style>
