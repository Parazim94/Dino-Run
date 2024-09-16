const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Laden des Dino-GIF-Sprites
const dinoImage = new Image();
dinoImage.src = "move1.png"; // Pfad zum hochgeladenen Character-Sprite

const cactusImage = new Image();
cactusImage.src = "cactus1.png"; // Pfad zum Kaktus-Bild

// Sprite-Animationseinstellungen
const spriteWidth = 24; // Breite eines einzelnen Frames
const spriteHeight = 24; // Höhe eines einzelnen Frames
const totalFrames = 4; // Anzahl der Frames im Character-Sprite
let currentFrame = 0; // Aktueller Frame
let frameCount = 0; // Zähler, um die Frame-Geschwindigkeit zu kontrollieren
const frameInterval = 4; // Anzahl der Spielschleifen zwischen Frame-Updates

// Spielstatus
let gameStarted = false;

// Punktestand
let score = 0;

// Charakter-Objekt
const character = {
  x: 50,
  y: canvas.height - 100,
  width: 48, // Größe anpassen für bessere Sichtbarkeit
  height: 48,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  gravity: 0.5,
  jumpPower: -12,
  isJumping: false,
  draw: function () {
    ctx.drawImage(
      dinoImage,
      currentFrame * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  update: function () {
    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isJumping = false;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    frameCount++;
    if (frameCount >= frameInterval) {
      currentFrame = (currentFrame + 1) % totalFrames;
      frameCount = 0;
    }
  },
  jump: function () {
    if (!this.isJumping) {
      this.velocityY = this.jumpPower;
      this.isJumping = true;
      this.canDoubleJump = true;
    } else if (this.canDoubleJump) {
      this.velocityY = this.jumpPower;
      this.canDoubleJump = false;
    }
  },
};

// Hindernisse-Array
const obstacles = [];
const obstacleCount = 3; 

// Hindernisse erstellen
for (let i = 0; i < obstacleCount; i++) {
  obstacles.push({
    x: canvas.width + i * 300,
    width: Math.random() * 50 + 20,
    height: Math.random() * 100 + 20,
    speed: 5,
    passed: false,
    draw: function () {
      ctx.drawImage(cactusImage, this.x, this.y, this.width, this.height);
    },
    update: function () {
      this.x -= this.speed;

      if (this.x + this.width < 0) {
        this.x = canvas.width + Math.random() * 200;
        this.width = Math.random() * 50 + 20;
        this.height = Math.random() * 100 + 20;
        this.y = canvas.height - this.height;
        this.passed = false;
      }

      if (!this.passed && this.x + this.width < character.x) {
        score++;
        this.passed = true;
      }
    },
  });
}

// Kollisionserkennung
function checkCollision() {
  for (let obstacle of obstacles) {
    if (
      character.x < obstacle.x + obstacle.width &&
      character.x + character.width > obstacle.x &&
      character.y < obstacle.y + obstacle.height &&
      character.y + character.height > obstacle.y
    ) {
      return true;
    }
  }
  return false;
}

// Steuerung durch Tastendruck
document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    character.velocityX = -character.speed;
  } else if (event.code === "ArrowRight") {
    character.velocityX = character.speed;
  } else if (event.code === "ArrowUp") {
    character.jump();
  } else if (event.code === "Space" && !gameStarted) {
    gameStarted = true;
    gameLoop();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
    character.velocityX = 0;
  }
});

// Score auf dem Canvas anzeigen
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// Nachricht vor dem Spielstart anzeigen
function drawStartMessage() {
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText("Press Space to Start", canvas.width / 2 - 150, canvas.height / 2);
}

// Hauptspiel-Schleife
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  character.update();
  character.draw();

  for (let obstacle of obstacles) {
    obstacle.update();
    obstacle.draw();
  }

  drawScore();

  if (checkCollision()) {
    alert("Game Over!");
    return;
  }
  requestAnimationFrame(gameLoop);
}

// Vor dem Start des Spiels
drawStartMessage();

