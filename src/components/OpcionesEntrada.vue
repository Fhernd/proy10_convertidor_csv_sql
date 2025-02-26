<template>
  <div class="p-6 bg-white shadow-md rounded-md w-full">
    <!-- Título -->
    <h1 class="text-xl font-bold text-gray-800 mb-4">Parámetros de Entrada del CSV</h1>

    <!-- Checkbox: Primera fila tiene nombres de columnas -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="params.firstRowHeaders"
          class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200" />
        <span class="text-gray-700">Primera fila tiene los nombres de las columnas</span>
      </label>
    </div>

    <!-- Campo de texto: Límite de líneas a leer -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-1">Límite de líneas a leer:</label>
      <input type="number" v-model="params.limitLines" placeholder="Ingrese el límite"
        class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500" />
    </div>

    <!-- Campo de texto: Saltar líneas -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-1">Saltar líneas:</label>
      <input type="number" v-model="params.skipLines" placeholder="Ingrese el número de líneas a saltar"
        class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500" />
    </div>

    <!-- Grupo de Radio Buttons: Separador de campos -->
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2">Delimitador de campos:</label>
      <div class="grid grid-cols-3 gap-4">
        <!-- Radios (iguales a la versión anterior) -->
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
      </div>
    </div>

    <!-- Botón de enviar -->
    <button @click="submitParams"
      class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none">
      Aplicar Parámetros
    </button>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps({
  delimitador: {
    type: String,
    default: ','
  }
});

const params = ref({
  firstRowHeaders: false,
  limitLines: null,
  skipLines: null,
  separador: props.delimitador,
});

watch(() => props.delimitador, (newVal) => {
  params.value.delimitador = newVal;
});

const submitParams = () => {
  console.log("Parámetros seleccionados:", params.value);
};
</script>
