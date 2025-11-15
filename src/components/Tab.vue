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
      icon: {
        type: String,
        default: null,
      },
    },
    setup(props) {
      const registerTab = inject("registerTab");
      const activeTabIndex = inject("activeTabIndex");
      const tabs = inject("tabs");
  
      if (!registerTab) {
        console.error("El componente Tab debe estar dentro de un Tabs.");
      }
  
      const tabData = {
        label: props.label,
        icon: props.icon,
      };
  
      registerTab(tabData);
  
      const isActive = computed(() => tabs.indexOf(tabData) === activeTabIndex.value);
  
      return {
        isActive,
      };
    },
  };
  </script>
  
  <style scoped></style>
  