<template>
    <div v-if="isActive">
        <slot />
    </div>
</template>

<script>
import { inject, computed } from "vue";

export default {
    name: "Tab",
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const registerTab = inject("registerTab");
        if (!registerTab) {
            console.error("El componente Tab debe estar dentro de un Tabs.");
        }

        const tabData = {
            label: props.label,
        };

        registerTab(tabData);

        const isActive = computed(() => tabData === inject("tabs")[inject("activeTabIndex")]);

        return {
            isActive,
        };
    },
};
</script>