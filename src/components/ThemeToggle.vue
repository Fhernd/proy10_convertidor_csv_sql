<template>
  <button
    @click="toggleTheme"
    class="fixed top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
    <!-- Ícono de sol (modo claro) -->
    <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Ícono de luna (modo oscuro) -->
    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// Por defecto: modo oscuro
const DEFAULT_DARK = true;

// Inicializar con el estado actual del DOM
const getInitialTheme = () => {
  try {
    return document.documentElement.classList.contains('dark');
  } catch {
    return DEFAULT_DARK;
  }
};

const isDark = ref(getInitialTheme());

// Función para aplicar el tema de forma robusta
const applyTheme = (dark) => {
  try {
    const htmlElement = document.documentElement;
    if (dark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Error al aplicar tema:', error);
  }
};

// Función para alternar el tema
const toggleTheme = () => {
  const newValue = !isDark.value;
  isDark.value = newValue;
  applyTheme(newValue);
  
  try {
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    console.log('Tema cambiado a:', newValue ? 'oscuro' : 'claro');
  } catch (error) {
    console.warn('No se pudo guardar el tema en localStorage:', error);
  }
};

// Watch para aplicar cambios automáticamente
watch(isDark, (newValue) => {
  nextTick(() => {
    applyTheme(newValue);
  });
}, { immediate: false });

// Cargar y sincronizar tema al montar el componente
onMounted(() => {
  // Verificar el estado actual del DOM (aplicado por el script en index.html)
  const hasDarkClass = document.documentElement.classList.contains('dark');
  
  // Sincronizar el estado del componente con el DOM
  isDark.value = hasDarkClass;
  
  // Asegurar que el tema esté aplicado (por si acaso)
  applyTheme(isDark.value);
  
  // Verificar y guardar tema si es necesario
  try {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', DEFAULT_DARK ? 'dark' : 'light');
    }
  } catch (error) {
    // Ignorar si no se puede acceder a localStorage
  }
});
</script>

