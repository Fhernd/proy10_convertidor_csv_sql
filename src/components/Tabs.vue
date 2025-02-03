<!-- Tabs.vue -->
<template>
    <div class="tabs">
        <!-- Pestañas (navegación) -->
        <div class="tabs-navigation">
            <button v-for="(tab, index) in tabs" :key="index" :class="{ active: index === activeTabIndex }"
                @click="activeTabIndex = index">
                {{ tab.label }}
            </button>
        </div>
        <!-- Contenido de las pestañas -->
        <div class="tabs-content">
            <slot :active-tab="tabs[activeTabIndex]" />
        </div>
    </div>
</template>

<script>
import { ref, provide, reactive, onMounted } from "vue";

export default {
    name: "Tabs",
    setup(_, { slots }) {
        const tabs = reactive([]);
        const activeTabIndex = ref(0);

        // Proveer las pestañas para los componentes hijos (Tab)
        provide("registerTab", (tab) => {
            tabs.push(tab);
        });

        onMounted(() => {
            if (tabs.length === 0) {
                console.warn("No se han registrado pestañas.");
            }
        });

        return {
            tabs,
            activeTabIndex,
        };
    },
};
</script>

<style>
.tabs-navigation {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.tabs-navigation button {
    padding: 0.5rem 1rem;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
}

.tabs-navigation button.active {
    background: #007bff;
    color: white;
}

.tabs-content {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>
