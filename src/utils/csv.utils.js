import Papa from 'papaparse';

/**
 * Detecta el delimitador de un archivo CSV.
 * 
 * @param {*} muestraCsv Cadena de texto de muestra con el contenido del archivo CSV.
 * @returns Delimitador detectado.
 */
function detectarDelimitador(muestraCsv) {
    const delimiters = [',', ';', '\t', '|', '^', '~', ':'];

    let detectedDelimiter = null;
    let maxFields = 0;

    delimiters.forEach(delimiter => {
        const parsed = Papa.parse(muestraCsv, { delimiter, preview: 5 });
        if (parsed.data.length > 0) {
            const fieldCount = parsed.data[0].length;
            if (fieldCount > maxFields) {
                maxFields = fieldCount;
                detectedDelimiter = delimiter;
            }
        }
    });

    return detectedDelimiter || ',';
}

export { detectarDelimitador };
