<script setup>

</script>

<template>
  <main>
    <h2>App</h2>
    <Tabs>
      <template #default="{ activeTab }">
        <Tab label="Pestaña 1">
          <h2>Contenido de Pestaña 1</h2>
          <p>Este es el contenido de la primera pestaña.</p>
        </Tab>
        <Tab label="Pestaña 2">
          <h2>Contenido de Pestaña 2</h2>
          <p>Este es el contenido de la segunda pestaña.</p>
        </Tab>
        <Tab label="Pestaña 3">
          <h2>Contenido de Pestaña 3</h2>
          <p>Este es el contenido de la tercera pestaña.</p>
        </Tab>
      </template>
    </Tabs>
  </main>
</template>

<script setup>
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
</script>

<style scoped></style>
