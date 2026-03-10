const http = require('http');

http.get('http://localhost:3008/js/map.js', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const isFixed = data.includes("isDropdownOpen = false;");
    const isFixed2 = data.includes("sel.addEventListener('change'");
    const isFixed3 = data.includes("if (isDropdownOpen) {");
    
    if (isFixed && isFixed2 && isFixed3) {
      console.log('✅ PASS: El código de map.js ha sido actualizado con el fix del dropdown.');
    } else {
      console.log('❌ FAIL: No se encuentra el fix en map.js');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
