const defaultEmojis = {
    "happy": ['(◕‿◕)', '٩(◕‿◕)۶', '(•‿•)', '(ᵔᴥᵔ)', '(◠‿◠)'],
    "sad": ['(╥﹏╥)', '(ㄒoㄒ)', '(╯︵╰,)', '(︶︹︺)', '(⌯˃̶᷄ ﹏ ˂̶᷄⌯)'],
    "TT": ['(╥﹏╥)', '(ㄒoㄒ)', '(╯︵╰,)', '(︶︹︺)', '(⌯˃̶᷄ ﹏ ˂̶᷄⌯)'],
    "love": ['(♥ω♥*)', '(≧◡≦) ♡', '(´∀｀)♡', '(｡♥‿♥｡)', '(◍•ᴗ•◍)❤', '(✿˵•́ ૩•̀˵)৴♡*', '(ꈍ◡ꈍ)♥(❛ε❛⋆)'],
    "angry": ['(╬ Ò ‸ Ó)', '(っ˘̩╭╮˘̩)っ', '(￣ω￣;)', 'ヽ(￣д￣;)ノ', '(ノಠ益ಠ)ノ', '( ఠൠఠ )'],
    "hehe": ['( ๑‾̀◡‾́)σ','(๑>ᗜºั)', '((( ←～（o ｀▽´ )oΨ'],
    "sorry": ['ミヽ（。＞＜）ノ', '(,,◕　⋏　◕,,)', '༼ ༎ຶ ෴ ༎ຶ༽', '(┳Д┳)'],
    "slay": ['┏(‘▀_▀’)ノ♬♪', 'ᕕ(⌐■_■)ᕗ ♪♬', 'ヾ(*´ ∇ `)ﾉ'],
    "wink": ['( ͡~ ͜ʖ ͡°)r', '(^_-)-☆', '(˵ ͡~ ͜ʖ ͡°˵)ﾉ⌒♡*:･。.', '♡( •ॢ◡-ॢ)✧˖° ♡'],
    "yay": ['ヽ(͡◕ ͜ʖ ͡◕)ﾉ', '╰ (´꒳`) ╯', 'ヽ(•‿•)ノ'],
    "idk": ['╮ (. ❛ ᴗ ❛.) ╭', '¯\_(⊙_ʖ⊙)_/¯', '└(・。・)┘'],
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