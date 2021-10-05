let game = {
    game: []
};

let panel = 'start';

let nav = () => {
    document.onclick = (e) => {
        e.preventDefault();
        switch (e.path[0].id) {
            case 'startGame':
                go('game', 'd-block');
                break;
            case 'restart':
                go('game', 'd-block');
                $('.elements').remove();
                $('#game').append('<div class="elements"></div>')
                break;
        }
    }
};

let go = (page, attribute) => {
    let pages = ['start', 'game', 'end'];
    panel = page;
    $(`#${page}`).attr('class', attribute);
    pages.forEach(e => {
        if (page != e) {
            $(`#${e}`).attr('class', 'd-none');
        }
    })
}

let start = () => {
    let inter = setInterval(() => {
        if (panel !== 'start') {
            clearInterval(inter);
        }
    }, 100)
}
