import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var counter, base, ticker;

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://api.blockchain.com/v3/exchange/tickers");
        
        //get counter currencies
        counter = response.data.map((i) => i.symbol.slice(i.symbol.indexOf("-") + 1));
        counter = [...new Set(counter)].sort();;

        //get base currencies
        base = response.data.map((i) => i.symbol.substring(0, i.symbol.indexOf("-")));
        base = [...new Set(base)].sort();
        
        res.render("index.ejs", {
            counter:counter,
            base:base
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500);
        res.render("index.ejs", {
            error: "Failed to load: " + error.message
        });
    }
});

app.post("/", async (req, res) => {
    try {
        const response = await axios.get(`https://api.blockchain.com/v3/exchange/tickers/${req.body.base}-${req.body.counter}`);
        ticker = response.data;
        res.render("index.ejs", {
            counter: counter,
            base: base,
            selectedBase: req.body.base,
            selectedCounter: req.body.counter,
            ticker: ticker
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500);
        res.render("index.ejs", {
            counter: counter,
            base: base,
            selectedBase: req.body.base,
            selectedCounter: req.body.counter,
            ticker: "Error: Failed to request for ticker"
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});