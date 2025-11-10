<template>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Configuración de los tipos de datos de las columnas</h1>
    <p class="text-gray-600 mb-6">
        Selecciona el tipo de dato para cada columna del archivo CSV.
    </p>

    <!-- Tabla de configuración de columnas -->
    <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-3 text-left border border-gray-300">Columna</th>
                    <th class="p-3 text-left border border-gray-300">Tipo de Dato</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(column, index) in columnas" :key="index" class="odd:bg-white even:bg-gray-50">
                    <!-- Nombre de la columna -->
                    <td class="p-3 border border-gray-300">
                        {{ column }}
                    </td>

                    <!-- Selector de tipo de dato -->
                    <td class="p-3 border border-gray-300">
                        <select class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
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
