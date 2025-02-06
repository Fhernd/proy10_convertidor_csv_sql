<template>
    <div>
        <!-- Navegación de Tabs -->
        <div class="flex justify-center space-x-4 border-b border-gray-200">
            <button v-for="(tab, index) in tabs" :key="index" :class="[
                'py-2 px-4 text-sm font-medium focus:outline-none',
                index === activeTabIndex
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-blue-500 hover:border-blue-500'
            ]" @click="activeTabIndex = index">
                {{ tab.label }}
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