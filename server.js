const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const pricesFile = path.join(__dirname, "prices.json");
const ordersFile = path.join(__dirname, "orders.json");

const DEFAULT_PRICES = {
    chicken: 260,
    bontha: 340,
    pharam: 250,
    boneless: 270,
    legs: 50,
    wings: 40
};

function readPrices() {
    try {
        if (fs.existsSync(pricesFile)) {
            return {
                ...DEFAULT_PRICES,
                ...JSON.parse(
                    fs.readFileSync(pricesFile, "utf8")
                )
            };
        }
    } catch (error) {
        console.log("Price file error:", error);
    }

    return DEFAULT_PRICES;
}

function savePrices(prices) {
    fs.writeFileSync(
        pricesFile,
        JSON.stringify(prices, null, 2)
    );
}

if (!fs.existsSync(pricesFile)) {
    savePrices(DEFAULT_PRICES);
}


/* CUSTOMER WEBSITE */

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "shop.html")
    );
});

app.get("/shop.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "shop.html")
    );
});


/* ADMIN PRICE PAGE */

app.get("/admin.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "admin.html")
    );
});


/* GET CURRENT PRICES */

app.get("/api/prices", (req, res) => {
    res.json(readPrices());
});


/* UPDATE PRICES */

app.post("/api/prices", (req, res) => {

    const password =
        req.headers["x-owner-password"];

    if (password !== "Srinivas@9666") {

        return res.status(401).json({
            success: false,
            message: "Wrong owner password"
        });

    }

    const oldPrices = readPrices();

    const keys = [
        "chicken",
        "bontha",
        "pharam",
        "boneless",
        "legs",
        "wings"
    ];

    const updatedPrices = {
        ...oldPrices
    };

    for (const key of keys) {

        const value = Number(req.body[key]);

        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid price: " + key
            });

        }

        updatedPrices[key] = value;
    }

    savePrices(updatedPrices);

    res.json({
        success: true,
        prices: updatedPrices
    });

});


/* SAVE ORDERS */

app.post("/api/orders", (req, res) => {

    const order = {

        id: Date.now(),

        date: new Date().toLocaleString("en-IN"),

        status: "Pending",

        ...req.body

    };

    let orders = [];

    try {

        if (fs.existsSync(ordersFile)) {

            orders = JSON.parse(
                fs.readFileSync(
                    ordersFile,
                    "utf8"
                )
            );

        }

    } catch (error) {

        console.log("Orders file error");

        orders = [];

    }

    orders.push(order);

    fs.writeFileSync(
        ordersFile,
        JSON.stringify(
            orders,
            null,
            2
        )
    );

    res.json({
        success: true,
        orderId: order.id
    });

});


/* START SERVER */

const PORT =
    process.env.PORT || 3000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================"
        );

        console.log(
            "🐔 Srinivas Chicken Website"
        );

        console.log(
            "Server running on port " + PORT
        );

        console.log(
            "Open: http://localhost:" + PORT
        );

        console.log(
            "================================"
        );

    }
);
