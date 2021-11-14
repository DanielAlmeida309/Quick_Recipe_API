const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
require("./rotas/rotas")(app);
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));