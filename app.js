const express = require("express");
const app = express();
const linksRouter = require("./routes/links");
app.use(express.json());


app.use(express.json());

app.use("/api/v1/links", linksRouter);




app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        console.error("[validation]", req.url, err.message);

        return res.status(400).json({
            name: "Ошибка данных",
            error: err.message,
        });
    }

    console.error("[ERR]", req.url, err.message);

    return res.status(500).json({
        name: "Внутренняя ошибка сервера",
        error: "Произошла внутренняя ошибка сервера",
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});