const express = require('express');
const app = express();

app.listen(3000, () => console.log('Moonscape is now running at localhost:3000!'));
app.use(express.static('public'));

