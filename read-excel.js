const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'TABELA DE APARTAMENTOS ATUALIZADA .xlsx');
const workbook = XLSX.readFile(filePath);

console.log('=== SHEETS ===');
console.log(workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== ${sheetName} ===`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Show first 30 rows
    data.slice(0, 30).forEach((row, i) => {
        console.log(`Row ${i}: ${JSON.stringify(row)}`);
    });
    
    console.log(`\n... Total rows: ${data.length}`);
});
