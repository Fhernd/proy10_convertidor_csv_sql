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
            <Tab label="Ingreso datos">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <textarea class="w-full h-48 p-2 border border-gray-300 rounded"
                  placeholder="Escribe aquí..."></textarea>
              </div>
            </Tab>
            <Tab label="Subir archivo">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input type="file" accept=".csv" class="mt-4 p-2 border border-gray-300 rounded cursor-pointer" />
              </div>
            </Tab>
            <Tab label="URL">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input type="url" class="w-full mt-4 p-2 border border-gray-300 rounded" placeholder="Ingresa una URL válida" />
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

<style scoped>
.tab-content {
  min-height: 250px;
}
</style>
