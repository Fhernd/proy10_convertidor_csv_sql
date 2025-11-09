import Papa from 'papaparse';

/**
 * Detecta el delimitador de un archivo CSV.
 * 
 * @param {*} muestraCsv Cadena de texto de muestra con el contenido del archivo CSV.
 * @returns Delimitador detectado.
 */
function detectarDelimitador(muestraCsv) {
    if (!muestraCsv || muestraCsv.trim().length === 0) {
        return ',';
    }

    const delimiters = [',', ';', '\t', '|', '^', '~', ':'];
    
    // Obtener las primeras líneas para análisis
    const lines = muestraCsv.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
    if (lines.length === 0) {
        return ',';
    }

    let detectedDelimiter = null;
    let maxFields = 0;
    let maxConsistency = 0;

    delimiters.forEach(delimiter => {
        let totalFields = 0;
        let fieldCounts = [];
        let consistency = 0;

        // Analizar cada línea
        lines.forEach(line => {
            const parsed = Papa.parse(line, { 
                delimiter, 
                preview: 1,
                skipEmptyLines: false
            });
            
            if (parsed.data.length > 0 && parsed.data[0].length > 0) {
                const fieldCount = parsed.data[0].length;
                fieldCounts.push(fieldCount);
                totalFields += fieldCount;
            }
        });

        // Calcular consistencia (todas las líneas deberían tener el mismo número de campos)
        if (fieldCounts.length > 0) {
            const avgFields = totalFields / fieldCounts.length;
            const firstCount = fieldCounts[0];
            
            // Verificar que todas las líneas tengan el mismo número de campos
            const allSame = fieldCounts.every(count => count === firstCount);
            
            // Preferir delimitadores que produzcan más campos y sean consistentes
            if (allSame && firstCount > 1) {
                consistency = firstCount;
            }
        }

        // Preferir el delimitador con más campos consistentes
        if (consistency > maxConsistency || 
            (consistency === maxConsistency && totalFields > maxFields)) {
            maxConsistency = consistency;
            maxFields = totalFields;
            detectedDelimiter = delimiter;
        }
    });

    return detectedDelimiter || ',';
}

/**
 * Convierte el valor del delimitador de la UI al carácter real.
 * 
 * @param {string} delimitador Valor del delimitador desde la UI (puede ser "Tab", "auto", etc.)
 * @param {string} contenidoCsv Contenido CSV para auto-detección si es necesario
 * @returns Carácter delimitador real
 */
function obtenerDelimitadorReal(delimitador, contenidoCsv = '') {
    if (delimitador === 'auto') {
        return detectarDelimitador(contenidoCsv);
    }
    if (delimitador === 'Tab' || delimitador === '\t') {
        return '\t';
    }
    return delimitador || ',';
}

export { detectarDelimitador, obtenerDelimitadorReal };
