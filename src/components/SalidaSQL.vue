<template>
    <div class="p-6 bg-white shadow-lg rounded-lg mt-4">
        <h2 class="text-xl font-bold mb-4 text-center">Generador de SQL desde CSV</h2>

        <!-- First Row: Buttons -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
            <button v-for="(option, index) in sqlOptions" :key="index" @click="generateSQL(option.type)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {{ option.label }}
            </button>
        </div>

        <!-- Second Row: SQL Output -->
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <label class="block text-gray-700 font-bold">Salida SQL:</label>
                <button
                    @click="copiarAlPortapapeles"
                    :disabled="!sqlOutput || sqlOutput.trim().length === 0"
                    :class="[
                        'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
                        sqlOutput && sqlOutput.trim().length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                    :title="sqlOutput && sqlOutput.trim().length > 0 ? 'Copiar SQL al portapapeles' : 'No hay contenido para copiar'">
                    <svg v-if="copiadoExitoso" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{{ copiadoExitoso ? '¡Copiado!' : 'Copiar' }}</span>
                </button>
            </div>
            <textarea 
                v-model="sqlOutput"
                @click="copiarAlHacerClick"
                class="w-full p-3 border border-gray-300 rounded h-40 focus:ring focus:ring-blue-200 cursor-pointer"
                :placeholder="!props.datos || props.datos.length === 0 ? 'Primero evalúa el contenido CSV para generar SQL...' : 'Aquí se generará el código SQL...'"
                :title="sqlOutput && sqlOutput.trim().length > 0 ? 'Haz clic para copiar al portapapeles' : ''"></textarea>
            <p v-if="!props.datos || props.datos.length === 0" class="text-sm text-gray-500 mt-1">
                💡 Primero ingresa datos CSV y presiona "Evaluar contenido CSV"
            </p>
        </div>

        <!-- Third Row: File Name, Download Button, EOL Selector -->
        <div class="flex flex-wrap items-center gap-2">
            <input v-model="fileName" type="text" placeholder="Nombre del archivo de salida"
                class="p-2 border border-gray-300 rounded w-1/3 focus:ring focus:ring-blue-200">

            <button @click="downloadSQL" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Descargar SQL
            </button>

            <div class="flex items-center gap-2 ml-auto">
                <label for="eol-select" class="font-bold text-gray-700">EOL:</label>
                <select id="eol-select" v-model="eolType"
                    class="p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200">
                    <option value="\n">LF (Unix/Linux)</option>
                    <option value="\r\n">CRLF (Windows)</option>
                    <option value="\r">CR (Old Mac)</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
    datos: {
        type: Array,
        default: () => []
    },
    columnas: {
        type: Array,
        default: () => []
    },
    paramsOpcionesEntrada: {
        type: Object,
        default: () => ({})
    },
    paramsOpcionesSGBD: {
        type: Object,
        default: () => ({ sgbdSeleccionado: 'mysql' })
    },
    paramsOpcionesSalidaTabla: {
        type: Object,
        default: () => ({ tableName: 'table' })
    },
    paramsOpcionesInsert: {
        type: Object,
        default: () => ({})
    },
    tiposColumnasSeleccionados: {
        type: Object,
        default: () => ({})
    },
    paramsOpcionesFormato: {
        type: Object,
        default: () => ({})
    }
});

const sqlOptions = ref([
    { type: 'insert', label: 'CSV a SQL INSERT' },
    { type: 'update', label: 'CSV a SQL UPDATE' },
    { type: 'delete', label: 'CSV a SQL DELETE' },
    { type: 'merge', label: 'CSV a SQL MERGE' },
    { type: 'select', label: 'CSV a SQL SELECT' }
]);

// Reactive state
const sqlOutput = ref('');
const fileName = ref('query.sql');
const eolType = ref('\n');
const copiadoExitoso = ref(false);

// Function to format value based on SQL data type
const formatValueByType = (value, dataType, forceVarchar = false, useSingleQuotes = false) => {
    if (value === null || value === undefined || value === '') {
        return 'NULL';
    }

    const strValue = String(value).trim();
    
    // Determinar qué tipo de comillas usar
    const quoteChar = useSingleQuotes ? "'" : '"';
    
    // Función auxiliar para escapar comillas según el tipo
    const escapeQuotes = (str) => {
        if (useSingleQuotes) {
            // Escapar comillas simples duplicándolas
            return str.replace(/'/g, "''");
        } else {
            // Escapar comillas dobles duplicándolas
            return str.replace(/"/g, '""');
        }
    };
    
    // Si forceVarchar es true, tratar todo como VARCHAR
    if (forceVarchar) {
        return `${quoteChar}${escapeQuotes(strValue)}${quoteChar}`;
    }

    const upperType = (dataType || '').toUpperCase();
    
    // Boolean types - check first since TINYINT can be boolean
    if (upperType === 'BOOLEAN' || upperType === 'BIT') {
        const lowerValue = strValue.toLowerCase();
        if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
            return upperType === 'BIT' ? '1' : '1';
        }
        if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
            return upperType === 'BIT' ? '0' : '0';
        }
        // If it's a boolean type but value doesn't match, try parsing as number
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : (num ? '1' : '0');
    }
    
    // TINYINT - can be used for boolean (0/1) or small integers
    if (upperType === 'TINYINT') {
        const lowerValue = strValue.toLowerCase();
        // Check if it's a boolean-like value
        if (lowerValue === 'true' || lowerValue === 'yes') {
            return '1';
        }
        if (lowerValue === 'false' || lowerValue === 'no') {
            return '0';
        }
        // Otherwise treat as integer
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : Math.round(num).toString();
    }
    
    // Numeric types - no quotes (TINYINT ya se maneja arriba para booleanos)
    if (upperType === 'INT' || upperType === 'INTEGER' || upperType === 'BIGINT' || 
        upperType === 'SMALLINT' || upperType === 'MEDIUMINT') {
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : Math.round(num).toString();
    }
    
    // Decimal types - no quotes
    if (upperType === 'DECIMAL' || upperType === 'NUMERIC' || upperType === 'FLOAT' || 
        upperType === 'DOUBLE' || upperType === 'DOUBLE PRECISION' || upperType === 'REAL' || 
        upperType === 'MONEY' || upperType === 'SMALLMONEY') {
        const num = parseFloat(value);
        return isNaN(num) ? 'NULL' : num.toString();
    }
    
    // Date/Time types - wrapped in quotes (single or double based on option)
    // MySQL date/time types
    if (upperType === 'DATE' || upperType === 'TIME' || upperType === 'DATETIME' || 
        upperType === 'TIMESTAMP' || upperType === 'YEAR') {
        return `${quoteChar}${escapeQuotes(strValue)}${quoteChar}`;
    }
    
    // PostgreSQL date/time types
    if (upperType === 'TIMESTAMP WITHOUT TIME ZONE' || 
        upperType === 'TIMESTAMP WITH TIME ZONE' ||
        upperType === 'TIME WITH TIME ZONE' ||
        upperType === 'INTERVAL') {
        return `${quoteChar}${escapeQuotes(strValue)}${quoteChar}`;
    }
    
    // SQL Server date/time types
    if (upperType === 'DATETIME2' || upperType === 'SMALLDATETIME' || 
        upperType === 'DATETIMEOFFSET') {
        return `${quoteChar}${escapeQuotes(strValue)}${quoteChar}`;
    }
    
    // SQLite date/time types (DATE, TIME, DATETIME, TIMESTAMP already covered above)
    
    // String types - with quotes (single or double based on option)
    return `${quoteChar}${escapeQuotes(strValue)}${quoteChar}`;
};

// Function to get the appropriate quote character for identifiers based on SGBD
const getIdentifierQuote = () => {
    // Determine quote based on SGBD
    const sgbd = props.paramsOpcionesSGBD?.sgbdSeleccionado?.toLowerCase() || 'mysql';
    
    switch (sgbd) {
        case 'mysql':
            // MySQL uses backticks by default for identifiers with spaces/special chars
            return '`';
        case 'postgresql':
        case 'sqlite':
            // PostgreSQL and SQLite use double quotes
            return '"';
        case 'sqlserver':
            // SQL Server can use brackets or double quotes
            return '[';
        default:
            // Default to backticks for MySQL compatibility
            return '`';
    }
};

// Function to get the closing quote character (for SQL Server brackets)
const getIdentifierCloseQuote = () => {
    const sgbd = props.paramsOpcionesSGBD?.sgbdSeleccionado?.toLowerCase() || 'mysql';
    if (sgbd === 'sqlserver') {
        return ']';
    }
    return getIdentifierQuote();
};

// Function to generate SQL output
const generateSQL = (type) => {
    console.log('Generando SQL tipo:', type);
    console.log('Datos recibidos:', props.datos);
    console.log('Columnas recibidas:', props.columnas);
    console.log('Tipos de columnas:', props.tiposColumnasSeleccionados);
    console.log('Opciones tabla:', props.paramsOpcionesSalidaTabla);
    
    // Validación adicional de datos
    if (props.datos && props.datos.length > 0) {
        console.log('Primera fila de datos:', props.datos[0]);
        console.log('Tipo de primera fila:', typeof props.datos[0]);
        console.log('Claves de primera fila:', Object.keys(props.datos[0] || {}));
    }
    
    // Validar que haya datos y columnas disponibles
    if (!props.datos || !Array.isArray(props.datos) || props.datos.length === 0) {
        sqlOutput.value = '-- Error: No hay datos CSV disponibles. Por favor, evalúa primero el contenido CSV.';
        console.warn('No hay datos disponibles para generar SQL. Datos:', props.datos);
        return;
    }

    if (!props.columnas || !Array.isArray(props.columnas) || props.columnas.length === 0) {
        sqlOutput.value = '-- Error: No hay columnas disponibles. Por favor, evalúa primero el contenido CSV.';
        console.warn('No hay columnas disponibles para generar SQL. Columnas:', props.columnas);
        return;
    }

    if (type === 'insert') {
        // Get table name from paramsOpcionesSalidaTabla
        const tableName = props.paramsOpcionesSalidaTabla?.tableName || 'table';
        const quoteChar = getIdentifierQuote();
        const closeQuoteChar = getIdentifierCloseQuote();
        
        // Get column names with proper formatting
        // Validar que las columnas sean strings válidos y no contengan SQL malicioso
        const columnNames = props.columnas
            .filter(col => {
                // Filtrar columnas válidas
                if (!col || typeof col !== 'string') return false;
                const trimmed = col.trim();
                if (trimmed.length === 0) return false;
                // Rechazar si contiene palabras clave SQL peligrosas que podrían indicar datos malformados
                const upperCol = trimmed.toUpperCase();
                if (upperCol.includes('INSERT INTO') || upperCol.includes('VALUES') || 
                    upperCol.includes('SELECT') || upperCol.includes('DELETE') ||
                    upperCol.includes('UPDATE') || upperCol.includes('DROP')) {
                    console.warn('Columna rechazada por contener SQL:', col);
                    return false;
                }
                return true;
            })
            .map((col) => {
                let columnName = col.trim();
                
                // Si replaceSpaces está activado, reemplazar espacios con guiones bajos
                if (props.paramsOpcionesSalidaTabla?.replaceSpaces) {
                    columnName = columnName.replace(/\s+/g, '_');
                }
                
                // Eliminar saltos de línea y caracteres de control
                columnName = columnName.replace(/[\r\n\t]/g, ' ');
                // Normalizar espacios múltiples a uno solo
                columnName = columnName.replace(/\s+/g, ' ').trim();
                
                // Limpiar el nombre de columna de caracteres peligrosos pero mantener espacios si no se reemplazan
                // Solo eliminar caracteres que definitivamente causan problemas SQL
                const cleanName = columnName.replace(/[`"'\[\];]/g, '');
                
                // Validar que el nombre no esté vacío después de la limpieza
                if (!cleanName || cleanName.length === 0) {
                    console.warn('Nombre de columna vacío después de limpieza:', col);
                    return null;
                }
                
                return `${quoteChar}${cleanName}${closeQuoteChar}`;
            })
            .filter(name => name !== null)
            .join(', ');
        
        if (!columnNames || columnNames.length === 0) {
            sqlOutput.value = '-- Error: No se pudieron obtener nombres de columnas válidos.';
            console.error('Error: columnNames vacío', { columnas: props.columnas });
            return;
        }
        
        console.log('Nombres de columnas formateados:', columnNames);
        console.log('Columnas originales:', props.columnas);
        
        // Format table name with quotes if needed
        const formattedTableName = tableName.includes(' ') || tableName.includes('-')
            ? `${quoteChar}${tableName}${closeQuoteChar}`
            : tableName;
        
        // Aplicar skip y límite si están configurados en paramsOpcionesEntrada
        // Nota: Los datos ya deberían venir limitados desde App.vue, pero aplicamos
        // skip y límite aquí también por seguridad y para manejar cambios dinámicos
        let datosParaGenerar = props.datos;
        
        // Convertir a números para asegurar que funcionen correctamente
        const lineasOmitidasValue = Number(props.paramsOpcionesEntrada?.lineasOmitidas) || 0;
        const limiteLineasValue = Number(props.paramsOpcionesEntrada?.limiteLineas) || 0;
        
        // Aplicar skip primero si está configurado
        if (lineasOmitidasValue > 0) {
            const datosAntesSkip = datosParaGenerar.length;
            datosParaGenerar = datosParaGenerar.slice(lineasOmitidasValue);
            console.log('Aplicando skip en generación SQL:', {
                lineasOmitidas: lineasOmitidasValue,
                datosAntes: datosAntesSkip,
                datosDespues: datosParaGenerar.length,
                primerosRegistrosSaltados: datosAntesSkip > 0 ? `Registros 1-${lineasOmitidasValue}` : 'ninguno'
            });
        }
        
        // Aplicar límite después del skip si está configurado
        if (limiteLineasValue > 0) {
            const datosAntesLimite = datosParaGenerar.length;
            datosParaGenerar = datosParaGenerar.slice(0, limiteLineasValue);
            console.log('Aplicando límite en generación SQL:', {
                limiteSolicitado: limiteLineasValue,
                datosAntes: datosAntesLimite,
                datosDespues: datosParaGenerar.length,
                registrosGenerados: datosParaGenerar.length
            });
        }
        
        // Verificar si todos los campos deben ser VARCHAR
        const allVarchar = props.paramsOpcionesSalidaTabla?.allVarchar || false;
        const createView = props.paramsOpcionesSalidaTabla?.createView || false;
        const dropTable = props.paramsOpcionesSalidaTabla?.dropTable || false;
        const sgbd = props.paramsOpcionesSGBD?.sgbdSeleccionado?.toLowerCase() || 'mysql';
        
        // Verificar si se debe usar REPLACE en lugar de INSERT
        const useReplace = props.paramsOpcionesInsert?.useReplace || false;
        let additionalPhrase = props.paramsOpcionesInsert?.additionalPhrase || '';
        const enableInsertMultipleClauses = props.paramsOpcionesInsert?.enableInsertMultipleClauses || false;
        const insertMultipleClauses = Number(props.paramsOpcionesInsert?.insertMultipleClauses) || 0;
        
        // Validar frase adicional según el SGBD
        const validPhrasesBySGBD = {
            mysql: ['IGNORE', 'LOW_PRIORITY', 'HIGH_PRIORITY', 'DELAYED'],
            postgresql: [],
            sqlite: [],
            sqlserver: []
        };
        
        const validPhrases = validPhrasesBySGBD[sgbd] || [];
        const phraseUpper = additionalPhrase.trim().toUpperCase();
        
        // Si se usa REPLACE, no se permiten modificadores adicionales
        if (useReplace && additionalPhrase.trim()) {
            console.warn(`REPLACE no soporta modificadores adicionales. Se omitirá "${additionalPhrase}".`);
            additionalPhrase = '';
        }
        
        // Si la frase no es válida para el SGBD, limpiarla
        if (additionalPhrase.trim() && !validPhrases.includes(phraseUpper)) {
            console.warn(`Frase adicional "${additionalPhrase}" no es válida para ${sgbd}. Se omitirá.`);
            additionalPhrase = '';
        }
        
        // Determinar la palabra clave a usar (INSERT o REPLACE)
        const insertKeyword = useReplace ? 'REPLACE' : 'INSERT';
        
        // Construir la frase adicional si existe y es válida (solo para INSERT)
        const keywordWithPhrase = (!useReplace && additionalPhrase.trim()) 
            ? `${insertKeyword} ${additionalPhrase.trim().toUpperCase()}` 
            : insertKeyword;
        
        console.log('Configuración de inserción:', {
            useReplace: useReplace,
            insertKeyword: insertKeyword,
            keywordWithPhrase: keywordWithPhrase,
            additionalPhrase: additionalPhrase,
            enableInsertMultipleClauses: enableInsertMultipleClauses,
            insertMultipleClauses: insertMultipleClauses
        });
        
        // Función para generar definiciones de columnas para CREATE TABLE
        const generateColumnDefinitions = () => {
            const primaryKeyColumns = props.paramsOpcionesSalidaTabla?.primaryKeyColumns || [];
            const hasPrimaryKey = primaryKeyColumns.length > 0;
            
            // Función auxiliar para formatear nombre de columna
            const formatColumnName = (col) => {
                let columnName = col.trim();
                
                // Si replaceSpaces está activado, reemplazar espacios con guiones bajos
                if (props.paramsOpcionesSalidaTabla?.replaceSpaces) {
                    columnName = columnName.replace(/\s+/g, '_');
                }
                
                // Eliminar saltos de línea y caracteres de control
                columnName = columnName.replace(/[\r\n\t]/g, ' ');
                // Normalizar espacios múltiples a uno solo
                columnName = columnName.replace(/\s+/g, ' ').trim();
                
                // Limpiar el nombre de columna de caracteres peligrosos
                return columnName.replace(/[`"'\[\];]/g, '');
            };
            
            // Generar definiciones de columnas
            const columnDefs = props.columnas
                .filter(col => col && typeof col === 'string' && col.trim().length > 0)
                .map((col) => {
                    const cleanName = formatColumnName(col);
                    const formattedColumnName = `${quoteChar}${cleanName}${closeQuoteChar}`;
                    
                    // Obtener el tipo de dato
                    let dataType = 'VARCHAR(255)';
                    if (allVarchar) {
                        // Determinar el tipo VARCHAR según el SGBD
                        switch (sgbd) {
                            case 'mysql':
                                dataType = 'VARCHAR(255)';
                                break;
                            case 'postgresql':
                                dataType = 'VARCHAR(255)';
                                break;
                            case 'sqlite':
                                dataType = 'TEXT';
                                break;
                            case 'sqlserver':
                                dataType = 'VARCHAR(255)';
                                break;
                            default:
                                dataType = 'VARCHAR(255)';
                        }
                    } else {
                        const selectedType = props.tiposColumnasSeleccionados?.[col] || 'VARCHAR';
                        dataType = selectedType;
                        
                        // Agregar tamaño por defecto para tipos de string si no lo tienen
                        const upperType = dataType.toUpperCase();
                        if ((upperType === 'VARCHAR' || upperType === 'CHAR' || upperType === 'NVARCHAR' || upperType === 'NCHAR') && 
                            !dataType.includes('(')) {
                            // Agregar tamaño por defecto según el SGBD
                            if (sgbd === 'sqlserver' && (upperType === 'NVARCHAR' || upperType === 'NCHAR')) {
                                dataType += '(255)';
                            } else {
                                dataType += '(255)';
                            }
                        }
                        
                        // Para tipos numéricos DECIMAL/NUMERIC sin parámetros, agregar (10,2) por defecto
                        if ((upperType === 'DECIMAL' || upperType === 'NUMERIC') && !dataType.includes('(')) {
                            dataType += '(10,2)';
                        }
                    }
                    
                    return `    ${formattedColumnName} ${dataType}`;
                });
            
            // Agregar definición de PRIMARY KEY si hay columnas seleccionadas
            if (hasPrimaryKey) {
                const pkColumnNames = primaryKeyColumns
                    .filter(col => props.columnas.includes(col))
                    .map(col => {
                        const cleanName = formatColumnName(col);
                        return `${quoteChar}${cleanName}${closeQuoteChar}`;
                    })
                    .join(', ');
                
                if (pkColumnNames) {
                    columnDefs.push(`    PRIMARY KEY (${pkColumnNames})`);
                }
            }
            
            return columnDefs.join(',\n');
        };
        
        // Construir el SQL completo
        let sqlStatements = [];
        
        // Verificar si hay llave primaria seleccionada
        const primaryKeyColumns = props.paramsOpcionesSalidaTabla?.primaryKeyColumns || [];
        const hasPrimaryKey = primaryKeyColumns.length > 0;
        
        // Si hay llave primaria seleccionada, "Eliminar tabla si existe" está activado, o "Crear vista" está activado,
        // generar DROP TABLE y CREATE TABLE
        if (hasPrimaryKey || dropTable || createView) {
            // 1. Eliminar la tabla si existe (siempre cuando hay llave primaria o dropTable está activado)
            if (hasPrimaryKey || dropTable) {
                sqlStatements.push(`DROP TABLE IF EXISTS ${formattedTableName};`);
            }
            
            // 2. Definir la tabla según el nombre y los tipos de datos de las columnas
            const columnDefinitions = generateColumnDefinitions();
            if (hasPrimaryKey || dropTable) {
                // Si hay llave primaria o dropTable, usar CREATE TABLE (sin IF NOT EXISTS)
                sqlStatements.push(`CREATE TABLE ${formattedTableName} (\n${columnDefinitions}\n);`);
            } else if (createView) {
                // Si solo createView está activado, usar CREATE TABLE IF NOT EXISTS
                sqlStatements.push(`CREATE TABLE IF NOT EXISTS ${formattedTableName} (\n${columnDefinitions}\n);`);
            }
            sqlStatements.push(''); // Línea en blanco
        }
        
        // Generate INSERT/REPLACE statements
        // Obtener la opción de comillas simples una sola vez
        const useSingleQuotes = props.paramsOpcionesFormato?.useSingleQuotes || false;
        
        // Función auxiliar para generar los valores de una fila
        const generateRowValues = (row, rowIndex) => {
            // Validar que row sea un objeto válido
            if (!row || typeof row !== 'object') {
                console.warn(`Fila ${rowIndex} no es un objeto válido:`, row);
                return null;
            }
            
            const values = props.columnas
                .filter(col => col && typeof col === 'string' && col.trim().length > 0)
                .map((col) => {
                    // Obtener el valor de la fila usando la clave de columna
                    let value = row[col];
                    
                    // Si el valor es undefined o la clave no existe, intentar obtenerlo de otra forma
                    if (value === undefined && row.hasOwnProperty && !row.hasOwnProperty(col)) {
                        // Intentar buscar la clave sin espacios o con diferentes formatos
                        const keys = Object.keys(row);
                        const matchingKey = keys.find(k => k.trim() === col.trim());
                        if (matchingKey) {
                            value = row[matchingKey];
                        }
                    }
                    
                    // Si allVarchar está activado, usar 'VARCHAR' como tipo, sino usar el tipo seleccionado
                    const dataType = allVarchar ? 'VARCHAR' : (props.tiposColumnasSeleccionados?.[col] || 'VARCHAR');
                    return formatValueByType(value, dataType, allVarchar, useSingleQuotes);
                }).join(', ');
            
            if (!values || values.length === 0) {
                console.warn(`Fila ${rowIndex} no tiene valores válidos:`, row);
                return null;
            }
            
            return `(${values})`;
        };
        
        // Generar statements según la configuración
        let insertStatements = [];
        
        if (enableInsertMultipleClauses) {
            // Modo múltiples cláusulas: agrupar valores en una o más sentencias
            const chunkSize = insertMultipleClauses > 0 ? insertMultipleClauses : datosParaGenerar.length;
            const validRows = [];
            
            // Generar todos los valores primero
            datosParaGenerar.forEach((row, rowIndex) => {
                const rowValues = generateRowValues(row, rowIndex);
                if (rowValues) {
                    validRows.push(rowValues);
                }
            });
            
            // Agrupar en chunks según el tamaño especificado
            for (let i = 0; i < validRows.length; i += chunkSize) {
                const chunk = validRows.slice(i, i + chunkSize);
                const valuesClause = chunk.join(',\n    ');
                const statement = `${keywordWithPhrase} INTO ${formattedTableName} (${columnNames}) VALUES \n    ${valuesClause};`;
                insertStatements.push(statement);
            }
            
            console.log('Generando INSERT/REPLACE con múltiples cláusulas:', {
                totalRegistros: validRows.length,
                chunkSize: chunkSize,
                totalSentencias: insertStatements.length
            });
        } else {
            // Modo normal: una sentencia por registro
            datosParaGenerar.forEach((row, rowIndex) => {
                const rowValues = generateRowValues(row, rowIndex);
                if (rowValues) {
                    insertStatements.push(`${keywordWithPhrase} INTO ${formattedTableName} (${columnNames}) VALUES ${rowValues};`);
                }
            });
        }
        
        sqlStatements.push(...insertStatements);
        
        // Si createView está activado, crear la vista después de los INSERT/REPLACE statements
        if (createView) {
            // Generar nombre de vista (nombre_tabla_view)
            let viewNameBase = `${tableName}_view`;
            const formattedViewName = viewNameBase.includes(' ') || viewNameBase.includes('-')
                ? `${quoteChar}${viewNameBase}${closeQuoteChar}`
                : viewNameBase;
            
            sqlStatements.push(''); // Línea en blanco
            // DROP VIEW si existe (para evitar errores si la vista ya existe)
            sqlStatements.push(`DROP VIEW IF EXISTS ${formattedViewName};`);
            sqlStatements.push(`CREATE VIEW ${formattedViewName} AS`);
            sqlStatements.push(`SELECT ${columnNames}`);
            sqlStatements.push(`FROM ${formattedTableName};`);
        }
        
        const sql = sqlStatements.join('\n');
        sqlOutput.value = sql;
        console.log('SQL generado exitosamente:', {
            registrosGenerados: datosParaGenerar.length,
            caracteres: sql.length
        });
    } else {
        sqlOutput.value = `-- SQL Generated for ${type.toUpperCase()}\nSELECT * FROM table;`;
    }
};

// Función auxiliar para copiar al portapapeles (reutilizable)
const copiarTextoAlPortapapeles = async (texto) => {
    try {
        // Usar la Clipboard API moderna
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        
        // Fallback para navegadores que no soportan Clipboard API
        try {
            // Crear un elemento textarea temporal
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            // Intentar copiar usando el comando execCommand (deprecated pero funciona como fallback)
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            return successful;
        } catch (fallbackError) {
            console.error('Error en fallback de copia:', fallbackError);
            return false;
        }
    }
};

// Función para mostrar feedback visual de copia exitosa
const mostrarFeedbackCopia = () => {
    copiadoExitoso.value = true;
    setTimeout(() => {
        copiadoExitoso.value = false;
    }, 2000);
};

// Function to copy SQL to clipboard (desde el botón)
const copiarAlPortapapeles = async () => {
    // Verificar que haya contenido
    if (!sqlOutput.value || sqlOutput.value.trim().length === 0) {
        return;
    }
    
    const exito = await copiarTextoAlPortapapeles(sqlOutput.value);
    
    if (exito) {
        mostrarFeedbackCopia();
        console.log('SQL copiado al portapapeles exitosamente');
    } else {
        alert('No se pudo copiar al portapapeles. Por favor, selecciona el texto manualmente.');
    }
};

// Función para copiar al hacer clic en el textarea
const copiarAlHacerClick = async (event) => {
    // Verificar que haya contenido
    if (!sqlOutput.value || sqlOutput.value.trim().length === 0) {
        return;
    }
    
    // Prevenir la selección de texto por defecto si se desea
    // Pero permitir que el usuario pueda seleccionar si lo necesita
    // Solo copiar si no hay texto seleccionado (click simple sin selección)
    const selection = window.getSelection().toString();
    if (selection && selection.length > 0) {
        // Si hay texto seleccionado, no copiar automáticamente
        // Permitir que el usuario seleccione manualmente si lo desea
        return;
    }
    
    const exito = await copiarTextoAlPortapapeles(sqlOutput.value);
    
    if (exito) {
        mostrarFeedbackCopia();
        console.log('SQL copiado al portapapeles al hacer clic en el textarea');
        
        // Opcional: seleccionar todo el texto para feedback visual
        event.target.select();
        
        // Deseleccionar después de un breve momento para mejor UX
        setTimeout(() => {
            event.target.setSelectionRange(0, 0);
        }, 100);
    }
};

// Function to download SQL file
const downloadSQL = () => {
    const blob = new Blob([sqlOutput.value.replace(/\n/g, eolType.value)], { type: "text/sql" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName.value;
    link.click();
};
</script>

<style scoped></style>
