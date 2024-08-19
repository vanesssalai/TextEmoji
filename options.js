let emojiData = {};

function loadOptions() {
    chrome.storage.sync.get('emojis', (data) => {
        emojiData = data.emojis || {};
        renderTable();
    });
}

function renderTable() {
    const table = document.getElementById('emojiTable');
    table.innerHTML = `
        <tr>
            <th>Word</th>
            <th>Emojis (comma-separated)</th>
            <th>Action</th>
        </tr>
    `;

    for (const [word, emojis] of Object.entries(emojiData)) {
        const row = table.insertRow(-1);
        row.innerHTML = `
            <td><input type="text" value="${word}" class="word-input"></td>
            <td><input type="text" value="${emojis.join(', ')}" class="emoji-input"></td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        row.querySelector('.delete-btn').addEventListener('click', () => deleteRow(row));
    }
}

function addRow() {
    const table = document.getElementById('emojiTable');
    const row = table.insertRow(-1);
    row.innerHTML = `
        <td><input type="text" class="word-input"></td>
        <td><input type="text" class="emoji-input"></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    row.querySelector('.delete-btn').addEventListener('click', () => deleteRow(row));
}

function deleteRow(row) {
    row.parentNode.removeChild(row);
}

function saveOptions() {
    const table = document.getElementById('emojiTable');
    const newEmojiData = {};

    for (let i = 1; i < table.rows.length; i++) {
        const word = table.rows[i].cells[0].querySelector('input').value.trim().toLowerCase();
        const emojis = table.rows[i].cells[1].querySelector('input').value.split(',').map(e => e.trim());
        if (word && emojis.length > 0) {
            newEmojiData[word] = emojis;
        }
    }

    chrome.storage.sync.set({ emojis: newEmojiData }, () => {
        alert('Options saved');
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('save').addEventListener('click', saveOptions);