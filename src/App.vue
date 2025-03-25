<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="sticky top-0 z-10 bg-white shadow-md">
      <div class="container mx-auto max-w-screen-lg px-4 py-2">
        <Tabs>
          <template #default="{ activeTab }">
            <Tab label="Ingreso datos">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <textarea class="w-full h-48 p-2 border border-gray-300 rounded" placeholder="Escribe aquí..."
                  v-model="contenidoCsv"></textarea>
              </div>
            </Tab>
            <Tab label="Subir archivo">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input type="file" accept=".csv" class="mt-4 p-2 border border-gray-300 rounded cursor-pointer" />
              </div>
            </Tab>
            <Tab label="URL">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input type="url" class="w-full mt-4 p-2 border border-gray-300 rounded"
                  placeholder="Ingresa una URL válida" />
              </div>
            </Tab>
          </template>
        </Tabs>
        <button
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none mt-4"
          @click="evaluarContenidoCsv">Evaluar
          contenido CSV</button>
      </div>
    </header>

    <main class="container mx-auto max-w-screen-lg px-4 py-8">
      <OpcionesEntrada :delimitador="delimitador" @update:params="handleOpcionesEntradaParams" />

      <OpcionesSGBD @update:config="handleOpcionesSgbdParams" />

      <OpcionesSalida :columnas="columnas" :sgbdSeleccionado="paramsOpcionesSGBD.sgbdSeleccionado"
        @update:tiposColumnas="handleTiposColumnasUpdate" />

      <OpcionesSalidaTabla @update:opcionesSalidaTabla="handleOpcionesSalidaTabla" />

      <OpcionesInsert @update:opcionesInsert="handleOpcionesInsert" />

      <OpcionesFormato @update:opcionesFormato="handleOpcionesFormato" />

      <SalidaSQL
        :datos="datos"
        :columnas="columnas"
        :paramsOpcionesEntrada="paramsOpcionesEntrada" 
        :tiposColumnasSeleccionados="tiposColumnasSeleccionados"
        :paramsOpcionesSGBD="paramsOpcionesSGBD"
        :paramsOpcionesSalida="paramsOpcionesSalida"
        :paramsOpcionesSalidaTabla="paramsOpcionesSalidaTabla"
        :paramsOpcionesInsert="paramsOpcionesInsert"
        :paramsOpcionesFormato="paramsOpcionesFormato" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Papa from "papaparse";

import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import OpcionesEntrada from "./components/OpcionesEntrada.vue";
import OpcionesSGBD from "./components/OpcionesSGBD.vue";
import OpcionesSalida from "./components/OpcionesSalida.vue";
import OpcionesSalidaTabla from "./components/OpcionesSalidaTabla.vue";
import OpcionesInsert from "./components/OpcionesInsert.vue";
import OpcionesFormato from "./components/OpcionesFormato.vue";
import SalidaSQL from "./components/SalidaSQL.vue";

import { csvUtils } from '@/utils';

const delimitador = ref("auto");
const contenidoCsv = ref("");
const columnas = ref([]);
const datos = ref([]);

const paramsOpcionesEntrada = ref({
  primeraFilaEncabezados: false,
  limiteLineas: null,
  lineasOmitidas: null,
  delimitador: delimitador.value,
});

const paramsOpcionesSGBD = ref({
  sgbdSeleccionado: "mysql",
  tipoSintaxis: "standard",
});

const parmsOpcionesSalida = ref({
  tiposDatosColumnas: "insert",
});

const paramsOpcionesSalidaTabla = ref({
  replaceSpaces: false,
  allVarchar: false,
  createView: false,
  dropTable: false,
  selectPrimaryKey: false,
});

const paramsOpcionesInsert = ref({
  useReplace: false,
  enableInsertMultipleClauses: false,
  insertMultipleClauses: "",
  additionalPhrase: "",
});

const paramsOpcionesFormato = ref({
  formatDates: "",
  replaceNulls: false,
  useSingleQuotes: false,
  useBackticks: false,
});

const paramsOpcionesSalida = ref({
  tiposDatosColumnas: "insert",
});

const tiposColumnasSeleccionados = ref({});

const evaluarContenidoCsv = () => {
  Papa.parse(contenidoCsv.value, {
    header: true,
    skipEmptyLines: true,
    error: (error) => {
      console.error("Error al evaluar contenido CSV:", error);
    },
    complete: (results) => {
      if (results.errors.length > 0) {
        console.error("Errores en el contenido CSV:", results.errors);
      } else {
        delimitador.value = csvUtils.detectarDelimitador(contenidoCsv.value);
        datos.value = [...results.data];
        columnas.value = [...results.meta.fields];

        console.log('Datos:', datos.value);
        console.log('Columnas:', columnas.value);
      }
    }
  });
};

const handleOpcionesEntradaParams = (newParams) => {
  paramsOpcionesEntrada.value = newParams;
  console.log("Updated OpcionesEntrada params:", paramsOpcionesEntrada.value);
};

const handleOpcionesSgbdParams = (newParams) => {
  paramsOpcionesSGBD.value = newParams;
};

watch(delimitador, (newVal) => {
  paramsOpcionesEntrada.value.delimitador = newVal;
});

const handleTiposColumnasUpdate = (data) => {
  paramsOpcionesSalida.value.tiposDatosColumnas = data.tipoSalida;
};

const handleOpcionesSalidaTabla = (data) => {
  paramsOpcionesSalidaTabla.value = data;
};

const handleOpcionesInsert = (data) => {
  paramsOpcionesInsert.value = data;
};

const handleOpcionesFormato = (data) => {
  paramsOpcionesFormato.value = data;
};
</script>

<style scoped>
.tab-content {
  min-height: 250px;
}
</style>