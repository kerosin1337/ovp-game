let name = '';

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
                $('.elements').remove().fadeOut(500);
                $('#game').append(`<div class="elements"></div>`).fadeIn();
                break;
        }
    };
};

let go = (page, attribute) => {
    let pages = ['start', 'game', 'end'];

    panel = page;
    $(`#${page}`).fadeIn(500).attr('class', attribute);
    pages.forEach(e => {
        if (page != e) {
            $(`#${e}`).fadeOut(500).attr('class', 'd-none');
            // $(`#${e}`).fadeOut(500).attr('class', 'd-none');
        }
    });
};

let startloop = () => {
    let inter = setInterval(() => {
        if (panel !== 'start') {
            clearInterval(inter);
        }
        checkName();
    }, 100);
};

let checkStorage = () => {
    if (localStorage.getItem('userName') != null) {
        $(`#nameInput`).val(localStorage.getItem('userName'));
    }
};

let checkName = () => {
    name = $(`#nameInput`).val().trim();

    if (name != '') {
        localStorage.setItem('userName', name);
        $('#startGame').attr('disabled', false);
    }
    else {
        $('#startGame').attr('disabled', true);
    }
};
