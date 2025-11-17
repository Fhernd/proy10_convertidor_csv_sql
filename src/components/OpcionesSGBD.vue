<template>
    <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 transition-colors duration-300">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span class="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">Configuración del SGBD</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Selecciona las opciones de configuración para la salida del sistema de gestión de
            base de datos.</p>

        <!-- Selección del motor de base de datos -->
        <label class="block mb-4">
            <span class="text-gray-700 dark:text-gray-200 font-medium mb-2 block">Motor de Base de Datos:</span>
            <select v-model="sgbdSeleccionado"
                class="w-full p-2.5 border-2 border-indigo-300 dark:border-indigo-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300">
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="sqlserver">SQL Server</option>
            </select>
        </label>

        <!-- Configuración de la sintaxis de salida -->
        <label class="block mb-4">
            <span class="text-gray-700 dark:text-gray-200 font-medium mb-2 block">Sintaxis de salida:</span>
            <select v-model="tipoSintaxis"
                class="w-full p-2.5 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
                <option value="standard">SQL Estándar</option>
                <option value="custom">Personalizado</option>
            </select>
        </label>
    </div>
</template>

<script setup>
import { defineEmits, ref, watch } from "vue";

const sgbdSeleccionado = ref("mysql");
const tipoSintaxis = ref("standard");

const emit = defineEmits(["update:config"]);

watch([sgbdSeleccionado, tipoSintaxis], ([sgbdSeleccionado, tipoSintaxis]) => {
    emit("update:config", {
        sgbdSeleccionado,
        tipoSintaxis,
    });
}, { deep: true });
</script>

<style scoped></style>
