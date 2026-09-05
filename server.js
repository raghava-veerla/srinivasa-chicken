const express = require("express");
const fs = require("fs");
const session = require("express-session");

const app = express();




app.use(express.json());

app.use(session({
    secret: "call me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}));


// ===============================
// ADMIN LOGIN
// ===============================



// ===============================
// ADMIN SECURITY
// ===============================


// ===============================
// CUSTOMER PAGE
// ===============================

app.get("/shop.html", (req, res) => {
    res.sendFile(__dirname + "/shop.html");
});


// ===============================
// ADMIN LOGIN PAGE
// ===============================



// ===============================
// PROTECTED ADMIN PAGE
// ===============================



// ===============================
// CUSTOMER PLACES ORDER
// ===============================

app.post("/api/orders", (req, res) => {

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        status: "Pending",
        ...req.body
    };

    let orders = [];

    const ordersFile = __dirname + "/orders.json";

    if (fs.existsSync(ordersFile)) {

        try {
            orders = JSON.parse(
                fs.readFileSync(ordersFile, "utf8")
            );
        } catch {
            orders = [];
        }

    }

    orders.push(order);

    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders, null, 2)
    );

    res.json({
        success: true,
        message: "Order placed successfully!",
        orderId: order.id
    });
});


// ===============================
// ADMIN GETS ORDERS
// ===============================


// ===============================
// ADMIN CHANGES ORDER STATUS
// ===============================


// ===============================
// START SERVER
// ===============================

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Srinivas Chicken website running on port ${PORT}`
    );
});