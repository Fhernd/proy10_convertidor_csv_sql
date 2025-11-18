<template>
  <div class="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md w-full transition-colors duration-300">
    <!-- Título -->
    <h1 class="text-xl font-bold mb-4 flex items-center gap-2">
      <span class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Parámetros de Entrada del CSV</span>
    </h1>

    <!-- Checkbox: Primera fila tiene nombres de columnas -->
    <div class="mb-4">
        <label class="flex items-center space-x-2 cursor-pointer group dark-hover-label">
        <input type="checkbox" v-model="params.primeraFilaEncabezados"
          class="h-5 w-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-all duration-200 group-hover:border-blue-400" />
        <span class="text-gray-700 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100 dark-hover-text transition-colors">Primera fila tiene los nombres de las columnas</span>
      </label>
    </div>

    <!-- Campo de texto: Límite de líneas a leer -->
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-100 font-medium mb-1">Límite de líneas a leer:</label>
      <input type="number" v-model="params.limiteLineas" placeholder="Ingrese el límite"
        class="w-full p-2.5 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300" />
    </div>

    <!-- Campo de texto: Saltar líneas -->
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-100 font-medium mb-1">Saltar líneas:</label>
      <input type="number" v-model="params.lineasOmitidas" placeholder="Ingrese el número de líneas a saltar"
        class="w-full p-2.5 border-2 border-purple-300 dark:border-purple-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:border-purple-500 dark:focus:border-purple-400 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300" />
    </div>

    <!-- Grupo de Radio Buttons: Separador de campos -->
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-100 font-medium mb-2">Separador de campos:</label>
      <div class="grid grid-cols-3 gap-3">
        <!-- Radios -->
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="auto" v-model="params.delimitador"
            class="h-4 w-4 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-white dark-hover-text transition-colors">Auto detectar</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="," v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-white dark-hover-text transition-colors font-mono">,</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value=";" v-model="params.delimitador"
            class="h-4 w-4 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-white dark-hover-text transition-colors font-mono">;</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value=":" v-model="params.delimitador"
            class="h-4 w-4 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-white dark-hover-text transition-colors font-mono">:</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="|" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-white dark-hover-text transition-colors font-mono">|</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="Tab" v-model="params.delimitador"
            class="h-4 w-4 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-white dark-hover-text transition-colors">Tab</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="^" v-model="params.delimitador"
            class="h-4 w-4 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-white dark-hover-text transition-colors font-mono">^</span>
        </label>
        <label class="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-colors duration-200 group dark-hover-label">
          <input type="radio" value="custom" v-model="params.delimitador"
            class="h-4 w-4 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-all" />
          <span class="text-gray-700 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-white dark-hover-text transition-colors font-semibold">Personalizado</span>
        </label>
      </div>

      <!-- Campo de texto para separador personalizado -->
      <div v-if="params.delimitador === 'custom'" class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-700 shadow-sm">
        <label class="block text-gray-700 dark:text-gray-100 font-medium mb-2">Ingresar separador personalizado:</label>
        <input type="text" v-model="customDelimiter" @input="handleCustomDelimiterChange"
          placeholder="Ejemplo: ~, #, \t, etc." maxlength="10"
          class="w-full p-2.5 border-2 border-purple-300 dark:border-purple-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:border-purple-500 dark:focus:border-purple-400 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300"
          title="Ingresa el carácter o caracteres que se usarán como separador. Para Tab usa \t" />
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-100">
          💡 Ingresa el carácter separador. Para Tab, escribe <code class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 px-2 py-1 rounded font-mono">\t</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['update:params']);

const props = defineProps({
  delimitador: {
    type: String,
    default: ','
  }
});

const customDelimiter = ref('');

const params = ref({
  primeraFilaEncabezados: true, // Por defecto asumimos que hay encabezados (caso más común)
  limiteLineas: 0,
  lineasOmitidas: 0,
  delimitador: props.delimitador,
});

// Función para manejar cambios en el separador personalizado
const handleCustomDelimiterChange = () => {
  if (params.value.delimitador === 'custom' && customDelimiter.value) {
    // Emitir el valor personalizado como delimitador
    // La función obtenerDelimitadorReal se encargará de convertir \t, etc.
    emit('update:params', {
      ...params.value,
      delimitador: customDelimiter.value
    });
  } else if (params.value.delimitador === 'custom' && !customDelimiter.value) {
    // Si se selecciona custom pero no hay valor, mantener 'custom' temporalmente
    emit('update:params', params.value);
  }
};

watch(() => props.delimitador, (newVal) => {
  params.value.delimitador = newVal;
  // Si cambia a otro valor que no sea custom, limpiar el separador personalizado
  if (newVal !== 'custom') {
    customDelimiter.value = '';
  }
});

watch(params, (newVal) => {
  // Si el delimitador es 'custom', usar el valor personalizado si existe
  if (newVal.delimitador === 'custom') {
    if (customDelimiter.value) {
      // Emitir el valor personalizado como delimitador
      emit('update:params', {
        ...newVal,
        delimitador: customDelimiter.value
      });
    }
    // Si no hay valor personalizado aún, no emitir (esperar a que el usuario lo ingrese)
  } else {
    // Para cualquier otro delimitador, emitir normalmente
    emit('update:params', newVal);
  }
}, { deep: true });
</script>
