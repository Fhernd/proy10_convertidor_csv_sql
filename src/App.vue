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
  tableName: "datos",
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
  if (!contenidoCsv.value || contenidoCsv.value.trim().length === 0) {
    console.warn("No hay contenido CSV para evaluar");
    return;
  }

  // Obtener el delimitador real (detectar si es "auto" o usar el seleccionado)
  const delimitadorSeleccionado = paramsOpcionesEntrada.value.delimitador || delimitador.value;
  const delimitadorReal = csvUtils.obtenerDelimitadorReal(delimitadorSeleccionado, contenidoCsv.value);
  
  // Actualizar el delimitador detectado
  if (delimitadorSeleccionado === 'auto') {
    delimitador.value = delimitadorReal;
  } else {
    // Si el usuario seleccionó manualmente, convertir "Tab" a '\t' si es necesario
    delimitador.value = delimitadorSeleccionado === 'Tab' ? '\t' : delimitadorSeleccionado;
  }

  // Configurar opciones de parseo
  const parseOptions = {
    delimiter: delimitadorReal,
    skipEmptyLines: true,
    header: paramsOpcionesEntrada.value.primeraFilaEncabezados !== false, // true por defecto
    error: (error) => {
      console.error("Error al evaluar contenido CSV:", error);
    },
    complete: (results) => {
      if (results.errors.length > 0) {
        // Filtrar errores de delimitador no detectado si ya tenemos uno detectado
        const relevantErrors = results.errors.filter(err => 
          err.type !== 'Delimiter' || err.code !== 'UndetectableDelimiter'
        );
        
        if (relevantErrors.length > 0) {
          console.error("Errores en el contenido CSV:", relevantErrors);
        }
      }
      
      // Solo procesar si hay datos válidos
      if (results.data && results.data.length > 0 && results.meta.fields) {
        datos.value = [...results.data];
        columnas.value = [...results.meta.fields];
      } else {
        console.warn("No se pudieron extraer datos del CSV. Verifica el delimitador seleccionado.");
      }
    }
  };

  // Aplicar límites si están configurados
  if (paramsOpcionesEntrada.value.limiteLineas && paramsOpcionesEntrada.value.limiteLineas > 0) {
    parseOptions.preview = paramsOpcionesEntrada.value.limiteLineas;
  }

  Papa.parse(contenidoCsv.value, parseOptions);
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
  if (data.tiposColumnas) {
    tiposColumnasSeleccionados.value = data.tiposColumnas;
  }
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