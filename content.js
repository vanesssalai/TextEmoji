let emojis = {};
let popupElement = null;

function createPopup() {
    const popup = document.createElement('div');
    popup.className = 'emoji-replacer-popup';
    popup.style.display = 'none';
    document.body.appendChild(popup);
    return popup;
}

function showPopup(word, suggestions, target) {
    if (!popupElement) {
        popupElement = createPopup();
    }

    const rect = target.getBoundingClientRect();
    popupElement.style.top = `${window.scrollY + rect.bottom}px`;
    popupElement.style.left = `${window.scrollX + rect.left}px`;

    popupElement.innerHTML = `
        <p>Replace "${word}" with:</p>
        <ul>
            ${suggestions.map(emoji => `<li class="emoji-option">${emoji}</li>`).join('')}
        </ul>
    `;

    popupElement.style.display = 'block';

    popupElement.querySelectorAll('.emoji-option').forEach(option => {
        option.addEventListener('click', () => replaceText(target, word, option.textContent));
    });
}

function hidePopup() {
    if (popupElement) {
        popupElement.style.display = 'none';
    }
}

function replaceText(target, word, replacement) {
    let text, cursorPosition, newText;

    if (target.isContentEditable) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        text = target.textContent || target.innerText;
        cursorPosition = range.startOffset;
    } else {
        text = target.value;
        cursorPosition = target.selectionStart;
    }

    const textBeforeCursor = text.substring(0, cursorPosition);
    const textAfterCursor = text.substring(cursorPosition);
    
    const wordStart = textBeforeCursor.lastIndexOf(word);
    newText = textBeforeCursor.substring(0, wordStart) + replacement + textAfterCursor;
    
    if (target.isContentEditable) {
        target.textContent = newText;
        const newRange = document.createRange();
        newRange.setStart(target.firstChild, wordStart + replacement.length);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    } else {
        target.value = newText;
        target.selectionStart = target.selectionEnd = wordStart + replacement.length;
    }
    
    hidePopup();
}

function handleInput(event) {
    const target = event.target;
    if (target.isContentEditable || target.tagName.toLowerCase() === 'textarea' || (target.tagName.toLowerCase() === 'input' && target.type === 'text')) {
        let text, cursorPosition;

        if (target.isContentEditable) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            text = target.textContent || target.innerText;
            cursorPosition = range.startOffset;
        } else {
            text = target.value;
            cursorPosition = target.selectionStart;
        }

        if (typeof text === 'undefined' || text === null) {
            console.error('Text is undefined or null for element:', target);
            return;
        }

        const textBeforeCursor = text.substring(0, cursorPosition);
        const words = textBeforeCursor.split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase();
        
        if (lastWord in emojis) {
            showPopup(lastWord, emojis[lastWord], target);
        } else {
            hidePopup();
        }
    }
}

chrome.runtime.sendMessage({action: "getEmojis"}, function(response) {
    emojis = response.emojis;
    document.addEventListener('input', handleInput);
});