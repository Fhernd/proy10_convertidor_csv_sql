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
    const mysqlDataTypes = ["INT", "VARCHAR", "TEXT", "DATETIME", "TINYINT", "DECIMAL", "BIGINT", "BOOLEAN"];
    const postgresDataTypes = ["BIGINT", "BIT", "BOOLEAN", "CHAR", "DATE", "DECIMAL", "DOUBLE PRECISION", "ENUM"];
    const sqliteDataTypes = ["INT", "INTEGER", "TINYINT", "SMALLINT", "TEXT", "BLOB", "REAL", "BOOLEAN", "DATE"];
    const mssqlDataTypes = ["BIGINT", "INT", "SMALLINT", "TINYINT", "BIT", "DECIMAL", "MONEY", "FLOAT", "TEXT"];

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
