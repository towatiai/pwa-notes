const Note = require("../../backend/note");

module.exports = async (req, res) => {

    switch (req.method) {

        case "PUT":
            await put(req, res);
            break;

        case "DELETE":
            await deleteNote(req, res);
            break;

    }

}


async function put(req, res) {
    const { query: {id}, body} = req;

    if (!body.title && !body.content) {
        res.status(400).send("Invalid request");
    } else {
        const result = await Note.findByIdAndUpdate(id, {
            title: body.title,
            content: body.content,
        }, { new: true });
        if (result) {
            res.json(result);
        } else {
            res.sendStatus(404);
        }
    }
}


async function deleteNote(req, res) {
    const id = req.query.id;

    const result = await Note.deleteOne({ "_id": id });
    if (result.deletedCount) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
}