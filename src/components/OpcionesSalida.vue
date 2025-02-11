<template>
    <div class="p-6 bg-white shadow-md rounded-md w-full mt-5">
        <OpcionesSalidaColumnas :columns="columns" />
    </div>
</template>

<script>
import OpcionesSalidaColumnas from "./OpcionesSalidaColumnas.vue";

export default {
    components: {
        OpcionesSalidaColumnas,
    },
    data() {
        return {
            columns: ["Nombre", "Edad", "Género", "Fecha de Registro"],
        };
    },
};
</script>