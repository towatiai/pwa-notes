const Note = require("../../backend/note");

module.exports = async (req, res) => {

    switch (req.method) {

        case "PUT":
            await put(res, id, req.body);
            break;

        case "DELETE":
            await deleteNote(id);
            break;

    }

}


async function put(res, id, body) {
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


async function deleteNote(res, id) {
    const result = await Note.deleteOne({ "_id": id });
    if (result.deletedCount) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
}