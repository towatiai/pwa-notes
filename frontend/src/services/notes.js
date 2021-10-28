const baseUrl = '/api/notes';

const getNotes = async () => {
    const response = await fetch(baseUrl);
    if (response && response.ok) {
        return response.json();
    }
}

const createNote = async (newNote) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
    });
    if (response && response.ok) {
        return response.json();
    }
}

const editNote = async (id, newNote) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
    });
    if (response && response.ok) {
        return response.json();
    }
}

export default { getNotes, createNote, editNote };
