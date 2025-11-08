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
import { defineProps, ref } from 'vue';

const props = defineProps({
    datos: Array,
    columnas: Array,
    paramsOpcionesEntrada: Object,
    paramsOpcionesSGBD: Object,
    paramsOpcionesSalidaTabla: Object,
    paramsOpcionesInsert: Object,
    tiposColumnasSeleccionados: Object,
    paramsOpcionesFormato: Object
});

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

// Function to format value based on SQL data type
const formatValueByType = (value, dataType) => {
    if (value === null || value === undefined || value === '') {
        return 'NULL';
    }

    const upperType = (dataType || '').toUpperCase();
    const strValue = String(value).trim();
    
    // Boolean types - check first since TINYINT can be boolean
    if (upperType === 'BOOLEAN' || upperType === 'BIT') {
        const lowerValue = strValue.toLowerCase();
        if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
            return upperType === 'BIT' ? '1' : '1';
        }
        if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
            return upperType === 'BIT' ? '0' : '0';
        }
        // If it's a boolean type but value doesn't match, try parsing as number
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : (num ? '1' : '0');
    }
    
    // TINYINT - can be used for boolean (0/1) or small integers
    if (upperType === 'TINYINT') {
        const lowerValue = strValue.toLowerCase();
        // Check if it's a boolean-like value
        if (lowerValue === 'true' || lowerValue === 'yes') {
            return '1';
        }
        if (lowerValue === 'false' || lowerValue === 'no') {
            return '0';
        }
        // Otherwise treat as integer
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : Math.round(num).toString();
    }
    
    // Numeric types - no quotes
    if (upperType === 'INT' || upperType === 'INTEGER' || upperType === 'BIGINT' || 
        upperType === 'SMALLINT') {
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : Math.round(num).toString();
    }
    
    // Decimal types - no quotes
    if (upperType === 'DECIMAL' || upperType === 'FLOAT' || upperType === 'DOUBLE' || 
        upperType === 'DOUBLE PRECISION' || upperType === 'REAL' || upperType === 'MONEY') {
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : num.toString();
    }
    
    // Date/Time types
    if (upperType === 'DATETIME' || upperType === 'DATE' || upperType === 'TIMESTAMP') {
        return `'${strValue}'`;
    }
    
    // String types - with quotes (escape single quotes)
    return `'${strValue.replace(/'/g, "''")}'`;
};

// Function to generate SQL output
const generateSQL = (type) => {
    if (type === 'insert') {
        // Get table name from paramsOpcionesSalidaTabla
        const tableName = props.paramsOpcionesSalidaTabla?.tableName || 'table';
        
        // Get column names with proper formatting
        const columnNames = props.columnas.map((col) => {
            const columnName = props.paramsOpcionesSalidaTabla?.replaceSpaces 
                ? col.replace(/\s+/g, '_') 
                : col;
            return `"${columnName}"`;
        }).join(', ');
        
        // Generate INSERT statements
        const sql = props.datos.map((row) => {
            const values = props.columnas.map((col) => {
                const value = row[col];
                const dataType = props.tiposColumnasSeleccionados?.[col] || 'VARCHAR';
                return formatValueByType(value, dataType);
            }).join(', ');
            return `INSERT INTO ${tableName} (${columnNames}) VALUES (${values});`;
        }).join('\n');

        sqlOutput.value = sql;
    } else {
        sqlOutput.value = `-- SQL Generated for ${type.toUpperCase()}\nSELECT * FROM table;`;
    }
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
