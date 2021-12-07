const Note = require("../backend/note");
const Subscription = require("../backend/subscription");
const webpush = require("web-push");

module.exports = async (req, res) => {

    switch (req.method) {
        case "POST":
            const body = req.body;
            if (!body.title && !body.content) {
                res.status(400).send("Invalid request");
                return;
            }
            try {
                const note = await new Note({ title: body.title, content: body.content }).save();

                const notification = { title: `New note: ${body.title}` };
                const notifications = [];
                const subscriptions = await Subscription.find();
                subscriptions.forEach(sub => {
                    notifications.push(
                        webpush.sendNotification(sub, JSON.stringify(notification))
                            .catch(e => e)
                    );
                });
                await Promise.allSettled(notifications);
                res.json(notifications);
            } catch (e) {
                res.status(500);
                res.json(e);
            }

        case "GET":
            res.json(await Note.find({}));
    }



}