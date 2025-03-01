<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Configuración del SGBD</h2>
        <p class="text-gray-600 mb-6">Selecciona las opciones de configuración para la salida del sistema de gestión de
            base de datos.</p>

        <!-- Selección del motor de base de datos -->
        <label class="block mb-4">
            <span class="text-gray-700">Motor de Base de Datos:</span>
            <select v-model="sgbdSeleccionado"
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
            <select v-model="tipoSintaxis"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
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

const emit = defineEmits(["update:params"]);

watch([sgbdSeleccionado, tipoSintaxis], ([sgbdSeleccionado, tipoSintaxis]) => {
    emit("update:params", {
        sgbdSeleccionado,
        tipoSintaxis,
    });
}, { deep: true });
</script>

<style scoped></style>
