const baseUrl = '/api/notes';

const getNotes = async () => {
    const response = await fetch(baseUrl);
    if (response && response.ok) {
        return response.json();
    }
}

const synchronize = async (notes) => {
    const response = await fetch(`${baseUrl}/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notes),
    });
    if (response.status === 500) {
        throw new Error("Unable to synchronize.");
    }
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

const deleteNote = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
    if (response && response.ok) {
        return response.json();
    }
}

export default { getNotes, createNote, editNote, synchronize, deleteNote };
