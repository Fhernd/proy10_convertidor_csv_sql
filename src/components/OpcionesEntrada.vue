<template>
  <div class="p-6 bg-white shadow-md rounded-md w-full">
    <!-- Título -->
    <h1 class="text-xl font-bold text-gray-800 mb-4">Parámetros de Entrada del CSV</h1>

    <!-- Checkbox: Primera fila tiene nombres de columnas -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="params.primeraFilaEncabezados"
          class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200" />
        <span class="text-gray-700">Primera fila tiene los nombres de las columnas</span>
      </label>
    </div>

    <!-- Campo de texto: Límite de líneas a leer -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-1">Límite de líneas a leer:</label>
      <input type="number" v-model="params.limiteLineas" placeholder="Ingrese el límite"
        class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500" />
    </div>

    <!-- Campo de texto: Saltar líneas -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-1">Saltar líneas:</label>
      <input type="number" v-model="params.lineasOmitidas" placeholder="Ingrese el número de líneas a saltar"
        class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500" />
    </div>

    <!-- Grupo de Radio Buttons: Separador de campos -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Separador de campos:</label>
      <div class="grid grid-cols-3 gap-4">
        <!-- Radios -->
        <label class="flex items-center space-x-2">
          <input type="radio" value="auto" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>Auto detectar</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value="," v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>,</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value=";" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>;</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value=":" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>:</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value="|" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>|</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value="Tab" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>Tab</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value="^" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>^</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" value="custom" v-model="params.delimitador"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-200" />
          <span>Personalizado</span>
        </label>
      </div>

      <!-- Campo de texto para separador personalizado -->
      <div v-if="params.delimitador === 'custom'" class="mt-4">
        <label class="block text-gray-700 font-medium mb-1">Ingresar separador personalizado:</label>
        <input type="text" v-model="customDelimiter" @input="handleCustomDelimiterChange"
          placeholder="Ejemplo: ~, #, \t, etc." maxlength="10"
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
          title="Ingresa el carácter o caracteres que se usarán como separador. Para Tab usa \t" />
        <p class="mt-1 text-xs text-gray-500">
          💡 Ingresa el carácter separador. Para Tab, escribe <code class="bg-gray-100 px-1 rounded">\t</code>
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
