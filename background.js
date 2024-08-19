const defaultEmojis = {
    "happy": ['(◕‿◕)', '٩(◕‿◕)۶', '(•‿•)', '(ᵔᴥᵔ)', '(◠‿◠)'],
    ":)": ['(◕‿◕)', '٩(◕‿◕)۶', '(•‿•)', '(ᵔᴥᵔ)', '(◠‿◠)'],
    "sad": ['(╥﹏╥)', '(ㄒoㄒ)', '(╯︵╰,)', '(︶︹︺)', '(⌯˃̶᷄ ﹏ ˂̶᷄⌯)', '‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·'],
    "tt": ['(╥﹏╥)', '(ㄒoㄒ)', '(╯︵╰,)', '(︶︹︺)', '(⌯˃̶᷄ ﹏ ˂̶᷄⌯)', '‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·'],
    ":(": ['(╥﹏╥)', '(ㄒoㄒ)', '(╯︵╰,)', '(︶︹︺)', '(⌯˃̶᷄ ﹏ ˂̶᷄⌯)', '‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·'],
    "love": ['(♥ω♥*)', '(≧◡≦) ♡', '(´∀｀)♡', '(｡♥‿♥｡)', '(◍•ᴗ•◍)❤', '(✿˵•́ ૩•̀˵)৴♡*', '(ꈍ◡ꈍ)♥(❛ε❛⋆)'],
    "angry": ['(╬ Ò ‸ Ó)', '(っ˘̩╭╮˘̩)っ', '(￣ω￣;)', 'ヽ(￣д￣;)ノ', '(ノಠ益ಠ)ノ', '( ఠൠఠ )'],
    ">:(": ['(╬ Ò ‸ Ó)', '(っ˘̩╭╮˘̩)っ', '(￣ω￣;)', 'ヽ(￣д￣;)ノ', '(ノಠ益ಠ)ノ', '( ఠൠఠ )'],
    "hehe": ['( ๑‾̀◡‾́)σ','(๑>ᗜºั)', '((( ←～（o ｀▽´ )oΨ'],
    "sorry": ['ミヽ（。＞＜）ノ', '(,,◕　⋏　◕,,)', '༼ ༎ຶ ෴ ༎ຶ༽', '(┳Д┳)'],
    "slay": ['┏(‘▀_▀’)ノ♬♪', 'ᕕ(⌐■_■)ᕗ ♪♬', 'ヾ(*´ ∇ `)ﾉ'],
    "wink": ['( ͡~ ͜ʖ ͡°)r', '(^_-)-☆', '(˵ ͡~ ͜ʖ ͡°˵)ﾉ⌒♡*:･。.', '♡( •ॢ◡-ॢ)✧˖° ♡', '(๑>ᗜºั)'],
    "yay": ['ヽ(͡◕ ͜ʖ ͡◕)ﾉ', '╰ (´꒳`) ╯', 'ヽ(•‿•)ノ'],
    "idk": ['╮ (. ❛ ᴗ ❛.) ╭', '¯\_(⊙_ʖ⊙)_/¯', '└(・。・)┘'],
    "gn": ['〜ɢᵒᵒᵈ ɴⁱᵍᵗʰ( ᵕᴗᵕ)*･☪︎·̩͙', '(＊’͜’ )⋆ ᎶᎾᎾⅅ ℕᏐᎶℍᎢ ☾'],
    "cat": ['=^._.^= ∫', '(=^･ω･^=)', '(=ↀωↀ=)'],
    "vanessa": ['ʕ ◕ᴥ◕ ʔ', 'ʕง•ᴥ•ʔง', '＼ʕ •ᴥ•ʔ／', 'ʕ ꈍᴥꈍʔ', 'ᕦʕ •`ᴥ•´ʔᕤ']
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ emojis: defaultEmojis }, () => {
        console.log('Default emojis set.');
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmojis") {
        chrome.storage.sync.get('emojis', (data) => {
            sendResponse({emojis: data.emojis || defaultEmojis});
        });
        return true;
    }
});

function sendEmojisToContentScript(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "ping" }, response => {
        if (chrome.runtime.lastError) {
            setTimeout(() => sendEmojisToContentScript(tabId), 200);
        } else {
            chrome.storage.sync.get('emojis', (data) => {
                chrome.tabs.sendMessage(tabId, {
                    action: "updateEmojis",
                    emojis: data.emojis || defaultEmojis
                });
            });
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        sendEmojisToContentScript(tabId);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    sendEmojisToContentScript(activeInfo.tabId);
});