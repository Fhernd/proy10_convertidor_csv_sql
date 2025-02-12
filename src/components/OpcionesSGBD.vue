<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
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

        <!-- Configuración de la sintaxis de salida -->
        <label class="block mb-4">
            <span class="text-gray-700">Sintaxis de salida:</span>
            <select v-model="syntaxStyle"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                <option value="standard">SQL Estándar</option>
                <option value="custom">Personalizado</option>
            </select>
        </label>

        <button @click="saveConfiguration"
            class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none">
            Guardar Configuración
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedDBMS = ref("mysql");
const syntaxStyle = ref("standard");


const saveConfiguration = () => {
    const config = {
        database: selectedDBMS.value,
        syntax: syntaxStyle.value,
    };
    console.log("Configuración guardada:", config);
    alert("¡Configuración del SGBD guardada correctamente!");
};
</script>

<style scoped></style>
