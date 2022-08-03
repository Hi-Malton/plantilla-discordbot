const express = require('express')
const server = express();
 
server.all('/', (req, res) => {
    res.send('Bot en funcionamiento');
});
 
function keepAlive() {
   server.listen(3000, () => { console.log("¡Funcionado!") });
}

module.exports = keepAlive;
