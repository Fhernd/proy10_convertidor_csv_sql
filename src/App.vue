<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- Header con las Tabs -->
    <header class="sticky top-0 z-10 bg-white shadow-md">
      <div class="container mx-auto max-w-screen-lg px-4 py-2">
        <Tabs>
          <template #default="{ activeTab }">
            <Tab label="Ingreso datos">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <textarea
                  class="w-full h-48 p-2 border border-gray-300 rounded"
                  placeholder="Escribe aquí..."
                ></textarea>
              </div>
            </Tab>
            <Tab label="Subir archivo">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input
                  type="file"
                  accept=".csv"
                  class="mt-4 p-2 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </Tab>
            <Tab label="URL">
              <div class="tab-content p-4 bg-white shadow rounded-md">
                <input
                  type="url"
                  class="w-full mt-4 p-2 border border-gray-300 rounded"
                  placeholder="Ingresa una URL válida"
                />
              </div>
            </Tab>
          </template>
        </Tabs>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container mx-auto max-w-screen-lg px-4 py-8">
      <OpcionesEntrada />

      <OpcionesSGBD />

      <OpcionesSalida />

      <OpcionesSalidaTabla />

      <OpcionesInsert />
    </main>
  </div>
</template>

<script setup>
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import OpcionesEntrada from "./components/OpcionesEntrada.vue";
import OpcionesSGBD from "./components/OpcionesSGBD.vue";
import OpcionesSalida from "./components/OpcionesSalida.vue";
import OpcionesSalidaTabla from "./components/OpcionesSalidaTabla.vue";
import OpcionesInsert from "./components/OpcionesInsert.vue";
</script>

<style scoped>
.tab-content {
  min-height: 250px;
}
</style>
