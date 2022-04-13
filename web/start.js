const app = require('./app');

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`);
});