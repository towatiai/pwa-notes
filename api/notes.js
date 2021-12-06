const Note = require("../backend/note");

export default async (req, res) => {

    switch (req.method) {
        case "POST":
            const body = req.body;
            if (!body.title && !body.content) {
                res.status(400).send("Invalid request");
                return;
            }
            try {
                const note = await new Note({ title: body.title, content: body.content }).save();
                res.json(note);
            } catch (e) {
                res.status(500);
                res.json(e);
            }

        case "GET":
            res.json(await Note.find({}));
    }



}