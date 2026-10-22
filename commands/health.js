//Проверка пинга

function getHealth(req, res) {
    return res.status(200).json({
        status: "OK",
    });
}

module.exports = gethealth;


