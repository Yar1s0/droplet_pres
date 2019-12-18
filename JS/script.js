// Canvas Variables
const canvas = document.getElementById("canvas");
const ship = document.getElementById('ship');
const ctx = canvas.getContext("2d");
const fps = 24;

// Keyboard Variables (UNICODE OF THE KEYS)
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const SPACE_BAR = 32;
const RETURN_KEY = 13;

let frameInterval;
let gameon = false;
let gameEnd = false;
let score = 0;
let bestScore = 0;
let localScore = window.localStorage.getItem('score');

let villanInt = 0;
let villanIncrement = 0;
let prevVillan = 0;
let maxVillanSpeed = 0;

if (localScore != null) {
  bestScore = localScore;
  document.getElementById("best-score").innerHTML = bestScore;
}
console.log(localScore);
let bulletArray = [];
let villanArray = [];
player = {
  x: canvas.width / 2 - 30 / 2,
  y: canvas.height - 70,

  moveLeft: false,
  moveRight: false,
  isShooting: false
};

let keyPress = event => {
  const keyPressed = event.keyCode;
  if (gameon == false && keyPressed === RETURN_KEY) {
    if(gameEnd === true) {
      location.reload();
    } else {
      startGame();
    }
  }

  if (keyPressed === LEFT_KEY) {
    player.moveLeft = true;
  }

  if (keyPressed === SPACE_BAR) {
    if (player.isShooting != true) {
      newBullet(player, -1);
      player.isShooting = true;
    }
  }

  if (keyPressed === UP_KEY) {
    if (player.isShooting != true) {
      newBullet(player, -1);
      player.isShooting = true;
    }
  }

  if (keyPressed === RIGHT_KEY) {
    player.moveRight = true;
  }
  if (keyPressed === DOWN_KEY) {}
};

keyRelease = event => {
  const keyPressed = event.keyCode;
  if (keyPressed === LEFT_KEY) player.moveLeft = false;
  if (keyPressed === SPACE_BAR) player.isShooting = false;
  if (keyPressed === UP_KEY) player.isShooting = false;
  if (keyPressed === RIGHT_KEY) player.moveRight = false;
  if (keyPressed === DOWN_KEY) return;
};

movePlayer = () => {
  if (player.moveLeft == true) {
    if (player.x - player.s < 0) {
      return;
    }
    player.x = player.x - player.s;
  }
  if (player.moveRight == true) {
    if (player.x + player.s + player.w > canvas.width) {
      return;
    }
    player.x = player.x + player.s;
  }
};

newBullet = (shooter, direction) => {
  let bullet = {
    x: shooter.x - 5 + shooter.w / 2,
    y: shooter.y - 20,
    w: 10,
    h: 20,
    s: 15,
    d: direction
  };

  bulletArray.push(bullet);
};

moveBullets = () => {
  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].y = bulletArray[i].y + bulletArray[i].s * bulletArray[i].d;
    if (bulletArray[i].y < 0 || bulletArray[i].y > canvas.height)
      bulletArray.splice(i, 1);
  }
};

makeVillans = () => {
  if (villanIncrement > prevVillan + villanInt || villanIncrement == 0) {
    let villanSize = Math.floor(Math.random() * 3) + 1;
    var villan1 = document.getElementById("villan1");
    var villan2 = document.getElementById("villan2");
    var villan3 = document.getElementById("villan3");
    var villan4 = document.getElementById("villan4");

    var villanToGo = "";
    var random = Math.round(Math.random() * 10);

    if (random === 1 || random  === 2 || random  === 3) {
      villanToGo = villan1;
    } else if (random === 4 || random  === 5 || random  === 6) {
      villanToGo = villan2;
    } else if (random === 7 || random  === 8) {
      villanToGo = villan3;
    } else {
      villanToGo = villan4;
    }

    let villan = {
      x: Math.floor(Math.random() * (canvas.width - 50 * villanSize * 2)) +
        villanSize,
      y: 0,
      w: 50 * villanSize,
      h: 50 * villanSize,
      speed: maxVillanSpeed - villanSize,
      size: villanSize,
      villanImg: villanToGo
    };

    prevVillan = villanIncrement;
    villanArray.push(villan);
  }
  villanIncrement++;
  if (villanIncrement % 200 == 0 && villanInt > 30) {
    maxVillanSpeed++;
    villanInt = villanInt - 10;
    levelUp();
  }
};

moveVillans = () => {
  for (let i = 0; i < villanArray.length; i++) {
    villanArray[i].y = villanArray[i].y + villanArray[i].speed;
    if (villanArray[i].y + villanArray[i].h > canvas.height) {
      villanArray.splice(i, 5);
      lostLife();
    }
  }
};

checkVillanCollision = () => {
  if (villanArray.length == 0 || bulletArray.length == 0) return;
  for (let i = 0; i < villanArray.length; i++) {
    for (let j = 0; j < bulletArray.length; j++) {
      if (
        villanArray[i].x < bulletArray[j].x &&
        villanArray[i].x + villanArray[i].w >
        bulletArray[j].x + bulletArray[j].w &&
        villanArray[i].y < bulletArray[j].y &&
        villanArray[i].y + villanArray[i].h > bulletArray[j].y &&
        bulletArray[j].d != 1) {
        villanArray[i].size--;
        villanArray[i].w = 50 * villanArray[i].size;
        villanArray[i].h = 50 * villanArray[i].size;
        villanArray[i].x =
          villanArray[i].x + (50 * villanArray[i].size + 1) / 2;
        villanArray[i].speed = maxVillanSpeed - villanArray[i].size;
        bulletArray.splice(j, 1);
        score++;
        document.getElementById("score").innerHTML = score;
      }
    }
    if (villanArray[i].size <= 0) villanArray.splice(i, 1);
  }
};

redFlash = false;
lostLife = () => {
  player.l = player.l - 0.4;
  if (player.l <= 0)
    endGame("Lost");
  redFlash = true;
  setTimeout(() => {
    redFlash = false;
  }, 50);
};
levelUp = () => {
  var title = document.getElementById("levelup-title");
  title.classList.remove("hide");
  setTimeout(() => {
    title.classList.add("hide");
  }, 2000);
}

//Draw game
draw = () => {
  drawPlayer(player);
  drawGround();
  drawHealth(player);

  bulletArray.forEach(drawBullets);
  villanArray.forEach(drawVillan);

  if (redFlash == true) drawRedFlash();
};

drawPlayer = self => {
  var robot = document.getElementById("player");
  ctx.drawImage(robot, player.x, player.y, player.w, player.h);
};
drawGround = () => {
  ctx.fillStyle = "green";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "green";
  ctx.beginPath();
  ctx.rect(0, canvas.height - 20, canvas.width, 20);
  ctx.fill();
};
drawHealth = self => {
  ctx.fillStyle = "red";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "red";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width * player.l, 5);
  ctx.fill();
};

drawBullets = self => {
  ctx.fillStyle = "pink";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "pink";
  ctx.beginPath();
  ctx.rect(self.x, self.y, self.w, self.h);
  ctx.fill();
};

drawVillan = self => {
  ctx.drawImage(self.villanImg, self.x, self.y, self.w, self.h);
};

drawRedFlash = () => {
  ctx.fillStyle = "red";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "red";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
};

function gameOver(result) {}


// Frame Changes
frame = () => {
  frameInterval = setTimeout(function () {
    //Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    moveBullets();

    makeVillans();
    moveVillans();

    checkVillanCollision();


    draw();
    if (gameon === true && score === 20) {
      endGame("Win");
    }

    if (gameon == true) {
      requestAnimationFrame(frame);
    }
  }, 700 / fps);
};

draw();

function startGame() {

  var screens = document.getElementsByClassName("extra-screen");
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.add("hide");
  }
  score = 0;
  document.getElementById("score").innerHTML = score;
  bulletArray = [];
  villanArray = [];
  player = {
    x: canvas.width / 2 - 30 / 2,
    y: canvas.height - 110,
    s: 15,
    w: 105,
    h: 105,
    l: 1,
    moveLeft: false,
    moveRight: false,
    isShooting: false
  };

  villanInt = 80;
  villanIncrement = 0;
  prevVillan = 0;
  maxVillanSpeed = 4;
  gameon = true;
  frame();
}

function endGame(status) {
  //window.localStorage.removeItem('score');

  gameon = false;
  clearInterval(frameInterval);

  var title = document.getElementById("lose-title");
  var recTitle = document.getElementById("new-record");
  var recTitle2 = document.getElementById("GameEnd");

  title.classList.remove("hide");

  if (status === "Win") {
    recTitle2.innerText = "You Win! :)";
  } else {
    recTitle2.innerText = "Game Over :(";
  }

  if (score > bestScore * 1) {
    window.localStorage.setItem('score', score);
    bestScore = score;
    document.getElementById("best-score").innerText = bestScore;
    recTitle.innerText = "Your new Score: " + score;
    recTitle.classList.remove("hide");
  }
  gameEnd = true;
}

document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", keyRelease);