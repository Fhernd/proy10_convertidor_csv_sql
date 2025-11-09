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
  primeraFilaEncabezados: true, // Por defecto asumimos que hay encabezados
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

  // Función para detectar si la primera fila parece ser encabezados
  const detectarSiEsEncabezados = (csvContent, delimiter) => {
    const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return false;
    
    const firstLine = lines[0];
    const secondLine = lines[1];
    
    if (!secondLine) return false; // Necesitamos al menos dos líneas para comparar
    
    const firstRowFields = firstLine.split(delimiter);
    const secondRowFields = secondLine.split(delimiter);
    
    // Si tienen diferente número de campos, probablemente no es encabezado
    if (firstRowFields.length !== secondRowFields.length) return false;
    
    // Verificar si la primera fila parece texto descriptivo (encabezados)
    // y la segunda fila parece datos (números, fechas, etc.)
    let pareceEncabezado = true;
    let camposTextoEnPrimeraFila = 0;
    
    firstRowFields.forEach((field, index) => {
      const campoPrimera = field.trim();
      const campoSegunda = secondRowFields[index]?.trim() || '';
      
      // Si el campo de la primera fila es texto descriptivo (no numérico puro)
      // y el campo de la segunda fila es numérico o fecha, probablemente es encabezado
      const esTextoDescriptivo = campoPrimera.length > 0 && 
                                  !/^\d+\.?\d*$/.test(campoPrimera) && // No es solo número
                                  campoPrimera !== 'True' && 
                                  campoPrimera !== 'False';
      
      if (esTextoDescriptivo) {
        camposTextoEnPrimeraFila++;
      }
      
      // Si la primera fila tiene un número puro y la segunda también, probablemente no es encabezado
      if (/^\d+\.?\d*$/.test(campoPrimera) && /^\d+\.?\d*$/.test(campoSegunda)) {
        pareceEncabezado = false;
      }
    });
    
    // Si más de la mitad de los campos en la primera fila son texto descriptivo,
    // probablemente es encabezado
    return pareceEncabezado && camposTextoEnPrimeraFila > firstRowFields.length / 2;
  };

  // Determinar si la primera fila tiene encabezados
  // Si el usuario no especificó, intentar detectar automáticamente
  let tieneEncabezados = paramsOpcionesEntrada.value.primeraFilaEncabezados;
  
  // Si no está explícitamente configurado, detectar automáticamente
  if (tieneEncabezados === undefined || tieneEncabezados === null) {
    tieneEncabezados = detectarSiEsEncabezados(contenidoCsv.value, delimitadorReal);
  }

  // Configurar opciones de parseo
  const parseOptions = {
    delimiter: delimitadorReal,
    skipEmptyLines: true,
    header: tieneEncabezados,
    error: (error) => {
      console.error("Error al evaluar contenido CSV:", error);
    },
    complete: (results) => {
      console.log("Resultados del parseo:", {
        dataLength: results.data?.length,
        hasFields: !!results.meta?.fields,
        fields: results.meta?.fields,
        errors: results.errors,
        delimitadorUsado: delimitadorReal,
        tieneEncabezados: tieneEncabezados
      });

      if (results.errors.length > 0) {
        // Filtrar errores de delimitador no detectado si ya tenemos uno detectado
        const relevantErrors = results.errors.filter(err => 
          err.type !== 'Delimiter' || err.code !== 'UndetectableDelimiter'
        );
        
        if (relevantErrors.length > 0) {
          console.error("Errores en el contenido CSV:", relevantErrors);
        }
      }
      
      // Procesar datos según si tiene encabezados o no
      if (results.data && results.data.length > 0) {
        if (tieneEncabezados) {
          // Si tiene encabezados, usar los campos de meta
          if (results.meta.fields && results.meta.fields.length > 0) {
            datos.value = [...results.data];
            columnas.value = [...results.meta.fields];
            console.log("Datos procesados con encabezados:", {
              columnas: columnas.value,
              cantidadDatos: datos.value.length
            });
          } else {
            console.warn("Se esperaban encabezados pero no se encontraron campos. Intentando extraer de la primera fila...");
            // Intentar obtener columnas de la primera fila del CSV original
            const lines = contenidoCsv.value.split('\n').filter(line => line.trim().length > 0);
            if (lines.length > 0) {
              const primeraLinea = lines[0];
              const columnasPrimeraLinea = primeraLinea.split(delimitadorReal).map(col => col.trim());
              
              if (columnasPrimeraLinea.length > 0 && columnasPrimeraLinea[0].length > 0) {
                columnas.value = columnasPrimeraLinea;
                // Si la primera fila eran encabezados, los datos ya están correctos
                // Si no, necesitamos ajustar
                if (results.data[0] && typeof results.data[0] === 'object') {
                  // Verificar si la primera fila de datos coincide con los encabezados
                  const primeraFilaDatos = Object.values(results.data[0] || {});
                  if (primeraFilaDatos.length === columnasPrimeraLinea.length) {
                    // Los datos ya están parseados correctamente
                    datos.value = [...results.data];
                  } else {
                    // Necesitamos reparsear sin header y luego usar la primera fila como encabezados
                    const datosSinHeader = results.data.map(row => {
                      if (Array.isArray(row)) {
                        const obj = {};
                        columnasPrimeraLinea.forEach((col, idx) => {
                          obj[col] = row[idx];
                        });
                        return obj;
                      }
                      return row;
                    });
                    // Omitir la primera fila si eran encabezados
                    datos.value = datosSinHeader.slice(1);
                  }
                } else {
                  datos.value = [...results.data];
                }
                console.log("Columnas extraídas de la primera fila:", columnas.value);
              }
            }
          }
        } else {
          // Si el usuario dijo que NO tiene encabezados, pero detectamos que podría tenerlos,
          // intentar extraerlos de la primera fila de todas formas
          const detectadoComoEncabezados = detectarSiEsEncabezados(contenidoCsv.value, delimitadorReal);
          
          if (detectadoComoEncabezados && results.data.length > 0) {
            // La primera fila probablemente son encabezados, extraerlos
            const lines = contenidoCsv.value.split('\n').filter(line => line.trim().length > 0);
            if (lines.length > 0) {
              const primeraLinea = lines[0];
              const columnasPrimeraLinea = primeraLinea.split(delimitadorReal).map(col => col.trim());
              
              if (columnasPrimeraLinea.length > 0) {
                columnas.value = columnasPrimeraLinea;
                // Convertir los datos de arrays a objetos usando los encabezados
                datos.value = results.data.slice(1).map(row => {
                  if (Array.isArray(row)) {
                    const obj = {};
                    columnasPrimeraLinea.forEach((col, idx) => {
                      obj[col] = row[idx];
                    });
                    return obj;
                  }
                  return row;
                });
                console.log("Encabezados detectados automáticamente aunque el checkbox estaba desmarcado:", columnas.value);
                return; // Salir temprano
              }
            }
          }
          
          // Si realmente no tiene encabezados, generar nombres de columnas automáticamente
          if (results.data[0] && Array.isArray(results.data[0])) {
            // Los datos vienen como arrays
            const numColumns = results.data[0].length;
            columnas.value = Array.from({ length: numColumns }, (_, i) => `Columna${i + 1}`);
            datos.value = results.data.map(row => {
              const obj = {};
              columnas.value.forEach((col, idx) => {
                obj[col] = row[idx];
              });
              return obj;
            });
          } else if (results.data[0] && typeof results.data[0] === 'object') {
            // Los datos vienen como objetos (caso raro sin header)
            columnas.value = Object.keys(results.data[0]);
            datos.value = [...results.data];
          }
        }
      } else {
        console.warn("No se pudieron extraer datos del CSV.", {
          delimitadorUsado: delimitadorReal,
          delimitadorSeleccionado: delimitadorSeleccionado,
          tieneEncabezados: tieneEncabezados,
          dataLength: results.data?.length
        });
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