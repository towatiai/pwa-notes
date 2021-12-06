const Note = require("./note");

export default async (req, res) => {
    const body = req.body;

    let operations = [];
    operations = operations.concat(body
        .filter(n => n.deleted && n._id)
        .map(n => ({ deleteOne: { filter: { "_id": n._id } } })));

    operations = operations.concat(body
        .filter(n => n.hasChanged && !n.deleted && n._id)
        .map(n => ({ updateOne: { filter: { "_id": n._id }, update: { title: n.title, content: n.content } } })));

    const newNotes = body
        .filter(n => !n._id)
        .map(n => ({ title: n.title, content: n.content }));

    let insertResult, updateResult;
    try {
        [updateResult, insertResult] = await Promise.all(
            [Note.bulkWrite(operations), Note.insertMany(newNotes)]);
    } catch (e) {
        res.status(500);
        res.json(e);
        return;
    }


    // We need to use the same array, because inserted ids are given in that order.
    newNotes.forEach((n, i) => {
        body[body.findIndex(bn => bn.id == n.id)]._id = insertResult.insertedIds[i]
    });

    let notes = await Note.find({});
    let deletedNotes = body.filter(n => n._id && notes.every(rn => rn._id.toString() !== n._id)).map(n => ({ ...n, deleted: true }));
    notes = notes.map(n => ({ ...n.toObject(), id: body.find(bn => bn._id === n._id.toString())?.id }));
    res.json({ deletedNotes, notes });
}