let emojis = {};
let popupElement = null;

function createPopup() {
    const popup = document.createElement('div');
    popup.className = 'emoji-replacer-popup';
    popup.style.position = 'fixed';
    popup.style.display = 'none';
    document.body.appendChild(popup);
    return popup;
}

function showPopup(word, suggestions, target) {
    if (!popupElement) {
        popupElement = createPopup();
    }

    const rect = target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    popupElement.style.top = '';
    popupElement.style.bottom = '';
    popupElement.style.left = '';
    popupElement.style.right = '';

    popupElement.innerHTML = `
        <p>Replace "${word}" with:</p>
        <ul>
            ${suggestions.map(emoji => `<li class="emoji-option">${emoji}</li>`).join('')}
        </ul>
    `;

    popupElement.style.display = 'block';
    popupElement.style.visibility = 'hidden';

    const popupRect = popupElement.getBoundingClientRect();

    if (rect.bottom + popupRect.height > viewportHeight) {
        popupElement.style.bottom = `${viewportHeight - rect.top}px`;
    } else {
        popupElement.style.top = `${rect.bottom}px`;
    }

    if (rect.left + popupRect.width > viewportWidth) {
        popupElement.style.right = '0px';
    } else {
        popupElement.style.left = `${rect.left}px`;
    }

    popupElement.style.visibility = 'visible';

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
        const selection = window.getSelection();
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

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.isContentEditable || node.tagName.toLowerCase() === 'textarea' || (node.tagName.toLowerCase() === 'input' && node.type === 'text')) {
                        node.addEventListener('input', handleInput);
                    }
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('click', (event) => {
    if (popupElement && !popupElement.contains(event.target)) {
        hidePopup();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ping") {
        sendResponse({status: "ready"});
    } else if (request.action === "updateEmojis") {
        emojis = request.emojis;
        console.log("Emojis updated in content script:", emojis);
    }
});