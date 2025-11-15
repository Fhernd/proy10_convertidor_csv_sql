<template>
    <div>
        <!-- Navegación de Tabs -->
        <div class="flex justify-center space-x-4 border-b border-gray-200">
            <button v-for="(tab, index) in tabs" :key="index" :class="[
                'flex items-center gap-2 py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200',
                index === activeTabIndex
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-blue-500 hover:border-blue-500'
            ]" @click="activeTabIndex = index">
                <!-- Ícono de Ingreso datos -->
                <svg v-if="tab.icon === 'edit'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <!-- Ícono de Subir archivo -->
                <svg v-else-if="tab.icon === 'upload'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <!-- Ícono de URL -->
                <svg v-else-if="tab.icon === 'link'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- Contenido de las Tabs -->
        <div class="mt-4">
            <slot />
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

        provide("registerTab", (tab) => {
            tabs.push(tab);
        });

        provide("activeTabIndex", activeTabIndex);
        provide("tabs", tabs);

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

<style scoped></style>