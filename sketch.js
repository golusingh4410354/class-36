var canvas;
var backgroundImage, car1_img, car2_img, track;
var obstacle1Image, obstacle2Image,fuelimage,powerCoinImage;
var database, gameState;
var blastImage;
var lifeImage;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var fuels ,powerCoins ,obstacles


function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/track.jpg");
  fuelimage = loadImage("../assets/fuel.png");
  powerCoinImage = loadImage("../assets/goldCoin.png");
  obstacle1Image = loadImage("../assets/obstacle1.png");
  obstacle2Image = loadImage("../assets/obstacle2.png");
  blastImage = loadImage("./assets/blast.png");
  lifeImage = loadImage("./assets/life.png");
  

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
  if(gameState===2){
    game.showLeaderboard()
    game.end()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

