<template>
    <div class="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
        <h1 class="text-xl font-bold text-gray-800 mb-4">Configuración de Tipos de Datos</h1>
        <p class="text-gray-600 mb-6">
            Selecciona el tipo de dato para cada columna del archivo CSV.
        </p>

        <!-- Tabla de configuración de columnas -->
        <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-3 text-left border border-gray-300">Columna</th>
                        <th class="p-3 text-left border border-gray-300">Tipo de Dato</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(column, index) in columns" :key="index" class="odd:bg-white even:bg-gray-50">
                        <!-- Nombre de la columna -->
                        <td class="p-3 border border-gray-300">
                            {{ column }}
                        </td>

                        <!-- Selector de tipo de dato -->
                        <td class="p-3 border border-gray-300">
                            <select v-model="selectedTypes[index]"
                                class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200">
                                <option value="" disabled>Selecciona un tipo de dato</option>
                                <option value="string">Texto</option>
                                <option value="number">Número</option>
                                <option value="boolean">Booleano</option>
                                <option value="date">Fecha</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Botón de guardar -->
        <div class="mt-6">
            <button @click="saveConfiguration"
                class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none">
                Guardar Configuración
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: "OpcionesSalidaColumnas",
    props: {
        // Lista de columnas a configurar
        columns: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        // Almacena los tipos seleccionados para cada columna
        const selectedTypes = ref(Array(props.columns.length).fill(""));

        // Función para guardar la configuración
        const saveConfiguration = () => {
            console.log("Configuración guardada:", selectedTypes.value);
            alert("¡Configuración guardada correctamente!");
        };

        return {
            selectedTypes,
            saveConfiguration,
        };
    },
};
</script>

<style scoped>
/* Tailwind CSS ya se carga globalmente */
</style>