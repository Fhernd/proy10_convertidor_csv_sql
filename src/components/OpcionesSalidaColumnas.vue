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
                        <select class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                            <option v-for="tipoDato in tiposDatosSgbd" :key="tipoDato" :value="sgbdSeleccionado === 'mysql' && tipoDato === 'VARCHAR' ? 'VARCHAR' :
                                sgbdSeleccionado === 'sqlserver' && tipoDato === 'TEXT' ? 'TEXT' :
                                    sgbdSeleccionado === 'postgresql' && tipoDato === 'CHAR' ? 'CHAR' :
                                        sgbdSeleccionado === 'sqlite' && tipoDato === 'TEXT' ? 'TEXT' : tipoDato" :selected="sgbdSeleccionado === 'mysql' && tipoDato === 'VARCHAR' ? true :
                    sgbdSeleccionado === 'sqlserver' && tipoDato === 'TEXT' ? true :
                        sgbdSeleccionado === 'postgresql' && tipoDato === 'CHAR' ? true :
                            sgbdSeleccionado === 'sqlite' && tipoDato === 'TEXT' ? true : false">
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
import { defineProps, ref, watchEffect } from "vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

const columnas = ref([]);
const sgbdSeleccionado = ref("");
const tiposDatosSgbd = ref([]);

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
};

watchEffect(() => {
    console.log("OpcionesSalidaColumnas > Columnas:", props.columnas);

    columnas.value = props.columnas;
    sgbdSeleccionado.value = props.sgbdSeleccionado;
    updateDataTypes(sgbdSeleccionado.value);
});

</script>

<style scoped>
/* Tailwind CSS ya se carga globalmente */
</style>