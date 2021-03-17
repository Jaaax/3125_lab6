var fs = require('fs');
let dataRead = fs.readFileSync('data.json');
let infoRead = JSON.parse(dataRead);
return infoRead;