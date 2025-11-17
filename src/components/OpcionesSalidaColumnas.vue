<template>
    <h1 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Configuración de los tipos de datos de las columnas</span>
    </h1>
    <p class="text-gray-600 mb-6">
        Selecciona el tipo de dato para cada columna del archivo CSV.
    </p>

    <!-- Tabla de configuración de columnas -->
    <div class="overflow-x-auto shadow-md rounded-lg border-2 border-blue-100">
        <table class="w-full border-collapse">
            <thead class="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
                <tr>
                    <th class="p-4 text-left font-semibold text-gray-700 border-b-2 border-purple-200">Columna</th>
                    <th class="p-4 text-left font-semibold text-gray-700 border-b-2 border-indigo-200">Tipo de Dato</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(column, index) in columnas" :key="index" 
                    :class="[
                        'transition-colors duration-200',
                        index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-purple-50'
                    ]">
                    <!-- Nombre de la columna -->
                    <td class="p-3 border-b border-gray-200 font-medium text-gray-700">
                        {{ column }}
                    </td>

                    <!-- Selector de tipo de dato -->
                    <td class="p-3 border-b border-gray-200">
                        <select 
                            :disabled="disabled"
                            :class="[
                                'w-full p-2.5 border-2 rounded-lg transition-all duration-300 shadow-sm',
                                disabled
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    : 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-400'
                            ]"
                            v-model="tiposSeleccionados[column]">
                            <option v-for="tipoDato in tiposDatosSgbd" :key="tipoDato" :value="tipoDato">
                                {{ tipoDato }}
                            </option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, watchEffect } from "vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
    disabled: {
        type: Boolean,
        default: false
    }
});

const columnas = ref([]);
const sgbdSeleccionado = ref("");
const tiposDatosSgbd = ref([]);
const tiposSeleccionados = ref({});

const emit = defineEmits(['update:tiposColumnas']);

/**
 * Actualiza los tipos de datos disponibles según el SGBD seleccionado.
 * 
 * @param sgbd {String} - Nombre del SGBD seleccionado.
 */
const updateDataTypes = (sgbd) => {
    // MySQL data types
    const mysqlDataTypes = [
        // Numeric types
        "INT", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT", 
        "DECIMAL", "FLOAT", "DOUBLE",
        // String types
        "VARCHAR", "CHAR", "TEXT", "TINYTEXT", "MEDIUMTEXT", "LONGTEXT",
        // Date/Time types
        "DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR",
        // Other types
        "BOOLEAN", "BIT", "BLOB", "JSON"
    ];
    
    // PostgreSQL data types
    const postgresDataTypes = [
        // Numeric types
        "BIGINT", "INTEGER", "SMALLINT", "DECIMAL", "NUMERIC",
        "REAL", "DOUBLE PRECISION", "MONEY",
        // String types
        "CHAR", "VARCHAR", "TEXT",
        // Date/Time types
        "DATE", 
        "TIME", 
        "TIME WITH TIME ZONE",
        "TIMESTAMP", 
        "TIMESTAMP WITHOUT TIME ZONE",
        "TIMESTAMP WITH TIME ZONE",
        "INTERVAL",
        // Other types
        "BOOLEAN", "BIT", "BIT VARYING", "BYTEA", "JSON", "JSONB", "UUID", "ENUM"
    ];
    
    // SQLite data types
    const sqliteDataTypes = [
        // Numeric types
        "INT", "INTEGER", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT",
        "REAL", "DOUBLE", "FLOAT", "NUMERIC", "DECIMAL",
        // String types
        "TEXT", "CHAR", "VARCHAR",
        // Date/Time types
        "DATE", "TIME", "DATETIME", "TIMESTAMP",
        // Other types
        "BOOLEAN", "BLOB"
    ];
    
    // SQL Server data types
    const mssqlDataTypes = [
        // Numeric types
        "BIGINT", "INT", "SMALLINT", "TINYINT",
        "DECIMAL", "NUMERIC", "FLOAT", "REAL", "MONEY", "SMALLMONEY",
        // String types
        "CHAR", "VARCHAR", "TEXT", "NCHAR", "NVARCHAR", "NTEXT",
        // Date/Time types
        "DATE", 
        "TIME",
        "DATETIME", 
        "DATETIME2",
        "SMALLDATETIME",
        "DATETIMEOFFSET",
        // Other types
        "BIT", "BINARY", "VARBINARY", "IMAGE", "XML", "UNIQUEIDENTIFIER"
    ];

    switch (sgbd) {
        case "mysql":
            tiposDatosSgbd.value = mysqlDataTypes;
            break;
        case "postgresql":
            tiposDatosSgbd.value = postgresDataTypes;
            break;
        case "sqlite":
            tiposDatosSgbd.value = sqliteDataTypes;
            break;
        case "sqlserver":
            tiposDatosSgbd.value = mssqlDataTypes;
            break;
        default:
            tiposDatosSgbd.value = [];
            break;
    }

    tiposSeleccionados.value = {};

    columnas.value.forEach(col => {
        tiposSeleccionados.value[col] = getDefaultType(sgbd);
    });

    emit('update:tiposColumnas', { columnas: columnas.value, tiposSeleccionados: tiposSeleccionados.value });
};


// Función para determinar el valor predeterminado según el SGBD seleccionado
const getDefaultType = (sgbd) => {
    switch (sgbd) {
        case "mysql": return "VARCHAR";
        case "postgresql": return "CHAR";
        case "sqlite": return "TEXT";
        case "sqlserver": return "TEXT";
        default: return "";
    }
};

watchEffect(() => {
    columnas.value = props.columnas;
    sgbdSeleccionado.value = props.sgbdSeleccionado;
    updateDataTypes(sgbdSeleccionado.value);
});

// Emitir cambios al padre cuando se selecciona un nuevo tipo de dato
watch([columnas, tiposSeleccionados], () => {
    emit('update:tiposColumnas', { columnas: columnas.value, tiposSeleccionados: tiposSeleccionados.value });
}, { deep: true });

</script>
