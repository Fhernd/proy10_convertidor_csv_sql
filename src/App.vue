<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="sticky top-0 z-10 bg-white shadow-md">
      <div class="container mx-auto max-w-screen-lg px-4 py-2">
        <!-- Botón para colapsar/expandir sección de entrada -->
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-bold text-gray-700">Entrada de Datos CSV</h2>
          <button
            @click="toggleEntradaDatos"
            class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            :aria-expanded="entradaDatosExpandida"
            :aria-label="entradaDatosExpandida ? 'Colapsar sección de entrada' : 'Expandir sección de entrada'">
            <span>{{ entradaDatosExpandida ? 'Ocultar' : 'Mostrar' }}</span>
            <svg 
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-180': !entradaDatosExpandida }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <!-- Sección colapsable de entrada de datos -->
        <div 
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="entradaDatosExpandida ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'">
          <Tabs>
          <template #default="{ activeTab }">
            <Tab label="Ingreso datos" icon="edit">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <textarea 
                  class="w-full h-48 p-2 border border-gray-300 rounded" 
                  placeholder="Escribe aquí..."
                  v-model="contenidoCsv"
                  @input="limpiarEstadoArchivo"></textarea>
              </div>
            </Tab>
            <Tab label="Subir archivo" icon="upload">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <div class="mb-4">
                  <label class="block text-gray-700 font-semibold mb-2">Seleccionar archivo CSV</label>
                  <input 
                    type="file" 
                    ref="fileInput"
                    accept=".csv,.CSV"
                    @change="handleFileSelect"
                    class="p-2 border border-gray-300 rounded cursor-pointer w-full" />
                  <p v-if="archivoSeleccionado" class="mt-2 text-sm text-gray-600">
                    ✓ Archivo seleccionado: <strong>{{ archivoSeleccionado.name }}</strong>
                    <span class="text-gray-500"> ({{ formatFileSize(archivoSeleccionado.size) }})</span>
                  </p>
                  <p v-if="errorArchivo" class="mt-2 text-sm text-red-600">
                    ⚠️ {{ errorArchivo }}
                  </p>
                </div>
                
                <div v-if="contenidoCsv || archivoSeleccionado" class="mt-4">
                  <label class="block text-gray-700 font-semibold mb-2">
                    Contenido del archivo
                    <span v-if="archivoSeleccionado" class="text-sm font-normal text-gray-500">
                      (puedes editar el contenido si es necesario)
                    </span>
                  </label>
                  <textarea 
                    v-model="contenidoCsv"
                    class="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    placeholder="El contenido del archivo CSV aparecerá aquí después de seleccionarlo..."
                    @input="limpiarEstadoArchivo"></textarea>
                  <p v-if="contenidoCsv" class="mt-2 text-xs text-gray-500">
                    {{ contenidoCsv.split('\n').length }} líneas • {{ contenidoCsv.length }} caracteres
                  </p>
                </div>
              </div>
            </Tab>
            <Tab label="URL" icon="link">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <div class="mb-4">
                  <label class="block text-gray-700 font-semibold mb-2">Ingresar URL del archivo CSV</label>
                  <div class="flex gap-2">
                    <input 
                      type="url" 
                      ref="urlInput"
                      v-model="urlCsv"
                      @keyup.enter="cargarCsvDesdeUrl"
                      class="flex-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none"
                      placeholder="https://ejemplo.com/archivo.csv" />
                    <button
                      @click="cargarCsvDesdeUrl"
                      :disabled="cargandoUrl"
                      class="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <span v-if="!cargandoUrl">Cargar</span>
                      <span v-else>Cargando...</span>
                    </button>
                  </div>
                  <p v-if="urlCsv && !errorUrl" class="mt-2 text-sm text-gray-600">
                    URL: <strong class="break-all">{{ urlCsv }}</strong>
                  </p>
                  <p v-if="errorUrl" class="mt-2 text-sm text-red-600">
                    ⚠️ {{ errorUrl }}
                  </p>
                </div>
                
                <div v-if="contenidoCsv || urlCsv" class="mt-4">
                  <label class="block text-gray-700 font-semibold mb-2">
                    Contenido del archivo CSV
                    <span v-if="urlCsv" class="text-sm font-normal text-gray-500">
                      (puedes editar el contenido si es necesario)
                    </span>
                  </label>
                  <textarea 
                    v-model="contenidoCsv"
                    class="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    placeholder="El contenido del archivo CSV aparecerá aquí después de cargarlo desde la URL..."
                    @input="limpiarEstadoUrl"></textarea>
                  <p v-if="contenidoCsv" class="mt-2 text-xs text-gray-500">
                    {{ contenidoCsv.split('\n').length }} líneas • {{ contenidoCsv.length }} caracteres
                  </p>
                </div>
              </div>
            </Tab>
          </template>
          </Tabs>
          <button
            class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none mt-4 transition-colors duration-200"
            @click="evaluarContenidoCsv">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Evaluar contenido CSV</span>
          </button>
        </div>
        
        <!-- Indicador cuando está colapsado -->
        <div 
          v-if="!entradaDatosExpandida && contenidoCsv"
          class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1 min-w-0">
                <span class="text-sm text-blue-800 font-medium block truncate">
                  CSV cargado: {{ contenidoCsv.split('\n').length }} líneas • {{ contenidoCsv.length.toLocaleString() }} caracteres
                </span>
                <span v-if="archivoSeleccionado" class="text-xs text-blue-600 block truncate">
                  Archivo: {{ archivoSeleccionado.name }}
                </span>
                <span v-if="urlCsv && !archivoSeleccionado" class="text-xs text-blue-600 block truncate">
                  URL: {{ urlCsv }}
                </span>
              </div>
            </div>
            <button
              @click="toggleEntradaDatos"
              class="ml-3 flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
              Ver contenido
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto max-w-screen-lg px-4 py-8">
      <OpcionesEntrada :delimitador="delimitador" @update:params="handleOpcionesEntradaParams" />

      <OpcionesSGBD @update:config="handleOpcionesSgbdParams" />

      <OpcionesSalida :columnas="columnas" :sgbdSeleccionado="paramsOpcionesSGBD.sgbdSeleccionado"
        :disabled="!datos || datos.length === 0 || !columnas || columnas.length === 0"
        @update:tiposColumnas="handleTiposColumnasUpdate" />

      <OpcionesSalidaTabla :columnas="columnas" 
        :disabled="!datos || datos.length === 0 || !columnas || columnas.length === 0"
        @update:opcionesSalidaTabla="handleOpcionesSalidaTabla" />

      <OpcionesInsert :sgbdSeleccionado="paramsOpcionesSGBD.sgbdSeleccionado" 
        :disabled="!datos || datos.length === 0 || !columnas || columnas.length === 0"
        @update:opcionesInsert="handleOpcionesInsert" />

      <OpcionesFormato 
        :disabled="!datos || datos.length === 0 || !columnas || columnas.length === 0"
        @update:opcionesFormato="handleOpcionesFormato" />

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
const fileInput = ref(null);
const archivoSeleccionado = ref(null);
const errorArchivo = ref("");
const urlInput = ref(null);
const urlCsv = ref("");
const cargandoUrl = ref(false);
const errorUrl = ref("");
const entradaDatosExpandida = ref(true); // Por defecto expandida

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
});

const paramsOpcionesSalida = ref({
  tiposDatosColumnas: "insert",
});

const tiposColumnasSeleccionados = ref({});

// Función para alternar el estado de colapsado/expandido de la sección de entrada
const toggleEntradaDatos = () => {
  entradaDatosExpandida.value = !entradaDatosExpandida.value;
};

// Función para formatear el tamaño del archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Función para limpiar el estado del archivo cuando se edita manualmente
const limpiarEstadoArchivo = () => {
  // Solo limpiar el estado del archivo si el contenido fue modificado significativamente
  // (más de solo espacios en blanco)
  if (archivoSeleccionado.value && contenidoCsv.value.trim().length > 0) {
    // No limpiar automáticamente, permitir edición
    // El usuario puede seguir editando el contenido del archivo cargado
  }
  errorArchivo.value = "";
};

// Función para limpiar el estado de la URL cuando se edita manualmente
const limpiarEstadoUrl = () => {
  errorUrl.value = "";
};

// Función para cargar CSV desde una URL
const cargarCsvDesdeUrl = async () => {
  errorUrl.value = "";
  cargandoUrl.value = true;
  
  // Validar que la URL no esté vacía
  if (!urlCsv.value || urlCsv.value.trim().length === 0) {
    errorUrl.value = "Por favor, ingresa una URL válida";
    cargandoUrl.value = false;
    return;
  }
  
  // Validar formato básico de URL
  let urlValida;
  try {
    urlValida = new URL(urlCsv.value.trim());
  } catch (error) {
    errorUrl.value = "La URL ingresada no es válida. Debe tener el formato: https://ejemplo.com/archivo.csv";
    cargandoUrl.value = false;
    return;
  }
  
  // Validar que sea HTTP o HTTPS
  if (!['http:', 'https:'].includes(urlValida.protocol)) {
    errorUrl.value = "La URL debe usar el protocolo HTTP o HTTPS";
    cargandoUrl.value = false;
    return;
  }
  
  try {
    // Intentar cargar el contenido desde la URL
    const response = await fetch(urlCsv.value.trim(), {
      method: 'GET',
      headers: {
        'Accept': 'text/csv,text/plain,application/csv,*/*'
      },
      mode: 'cors' // Permitir CORS si el servidor lo permite
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // Obtener el tipo de contenido
    const contentType = response.headers.get('content-type') || '';
    
    // Validar que sea texto (aunque algunos servidores pueden no enviar el header correcto)
    if (contentType && !contentType.includes('text') && !contentType.includes('csv') && !contentType.includes('plain')) {
      console.warn('El tipo de contenido no es texto plano:', contentType);
      // Continuar de todas formas, ya que algunos servidores no envían el header correcto
    }
    
    // Leer el contenido como texto
    const contenido = await response.text();
    
    // Validar que el contenido no esté vacío
    if (!contenido || contenido.trim().length === 0) {
      errorUrl.value = "El archivo CSV está vacío o no contiene datos";
      cargandoUrl.value = false;
      return;
    }
    
    // Asignar el contenido
    contenidoCsv.value = contenido;
    
    // Limpiar estados de archivo si había uno seleccionado
    if (archivoSeleccionado.value) {
      archivoSeleccionado.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
    
    // Opcionalmente colapsar la sección después de cargar (mejora UX)
    // Descomentar la siguiente línea si quieres que se colapse automáticamente
    // entradaDatosExpandida.value = false;
    
    console.log("CSV cargado desde URL exitosamente:", {
      url: urlCsv.value,
      tamaño: contenido.length,
      tipo: contentType,
      líneas: contenido.split('\n').length
    });
    
  } catch (error) {
    console.error("Error al cargar CSV desde URL:", error);
    
    // Manejar diferentes tipos de errores
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorUrl.value = "Error de conexión. Verifica que la URL sea accesible y que no haya problemas de CORS. Algunos servidores no permiten acceso desde navegadores.";
    } else if (error.message.includes('HTTP')) {
      errorUrl.value = error.message;
    } else if (error.name === 'TypeError') {
      errorUrl.value = "Error de red. Verifica tu conexión a internet y que la URL sea correcta.";
    } else {
      errorUrl.value = `Error al cargar el archivo: ${error.message}`;
    }
  } finally {
    cargandoUrl.value = false;
  }
};

// Función para validar y leer archivo CSV
const handleFileSelect = (event) => {
  errorArchivo.value = "";
  archivoSeleccionado.value = null;
  
  const file = event.target.files?.[0];
  
  if (!file) {
    return;
  }
  
  // Validar extensión del archivo (.csv o .CSV)
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.csv')) {
    errorArchivo.value = "El archivo debe tener extensión .csv o .CSV";
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }
  
  // Validar tipo MIME (texto plano)
  const validMimeTypes = [
    'text/csv',
    'text/plain',
    'application/csv',
    'text/comma-separated-values',
    'application/vnd.ms-excel' // Excel también puede generar CSV
  ];
  
  // Algunos navegadores pueden no reportar el tipo MIME correctamente,
  // así que solo validamos si está presente y no es válido
  if (file.type && file.type.length > 0 && !validMimeTypes.includes(file.type)) {
    // Verificar si el tipo contiene algo sospechoso
    if (!file.type.includes('text') && !file.type.includes('csv') && !file.type.includes('plain')) {
      errorArchivo.value = "El archivo debe ser de tipo texto plano (CSV)";
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      return;
    }
  }
  
  // Leer el contenido del archivo
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const contenido = e.target.result;
      
      // Validar que el contenido sea texto (no binario)
      if (typeof contenido !== 'string') {
        errorArchivo.value = "No se pudo leer el archivo como texto plano";
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        return;
      }
      
      // Asignar el contenido y marcar el archivo como seleccionado
      contenidoCsv.value = contenido;
      archivoSeleccionado.value = file;
      
      // Opcionalmente colapsar la sección después de cargar (mejora UX)
      // Descomentar la siguiente línea si quieres que se colapse automáticamente
      // entradaDatosExpandida.value = false;
      
      console.log("Archivo CSV cargado exitosamente:", {
        nombre: file.name,
        tamaño: file.size,
        tipo: file.type,
        contenidoLength: contenido.length
      });
      
      // Opcionalmente, evaluar automáticamente el contenido
      // evaluarContenidoCsv();
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      errorArchivo.value = "Error al leer el archivo: " + error.message;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  };
  
  reader.onerror = () => {
    errorArchivo.value = "Error al leer el archivo";
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  // Leer como texto
  reader.readAsText(file, 'UTF-8');
};

const evaluarContenidoCsv = () => {
  // Si hay un archivo seleccionado pero no hay contenido, intentar leerlo de nuevo
  if (archivoSeleccionado.value && (!contenidoCsv.value || contenidoCsv.value.trim().length === 0)) {
    handleFileSelect({ target: { files: [archivoSeleccionado.value] } });
    return;
  }
  
  // Si hay una URL pero no hay contenido, intentar cargarlo
  if (urlCsv.value && (!contenidoCsv.value || contenidoCsv.value.trim().length === 0)) {
    cargarCsvDesdeUrl();
    return;
  }
  
  if (!contenidoCsv.value || contenidoCsv.value.trim().length === 0) {
    console.warn("No hay contenido CSV para evaluar");
    const mensajeError = archivoSeleccionado.value 
      ? "No hay contenido CSV para evaluar. Por favor, selecciona un archivo."
      : urlCsv.value
      ? "No hay contenido CSV para evaluar. Por favor, carga el contenido desde la URL."
      : "No hay contenido CSV para evaluar. Por favor, selecciona un archivo, ingresa una URL o ingresa datos manualmente.";
    
    if (archivoSeleccionado.value) {
      errorArchivo.value = mensajeError;
    } else if (urlCsv.value) {
      errorUrl.value = mensajeError;
    } else {
      errorArchivo.value = mensajeError;
    }
    return;
  }
  
  // Limpiar errores si hay contenido
  errorArchivo.value = "";
  errorUrl.value = "";

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
      
      // Aplicar límite de líneas después del parseo si está configurado
      let datosProcesados = results.data || [];
      const datosAntesLimite = datosProcesados.length;
      
      // Aplicar "Saltar líneas" primero si está configurado
      // Convertir a número para asegurar que funcione correctamente
      const lineasOmitidasValue = Number(paramsOpcionesEntrada.value.lineasOmitidas) || 0;
      if (lineasOmitidasValue > 0) {
        datosProcesados = datosProcesados.slice(lineasOmitidasValue);
        console.log("Saltando líneas:", {
          lineasOmitidas: lineasOmitidasValue,
          datosAntes: datosAntesLimite,
          datosDespues: datosProcesados.length,
          primerosRegistrosSaltados: datosAntesLimite > 0 ? `Registros 1-${lineasOmitidasValue}` : 'ninguno'
        });
      }
      
      // Aplicar límite de registros (no líneas) si está configurado
      // Convertir a número para asegurar que funcione correctamente
      const limiteLineasValue = Number(paramsOpcionesEntrada.value.limiteLineas) || 0;
      if (limiteLineasValue > 0) {
        const datosAntesLimiteAplicado = datosProcesados.length;
        datosProcesados = datosProcesados.slice(0, limiteLineasValue);
        console.log("Aplicando límite de registros:", {
          limiteSolicitado: limiteLineasValue,
          datosAntes: datosAntesLimiteAplicado,
          datosDespues: datosProcesados.length,
          registrosGenerados: datosProcesados.length
        });
      }
      
      // Procesar datos según si tiene encabezados o no
      if (datosProcesados && datosProcesados.length > 0) {
        if (tieneEncabezados) {
          // Si tiene encabezados, usar los campos de meta
          if (results.meta.fields && results.meta.fields.length > 0) {
            datos.value = [...datosProcesados];
            columnas.value = [...results.meta.fields];
            console.log("Datos procesados con encabezados:", {
              columnas: columnas.value,
              cantidadDatos: datos.value.length,
              limiteAplicado: paramsOpcionesEntrada.value.limiteLineas || 'ninguno',
              datosProcesadosLength: datosProcesados.length,
              datosValueLength: datos.value.length
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
                // Usar datosProcesados que ya tiene el límite y skip aplicados
                let datosTemp = [];
                if (datosProcesados[0] && typeof datosProcesados[0] === 'object') {
                  // Verificar si la primera fila de datos coincide con los encabezados
                  const primeraFilaDatos = Object.values(datosProcesados[0] || {});
                  if (primeraFilaDatos.length === columnasPrimeraLinea.length) {
                    // Los datos ya están parseados correctamente y con límite aplicado
                    datosTemp = [...datosProcesados];
                  } else {
                    // Necesitamos reparsear sin header y luego usar la primera fila como encabezados
                    const datosSinHeader = datosProcesados.map(row => {
                      if (Array.isArray(row)) {
                        const obj = {};
                        columnasPrimeraLinea.forEach((col, idx) => {
                          obj[col] = row[idx];
                        });
                        return obj;
                      }
                      return row;
                    });
                    // Omitir la primera fila si eran encabezados (pero ya tenemos límite aplicado)
                    datosTemp = datosSinHeader.slice(1);
                  }
                } else {
                  datosTemp = [...datosProcesados];
                }
                datos.value = datosTemp;
                console.log("Columnas extraídas de la primera fila:", columnas.value);
              }
            }
          }
        } else {
          // Si el usuario dijo que NO tiene encabezados, pero detectamos que podría tenerlos,
          // intentar extraerlos de la primera fila de todas formas
          const detectadoComoEncabezados = detectarSiEsEncabezados(contenidoCsv.value, delimitadorReal);
          
          if (detectadoComoEncabezados && datosProcesados.length > 0) {
            // La primera fila probablemente son encabezados, extraerlos
            const lines = contenidoCsv.value.split('\n').filter(line => line.trim().length > 0);
            if (lines.length > 0) {
              const primeraLinea = lines[0];
              const columnasPrimeraLinea = primeraLinea.split(delimitadorReal).map(col => col.trim());
              
              if (columnasPrimeraLinea.length > 0) {
                columnas.value = columnasPrimeraLinea;
                // Omitir la primera fila que son los encabezados
                // Pero necesitamos ajustar el límite: si el usuario quiere 3 registros,
                // necesitamos tomar la primera fila (encabezados) + 3 datos = 4 filas totales
                // Como ya aplicamos el límite a datosProcesados, necesitamos verificar
                // si la primera fila está incluida y omitirla
                let datosSinEncabezados = datosProcesados;
                
                // Si la primera fila de datosProcesados parece ser encabezados, omitirla
                // Pero solo si no se aplicó skip (porque skip ya la habría omitido)
                if (!paramsOpcionesEntrada.value.lineasOmitidas || paramsOpcionesEntrada.value.lineasOmitidas === 0) {
                  datosSinEncabezados = datosProcesados.slice(1);
                }
                
                // Convertir los datos de arrays a objetos usando los encabezados
                let datosTemp = datosSinEncabezados.map(row => {
                  if (Array.isArray(row)) {
                    const obj = {};
                    columnasPrimeraLinea.forEach((col, idx) => {
                      obj[col] = row[idx];
                    });
                    return obj;
                  }
                  return row;
                });
                
                // Asegurar que tenemos exactamente el número de registros solicitados
                if (paramsOpcionesEntrada.value.limiteLineas && paramsOpcionesEntrada.value.limiteLineas > 0) {
                  datosTemp = datosTemp.slice(0, paramsOpcionesEntrada.value.limiteLineas);
                }
                
                datos.value = datosTemp;
                console.log("Encabezados detectados automáticamente aunque el checkbox estaba desmarcado:", {
                  columnas: columnas.value,
                  cantidadDatos: datos.value.length
                });
                return; // Salir temprano
              }
            }
          }
          
          // Si realmente no tiene encabezados, generar nombres de columnas automáticamente
          if (datosProcesados[0] && Array.isArray(datosProcesados[0])) {
            // Los datos vienen como arrays
            const numColumns = datosProcesados[0].length;
            columnas.value = Array.from({ length: numColumns }, (_, i) => `Columna${i + 1}`);
            let datosTemp = datosProcesados.map(row => {
              const obj = {};
              columnas.value.forEach((col, idx) => {
                obj[col] = row[idx];
              });
              return obj;
            });
            datos.value = datosTemp;
          } else if (datosProcesados[0] && typeof datosProcesados[0] === 'object') {
            // Los datos vienen como objetos (caso raro sin header)
            columnas.value = Object.keys(datosProcesados[0]);
            datos.value = [...datosProcesados];
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

  // Aplicar preview para optimizar el parseo (parsear más líneas de las necesarias para manejar skip)
  // Nota: El límite real de registros se aplicará después del parseo
  const limiteSolicitado = paramsOpcionesEntrada.value.limiteLineas || 0;
  const lineasOmitidas = paramsOpcionesEntrada.value.lineasOmitidas || 0;
  
  if (limiteSolicitado > 0 || lineasOmitidas > 0) {
    // Calcular cuántas líneas necesitamos parsear
    // Si tiene encabezados: 1 (encabezado) + lineasOmitidas + limiteSolicitado
    // Si no tiene encabezados pero podría tenerlos: lineasOmitidas + limiteSolicitado + 1 (por si acaso)
    // Si realmente no tiene encabezados: lineasOmitidas + limiteSolicitado
    let previewLines;
    if (tieneEncabezados) {
      previewLines = 1 + lineasOmitidas + limiteSolicitado;
    } else {
      // Si no tiene encabezados configurados, pero podría tenerlos, agregar 1 fila extra
      // para manejar el caso donde la primera fila son encabezados
      previewLines = lineasOmitidas + limiteSolicitado + 1;
    }
    
    parseOptions.preview = previewLines;
    
    console.log("Configurando preview para parseo:", {
      limiteSolicitado: limiteSolicitado,
      lineasOmitidas: lineasOmitidas,
      tieneEncabezados: tieneEncabezados,
      previewTotal: previewLines
    });
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