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
                :placeholder="!props.datos || props.datos.length === 0 ? 'Primero evalúa el contenido CSV para generar SQL...' : 'Aquí se generará el código SQL...'"></textarea>
            <p v-if="!props.datos || props.datos.length === 0" class="text-sm text-gray-500 mt-1">
                💡 Primero ingresa datos CSV y presiona "Evaluar contenido CSV"
            </p>
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
    datos: {
        type: Array,
        default: () => []
    },
    columnas: {
        type: Array,
        default: () => []
    },
    paramsOpcionesEntrada: {
        type: Object,
        default: () => ({})
    },
    paramsOpcionesSGBD: {
        type: Object,
        default: () => ({ sgbdSeleccionado: 'mysql' })
    },
    paramsOpcionesSalidaTabla: {
        type: Object,
        default: () => ({ tableName: 'table' })
    },
    paramsOpcionesInsert: {
        type: Object,
        default: () => ({})
    },
    tiposColumnasSeleccionados: {
        type: Object,
        default: () => ({})
    },
    paramsOpcionesFormato: {
        type: Object,
        default: () => ({})
    }
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

// Function to get the appropriate quote character for identifiers based on SGBD
const getIdentifierQuote = () => {
    // If useBackticks option is enabled, use backticks
    if (props.paramsOpcionesFormato?.useBackticks) {
        return '`';
    }
    
    // Determine quote based on SGBD
    const sgbd = props.paramsOpcionesSGBD?.sgbdSeleccionado?.toLowerCase() || 'mysql';
    
    switch (sgbd) {
        case 'mysql':
            // MySQL uses backticks by default for identifiers with spaces/special chars
            return '`';
        case 'postgresql':
        case 'sqlite':
            // PostgreSQL and SQLite use double quotes
            return '"';
        case 'sqlserver':
            // SQL Server can use brackets or double quotes
            return '[';
        default:
            // Default to backticks for MySQL compatibility
            return '`';
    }
};

// Function to get the closing quote character (for SQL Server brackets)
const getIdentifierCloseQuote = () => {
    const sgbd = props.paramsOpcionesSGBD?.sgbdSeleccionado?.toLowerCase() || 'mysql';
    if (sgbd === 'sqlserver' && !props.paramsOpcionesFormato?.useBackticks) {
        return ']';
    }
    return getIdentifierQuote();
};

// Function to generate SQL output
const generateSQL = (type) => {
    console.log('Generando SQL tipo:', type);
    console.log('Datos recibidos:', props.datos);
    console.log('Columnas recibidas:', props.columnas);
    console.log('Tipos de columnas:', props.tiposColumnasSeleccionados);
    console.log('Opciones tabla:', props.paramsOpcionesSalidaTabla);
    
    // Validar que haya datos y columnas disponibles
    if (!props.datos || !Array.isArray(props.datos) || props.datos.length === 0) {
        sqlOutput.value = '-- Error: No hay datos CSV disponibles. Por favor, evalúa primero el contenido CSV.';
        console.warn('No hay datos disponibles para generar SQL. Datos:', props.datos);
        return;
    }

    if (!props.columnas || !Array.isArray(props.columnas) || props.columnas.length === 0) {
        sqlOutput.value = '-- Error: No hay columnas disponibles. Por favor, evalúa primero el contenido CSV.';
        console.warn('No hay columnas disponibles para generar SQL. Columnas:', props.columnas);
        return;
    }

    if (type === 'insert') {
        // Get table name from paramsOpcionesSalidaTabla
        const tableName = props.paramsOpcionesSalidaTabla?.tableName || 'table';
        const quoteChar = getIdentifierQuote();
        const closeQuoteChar = getIdentifierCloseQuote();
        
        // Get column names with proper formatting
        const columnNames = props.columnas.map((col) => {
            const columnName = props.paramsOpcionesSalidaTabla?.replaceSpaces 
                ? col.replace(/\s+/g, '_') 
                : col;
            return `${quoteChar}${columnName}${closeQuoteChar}`;
        }).join(', ');
        
        // Format table name with quotes if needed
        const formattedTableName = tableName.includes(' ') || tableName.includes('-')
            ? `${quoteChar}${tableName}${closeQuoteChar}`
            : tableName;
        
        // Aplicar límite si está configurado en paramsOpcionesEntrada
        let datosParaGenerar = props.datos;
        const limiteLineas = props.paramsOpcionesEntrada?.limiteLineas;
        
        if (limiteLineas && limiteLineas > 0) {
            datosParaGenerar = props.datos.slice(0, limiteLineas);
            console.log('Aplicando límite en generación SQL:', {
                limiteSolicitado: limiteLineas,
                datosTotales: props.datos.length,
                datosLimitados: datosParaGenerar.length
            });
        }
        
        // Generate INSERT statements
        const sql = datosParaGenerar.map((row) => {
            const values = props.columnas.map((col) => {
                const value = row[col];
                const dataType = props.tiposColumnasSeleccionados?.[col] || 'VARCHAR';
                return formatValueByType(value, dataType);
            }).join(', ');
            return `INSERT INTO ${formattedTableName} (${columnNames}) VALUES (${values});`;
        }).join('\n');

        sqlOutput.value = sql;
        console.log('SQL generado exitosamente:', {
            registrosGenerados: datosParaGenerar.length,
            caracteres: sql.length
        });
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
