const Subscription = require("../backend/subscription");

module.exports = async (req, res) => {

    switch (req.method) {
        case "POST":
            const body = req.body;
            if (!body.endpoint && !body.keys) {
                res.status(400).send("Invalid request");
                return;
            } else {
                try {
                    const subscription = await new Subscription({ endpoint: body.endpoint, keys: body.keys }).save();
                    res.json(subscription);
                } catch(e) {
                    console.log(e);
                    res.sendStatus(500);
                }
            }
    }
}