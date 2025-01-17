console.log("AllanDav1d - Portifolio www.allandavid.com.br");

let frame = 0;
const sound_HIT = new Audio();
sound_HIT.src = './efeitos/hit.wav';

let backgroundColor = '#70C5CE';

let sprites = new Image();

let sprites_original = new Image();
let sprites_dark = new Image();

sprites_original.src = './sprites.png';
sprites_dark.src = './sprites_dark.png';

sprites = sprites_original;

function makeDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    sprites === sprites_original ? sprites = sprites_dark : sprites = sprites_original;
    backgroundColor === '#70C5CE' ? backgroundColor = '#246369' : backgroundColor = '#70C5CE';
}





const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let background = {
    srcX: 390,
    srcY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    draw() {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            background.srcX, background.srcY, background.largura, background.altura,
            background.x, background.y, background.largura, background.altura
        );

        ctx.drawImage(
            sprites,
            background.srcX, background.srcY, background.largura, background.altura,
            (background.x + background.largura), background.y, background.largura, background.altura
        );
    }
}

function isCollider(flappyBird, floor) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const floorY = floor.y;

    if (flappyBirdY >= floorY) {
        return true;
    }
    return false;
}

function instantiateFloor() {
    const floor = {
        srcX: 0,
        srcY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        update() {
            const movementFloor = 1;
            const repetY = floor.largura / 2;
            const move = floor.x - movementFloor;

            floor.x = move % repetY;
        },
        draw() {
            ctx.drawImage(
                sprites,
                floor.srcX, floor.srcY, floor.largura, floor.altura,
                floor.x, floor.y, floor.largura, floor.altura
            );

            ctx.drawImage(
                sprites,
                floor.srcX, floor.srcY, floor.largura, floor.altura,
                (floor.x + floor.largura), floor.y, floor.largura, floor.altura
            );
        }
    }
    return floor;
}

function instantiateFlappyBird() {
    const flappyBird = {
        srcX: 0,
        srcY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 60,
        pulo: 4.6,
        velocidade: 0,
        gravidade: 0.25,

        update() {
            if (isCollider(flappyBird, globais.floor)) {
                flappyBird.draw();
                sound_HIT.play();

                setTimeout(() => {
                    changeScreen(Screens.GAME_OVER);
                }, 500);

                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;

            flappyBird.draw();
        },
        jump() {
            flappyBird.velocidade = -flappyBird.pulo;
        },
        frames: [
            { srcX: 0, srcY: 0, },
            { srcX: 0, srcY: 26, },
            { srcX: 0, srcY: 52, },
            { srcX: 0, srcY: 26, },
        ],
        currentFrame: 0,
        updateCurrentFrame() {
            const frameInterval = 10;
            const frameIntervalPass = frame % frameInterval === 0;

            if (frameIntervalPass) {
                const baseIncrement = 1;
                const increment = baseIncrement + flappyBird.currentFrame;
                const baseRepet = flappyBird.frames.length;
                flappyBird.currentFrame = increment % baseRepet;
            }

        },
        draw() {
            flappyBird.updateCurrentFrame();
            const { srcX, srcY } = flappyBird.frames[flappyBird.currentFrame];
            ctx.drawImage(
                sprites,
                srcX, srcY, //Sprite X, SpriteY
                flappyBird.largura, flappyBird.altura, //Tamanho do recorte
                flappyBird.x, flappyBird.y, //Posição no canvas
                flappyBird.largura, flappyBird.altura //Tamanho da imagem dentro do canvas
            );
        }
    }
    return flappyBird;
}

function instantiatePipes() {
    const pipe = {
        largura: 52,
        altura: 400,
        floor: {
            srcX: 0,
            srcY: 169,
        },
        sky: {
            srcX: 52,
            srcY: 169,
        },
        gapBetween: 80,
        draw() {


            pipe.pares.forEach(function(par) {
                const randomY = -par.y;
                const gapBetweenPipes = 90;

                const pipeSkyX = par.x;
                const pipeSkyY = 0 + randomY;

                ctx.drawImage(
                    sprites,
                    pipe.sky.srcX, pipe.sky.srcY,
                    pipe.largura, pipe.altura,
                    pipeSkyX, pipeSkyY,
                    pipe.largura, pipe.altura
                )

                const pipeFloorX = par.x;
                const pipeFloorY = pipe.altura + gapBetweenPipes + randomY;

                ctx.drawImage(
                    sprites,
                    pipe.floor.srcX, pipe.floor.srcY,
                    pipe.largura, pipe.altura,
                    pipeFloorX, pipeFloorY,
                    pipe.largura, pipe.altura
                )

                par.pipeSky = {
                    x: pipeSkyX,
                    y: pipe.altura + pipeSkyY
                }
                par.pipeFloor = {
                    x: pipeFloorX,
                    y: pipeFloorY
                }
            });
        },
        isColliderPlayer(par) {
            const headPlayer = globais.flappyBird.y;
            const footPlayer = globais.flappyBird.y + globais.flappyBird.altura;

            if ((globais.flappyBird.x + (globais.flappyBird.largura - 6)) >= par.x) {
                if (headPlayer <= par.pipeSky.y) {
                    return true;
                }
                if (footPlayer >= par.pipeFloor.y) {
                    return true;
                }
            }
            return false;
        },
        pares: [],
        update() {
            const pass100Frames = frame % 100 === 0;
            if (pass100Frames) {
                pipe.pares.push({
                    x: canvas.width,
                    y: 150 * (Math.random() + 1),
                });
            }

            pipe.pares.forEach(function(par) {
                par.x = par.x - 2;

                if (pipe.isColliderPlayer(par)) {
                    sound_HIT.play();
                    changeScreen(Screens.GAME_OVER);
                }

                if (par.x + pipe.largura <= 0) {
                    pipe.pares.shift();
                }
            });
        }
    }

    return pipe;
}

function instantiateScore() {
    const score = {
        pontuacao: 0,
        draw() {
            ctx.font = '35px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${score.pontuacao}`, canvas.width - 10, 35);
        },
        update() {
            const frameInterval = 100;
            const frameIntervalPass = frame % frameInterval === 0;

            if (frameIntervalPass) {
                score.pontuacao += 1;
            }
        },
    }
    return score;
}

const mensagemGetReady = {
    srcX: 134,
    srcY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    draw() {
        ctx.drawImage(
            sprites,
            mensagemGetReady.srcX, mensagemGetReady.srcY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura
        );
    }
}


const mensagemGameOver = {
    srcX: 134,
    srcY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,

    draw() {
        ctx.drawImage(
            sprites,
            mensagemGameOver.srcX, mensagemGameOver.srcY,
            mensagemGameOver.largura, mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura
        );
    }
}

let currentScreen = {};
const globais = {};

function changeScreen(newScreen) {
    currentScreen = newScreen;

    if (currentScreen.start) {
        currentScreen.start();
    }
}

const Screens = {
    JOGO: {
        start() {
            globais.score = instantiateScore();
        },
        draw() {
            background.draw();
            globais.pipes.draw();
            globais.floor.draw();
            globais.flappyBird.update();
            globais.score.draw();
        },
        click() {
            globais.flappyBird.jump();
        },
        update() {
            globais.pipes.update();
            globais.floor.update();
            globais.score.update();
        }
    },
    GAME_OVER: {
        draw() {
            mensagemGameOver.draw();
        },
        update() {

        },
        click() {
            changeScreen(Screens.INICIO);
        }
    },
    INICIO: {
        start() {
            globais.flappyBird = instantiateFlappyBird();
            globais.floor = instantiateFloor();
            globais.pipes = instantiatePipes();
        },
        draw() {
            background.draw();


            globais.flappyBird.draw();

            globais.floor.draw();
            mensagemGetReady.draw();
        },
        update() {
            globais.floor.update();
        },
        click() {
            changeScreen(Screens.JOGO);
        }
    }
}

function Loop() {
    currentScreen.draw();
    currentScreen.update();

    frame = frame + 1;
    requestAnimationFrame(Loop);
}

canvas.addEventListener('click', function() {
    if (currentScreen.click) {
        currentScreen.click();
    }
});

changeScreen(Screens.INICIO);
Loop();