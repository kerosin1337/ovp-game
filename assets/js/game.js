class Game {
    constructor() {
        this.name = name;
        this.$zone = $('.elements');
        this.elements = [];
        this.player = this.generate(Player);
        this.fruits = [Apple, Banana, Orange];
        this.counterForTimer = 0;
        this.points = 0;
        this.hp = 3;
        this.time = {
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0
        }
    }

    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => {
            this.counterForTimer++;
            if (this.counterForTimer % 60 === 0) {
                this.timer();
                this.randomFruitGenerate();
            }

            this.updateElements();
            this.setParams();
            this.loop();
        });
    }

    timer() {
        let time = this.time;
        time.s2++;
        if (time.s2 >= 10) {
            time.s2 = 0;
            time.s1++;
        }

        if (time.s1 >= 6) {
            time.s1 = 0;
            time.m2++;
        }
        if (time.m2 >= 10) {
            time.m2 = 0;
            time.m1++;
        }

        let str = `${time.m1}${time.m2}:${time.s1}${time.s2}`;
        $("#timer").html(str);
    }

    randomFruitGenerate() {
        let ranFruit = random(0, 2);
        this.generate(this.fruits[ranFruit]);
    }

    setParams() {
        let params = ['name', 'points', 'hp'];
        let value = [this.name, this.points, this.hp];

        params.forEach((e, i) => {
            $(`#${e}`).html(value[i]);
        });
    }

    updateElements() {
        this.elements.forEach(e => {
            e.update();
            e.draw();
        });
    }

    generate(className) {
        let element = new className(this);
        this.elements.push(element);
        return element;
    }

    remove(el) {
        let idx = this.elements.indexOf(el);
        if (idx !== -1) {
            this.elements.splice(idx, 1);
            return true;
        }
        return false;
    }
}

window.onload = () => {
    checkStorage();
    nav();
    startloop();
    setInterval(() => {
        if (panel === 'game') {
            game.game = new Game();
            game.game.start();
            panel = 'game process';
        }
    }, 500);
}

class Drawable {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offset = {
            x: 0,
            y: 0
        }
    }

    createElement() {
        this.$element = $(`<div class="element ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append(this.$element);
    }

    update() {
        this.x += this.offset.x;
        this.y += this.offset.y;
    }

    draw() {
        this.$element.css({
            left: this.x + "px",
            top: this.y + "px",
            width: this.w + "px",
            height: this.h + "px"
        });
    }

    isCollision(element) {
        let a = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h
        };

        let b = {
            x1: element.x,
            x2: element.x + element.w,
            y1: element.y,
            y2: element.y + element.h
        };

        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }

    removeElement() {
        this.$element.remove();
    }
}

class Player extends Drawable {
    constructor(game) {
        super(game);
        this.w = 244;
        this.h = 109;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = this.game.$zone.height() - this.h;

        this.speedPerFrame = 20;

        this.keys = {
            ArrowLeft: false,
            ArrowRight: false
        }
        this.createElement();
        this.bindKeyEvents();
    }

    bindKeyEvents() {
        document.addEventListener('keydown', ev => this.changeKeyStatus(ev.code, true));
        document.addEventListener('keyup', ev => this.changeKeyStatus(ev.code, false));
    }

    changeKeyStatus(code, value) {
        if (code in this.keys) {
            this.keys[code] = value;
        }
    }

    update() {
        if (this.keys.ArrowLeft && this.x > 0) {
            this.offset.x = -this.speedPerFrame;
        } else if (this.keys.ArrowRight && this.x < this.game.$zone.width() - this.w) {
            this.offset.x = this.speedPerFrame;
        } else {
            this.offset.x = 0;
        }
        super.update();
    }
}

class Fruit extends Drawable {
    constructor(game) {
        super(game);
        this.w = 70;
        this.h = 70;
        this.x = random(0, this.game.$zone.width() - this.w);
        this.y = 60;

        this.offset.y = 3;
        this.createElement();
    }

    update() {
        if (this.isCollision(this.game.player) && this.offset.y > 0) {
            this.takePoint(this.game.element);
        }

        if (this.y > this.game.$zone.height()) {
            this.takeDamage(this.game.element);
        }

        super.update();
    }

    takePoint() {
        if (this.game.remove(this)) {
            this.removeElement();
            this.game.points++;
        }
    }

    takeDamage() {
        if (this.game.remove(this)) {
            this.removeElement();
            this.game.hp--;
        }
    }
}

let random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Apple extends Fruit {
    constructor(game) {
        super(game);
        this.offset.y = 5;
    }
}

class Banana extends Fruit {
    constructor(game) {
        super(game);
    }
}

class Orange extends Fruit {
    constructor(game) {
        super(game);
        this.offset.y = 7;
    }
}
