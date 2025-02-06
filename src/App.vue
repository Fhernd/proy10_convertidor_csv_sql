<script setup>
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- Header con las Tabs -->
    <header class="sticky top-0 z-10 bg-white shadow-md">
      <div class="container mx-auto px-4 py-2">
        <Tabs>
          <template #default="{ activeTab }">
            <Tab label="Pestaña 1">
              <div class="p-4 bg-white shadow rounded-md">
                <h2 class="text-lg font-semibold">Contenido de Pestaña 1</h2>
                <p class="text-gray-600">Este es el contenido de la primera pestaña.</p>
              </div>
            </Tab>
            <Tab label="Pestaña 2">
              <div class="p-4 bg-white shadow rounded-md">
                <h2 class="text-lg font-semibold">Contenido de Pestaña 2</h2>
                <p class="text-gray-600">Este es el contenido de la segunda pestaña.</p>
              </div>
            </Tab>
            <Tab label="Pestaña 3">
              <div class="p-4 bg-white shadow rounded-md">
                <h2 class="text-lg font-semibold">Contenido de Pestaña 3</h2>
                <p class="text-gray-600">Este es el contenido de la tercera pestaña.</p>
              </div>
            </Tab>
          </template>
        </Tabs>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-4">App</h2>
      <p class="text-gray-700">Esta es la sección principal debajo de las pestañas.</p>
    </main>
  </div>
</template>

<style scoped></style>
