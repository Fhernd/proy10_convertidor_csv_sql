<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4 text-center">Generador de SQL desde CSV</h2>

        <!-- First Row: Buttons -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
            <button v-for="(option, index) in sqlOptions" :key="index" @click="generateSQL(option.type)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {{ option.label }}
            </button>
        </div>

        <!-- Second Row: SQL Output -->
        <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Salida SQL:</label>
            <textarea v-model="sqlOutput"
                class="w-full p-3 border border-gray-300 rounded h-40 focus:ring focus:ring-blue-200"
                placeholder="Aquí se generará el código SQL..."></textarea>
        </div>

        <!-- Third Row: File Name, Download Button, EOL Selector -->
        <div class="flex flex-wrap items-center gap-2">
            <input v-model="fileName" type="text" placeholder="Nombre del archivo de salida"
                class="p-2 border border-gray-300 rounded w-1/3 focus:ring focus:ring-blue-200">

            <button @click="downloadSQL" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Descargar SQL
            </button>

            <div class="flex items-center gap-2 ml-auto">
                <label for="eol-select" class="font-bold text-gray-700">EOL:</label>
                <select id="eol-select" v-model="eolType"
                    class="p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <option value="\n">LF (Unix/Linux)</option>
                    <option value="\r\n">CRLF (Windows)</option>
                    <option value="\r">CR (Old Mac)</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// SQL Options
const sqlOptions = ref([
    { type: 'insert', label: 'CSV a SQL INSERT' },
    { type: 'update', label: 'CSV a SQL UPDATE' },
    { type: 'delete', label: 'CSV a SQL DELETE' },
    { type: 'merge', label: 'CSV a SQL MERGE' },
    { type: 'select', label: 'CSV a SQL SELECT' }
]);

// Reactive state
const sqlOutput = ref('');
const fileName = ref('query.sql');
const eolType = ref('\n');

// Function to generate SQL output (mock implementation)
const generateSQL = (type) => {
    sqlOutput.value = `-- SQL Generated for ${type.toUpperCase()}\nSELECT * FROM table;`;
};

// Function to download SQL file
const downloadSQL = () => {
    const blob = new Blob([sqlOutput.value.replace(/\n/g, eolType.value)], { type: "text/sql" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName.value;
    link.click();
};
</script>

<style scoped></style>
