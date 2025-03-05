<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columnas="columnas" :tiposDatosSgbd="tiposDatosSgbd" />
    </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

const props = defineProps({
    columnas: Array,
    sgbdSeleccionado: String,
});

const columnas = ref(props.columnas);
const sgbdSeleccionado = ref(props.sgbdSeleccionado);
const tiposDatosSgbd = ref([]);

const updateDataTypes = (sgbd) => {
    const mysqlDataTypes = [
        "INT",
        "VARCHAR",
        "TEXT",
        "DATETIME",
        "TINYINT",
        "DECIMAL",
        "BIGINT",
        "BOOLEAN",
        "FLOAT",
        "DOUBLE",
        "TIMESTAMP",
        "DATE",
        "SMALLINT",
        "MEDIUMINT",
        "CHAR",
        "BLOB",
        "ENUM",
        "SET",
        "TIME",
        "YEAR",
        "VARBINARY",
        "BINARY",
        "TINYTEXT",
        "MEDIUMTEXT",
        "LONGTEXT",
        "TINYBLOB",
        "MEDIUMBLOB",
        "LONGBLOB",
        "NUMERIC"
    ];

    const postgresDataTypes = [
        "BIGINT",
        "BIT",
        "BOOLEAN",
        "CHAR",
        "DATE",
        "DECIMAL",
        "DOUBLE PRECISION",
        "ENUM",
        "FLOAT",
        "INTEGER",
        "JSON",
        "JSONB",
        "MACADDR",
        "MACADDR8",
        "MONEY",
        "NUMERIC",
        "REAL",
        "SMALLINT",
        "TEXT",
        "TIME",
        "TIMESTAMP",
        "TIMESTAMPTZ",
        "TIMETZ",
        "UUID",
        "XML"
    ];

    const sqliteDataTypes = [
        "INT",
        "INTEGER",
        "TINYINT",
        "SMALLINT",
        "MEDIUMINT",
        "BIGINT",
        "UNSIGNED BIG INT",
        "INT2",
        "INT8",
        "CHARACTER(20)",
        "VARCHAR(255)",
        "VARYING CHARACTER(255)",
        "NCHAR(55)",
        "NATIVE CHARACTER(70)",
        "NVARCHAR(100)",
        "TEXT",
        "CLOB",
        "BLOB",
        "REAL",
        "DOUBLE",
        "DOUBLE PRECISION",
        "FLOAT",
        "NUMERIC",
        "DECIMAL(10,5)",
        "BOOLEAN",
        "DATE",
        "DATETIME"
    ];

    const mssqlDataTypes = [
        "BIGINT",
        "INT",
        "SMALLINT",
        "TINYINT",
        "BIT",
        "DECIMAL",
        "NUMERIC",
        "MONEY",
        "SMALLMONEY",
        "FLOAT",
        "REAL",
        "DATE",
        "DATETIME",
        "DATETIME2",
        "DATETIMEOFFSET",
        "SMALLDATETIME",
        "TIME",
        "CHAR",
        "VARCHAR",
        "TEXT",
        "NCHAR",
        "NVARCHAR",
        "NTEXT",
        "BINARY",
        "VARBINARY",
        "IMAGE",
        "ROWVERSION",
        "TIMESTAMP",
        "UNIQUEIDENTIFIER",
        "XML",
        "CURSOR",
        "TABLE",
        "HIERARCHYID",
        "GEOMETRY",
        "GEOGRAPHY",
        "SQL_VARIANT",
        "SYSNAME"
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
};

// Watch for changes in sgbdSeleccionado and update tiposDatosSgbd accordingly
watch(sgbdSeleccionado, (newVal) => {
    console.log('SGBD seleccionado en OpcionesSalida:', newVal);

    updateDataTypes(newVal);
});

// Initialize tiposDatosSgbd based on the initial value of sgbdSeleccionado
updateDataTypes(sgbdSeleccionado.value);
</script>
