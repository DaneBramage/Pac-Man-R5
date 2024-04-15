function preload() {
  soundFormats('mp3');
  introSound = loadSound('sounds/pacman_beginning', prepSounds);
  sirenSound = loadSound('sounds/siren_1_quieter', prepSounds);
  chompSound = loadSound('sounds/pacman_chomp_quieter', prepSounds);
  deathSound = loadSound('sounds/death_1', prepSounds);
  powerSound = loadSound('sounds/power_pellet', prepSounds);
  fruitSound = loadSound('sounds/eat_fruit', prepSounds);
  eatGhostSound = loadSound('sounds/eat_ghost', prepSounds);
}

function setup() {
  createCanvas(600, 600);
  background(75);
  rectMode(CENTER);
  frameRate(60);
  noStroke();
  textAlign(CENTER, CENTER);
  startButton = createButton('START GAME');
  startButton.style('font-size', '26px');
  startButton.position(width * 0.35, height * 0.5);
  startButton.mousePressed(startGame);
  restartButton = createButton('NEW GAME');
  restartButton.style('font-size', '26px');
  restartButton.position(width * 0.367, height * 0.6);
  restartButton.mousePressed(startGame);
  restartButton.hide();
  decreaseButton = createButton('–');
  decreaseButton.style('font-size', '22px');
  decreaseButton.position(width * 0.4, height * 0.65);
  decreaseButton.mousePressed(decreaseSpeed);
  increaseButton = createButton('+');
  increaseButton.style('font-size', '22px');
  increaseButton.position(width * 0.55, height * 0.65);
  increaseButton.mousePressed(increaseSpeed);
  checkbox = createCheckbox(' Enable Sound', true);
  checkbox.style('font-size', '20px');
  checkbox.style('font-weight', '600');
  checkbox.style('font-family', 'Sans-serif');
  checkbox.style('color', 'white');
  //checkbox.style('-webkit-text-stroke: 1px white');
  checkbox.changed(toggleSound);
  checkbox.position(width * 0.36, height * 0.75);
}

function toggleSound() {
  if (this.checked()) {
    //console.log('Checking!');
    soundEnabled = true;
  } else {
    //console.log('Unchecking!');
    soundEnabled = false;
  }
}

function prepSounds() {
  userStartAudio(); // ensure that audio is enabled
  introSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  sirenSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  chompSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  deathSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  powerSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  fruitSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
  eatGhostSound.playMode('untilDone'); // 'restart' or 'sustain' or 'untilDone'
}

let soundEnabled = true;
let mapVer = 0; // HAS NO EFFECT, MUST BE UPDATED IN RESETMAP() FUNCTION
let speed = 5; // VALUES BETWEEN 3-7 WORK PROPERLY, INCLUSIVE
let columns = 40;
let rows = 40;
let tileSize = 15;
let blinkColor = "white";
let pauseTimer = Infinity; // DELAY BEFORE GAME BEGINS
let score = 0;
let lives = 3; // HAS NO EFFECT, MUST BE UPDATED IN STARTGAME() FUNCTION
let getReady = false;
let pillsRemaining = 0;
let ghostsEaten = 0;
let showBonus = false;
let showFruitBonus = false;
let extraLifeGoal = 10000;
let introScreen = true;
let homeEntranceX = [19.5, 20.5, 35.5];
let homeEntranceY = [15, 19, 31];
let entranceDir = ["down", "down", "down"]; // DIRECTION TO ENTER HOME
let exitDir = ["left", "left", "left"] // MOVEMENT DIR AFTER EXITING HOME
let homeBoundaryLeft = [17, 18, 33];
let homeBoundaryRight = [22, 23, 38];
let homeBoundaryTop = [17, 21, 33];
let homeBoundaryBottom = [19, 23, 37];
let warp1left = [6, 0, 0];
let warp1right = [33, 39, 39];
let warp1top = [0, 3, 0];
let warp1bottom = [39, 37, 39];
let ghost1x = [17.65, 18.65, 33.65];
let ghost2x = [18.9, 19.9, 34.9];
let ghost3x = [20.15, 21.15, 36.15];
let ghost4x = [21.4, 22.4, 37.4];
let ghost1y = [18, 22, 35];
let ghost2y = [18, 22, 35];
let ghost3y = [18, 22, 35];
let ghost4y = [18, 22, 35];
let textX = [19.5, 20.5, 19.5];
let textY = [21, 19, 22];
let fruitX = [19.5, 20.5, 35.5];
let fruitY = [21, 19.25, 31.20];
let pacManStartX = [20, 20, 19];
let pacManStartY = [27, 25, 25];
let soundTimeout = 0; // USE TO PREVENT CHOMPING LOOP FROM ENDING TOO QUICKLY

let tileTypes = [
  [ // BEGIN MAP 0
//0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 1
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 2
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 3
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 4
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 5
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 6
  0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, // 7
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 8
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 9
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 10
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 11
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 12
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 13
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 14
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 4, 4, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 17
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, // 18
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 19
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 20
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 21
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 22
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 23
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 24
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 25
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 26
  0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, // 27
  0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 28
  0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 29
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 30
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 31
  0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, // 32
  0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, // 33
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 34
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 35
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 36
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 37
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 38
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // 39
  ], // END MAP 0
  [ // BEGIN MAP 1
//0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39    
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 1
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 2
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, // 3
  0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, // 4
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, // 5
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, // 6 
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, // 7
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, // 8
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, // 9
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 10
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 11
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, // 12
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 13
  0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, // 14
  0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 3, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, // 15
  0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 16
  0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 17
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 18
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 19
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 4, 4, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 20
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 21
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 22
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 23
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 24
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 25
  0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 26
  0, 0, 0, 0, 1, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 27
  0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 28
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 29
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 30
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, // 31
  0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, // 32
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 33
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 34
  0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, // 35
  0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 3, 1, 0, 0, 0, // 36
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, // 37
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 38
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // 39
  ], // END MAP 1
  [ // BEGIN MAP 2
//0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39    
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 1 
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 2
  0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 3, 1, 1, // 3
  0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, // 4
  0, 1, 2, 1, 3, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, // 5
  0, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, // 6
  0, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1, // 7
  0, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 8
  0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 9
  0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 10
  0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 11
  0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 3, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 12
  0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, // 13
  0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, // 14
  0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, // 15
  0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, // 16
  0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, // 17
  0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 3, 2, 1, // 18
  0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1, 2, 1, // 19
  0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, // 20
  0, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 21
  0, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 1, // 22
  0, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, // 23
  0, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, // 24
  0, 1, 2, 1, 1, 1, 2, 1, 2, 1, 3, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, // 25
  0, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, // 26
  0, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, // 27
  0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, // 28
  0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, // 29
  0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, // 30
  0, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 1, // 31
  0, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 4, 4, 1, 1, 1, // 32
  0, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, // 33
  0, 1, 2, 2, 3, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, // 34
  0, 1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, // 35
  0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, // 36
  0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, // 37
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 38
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // 39
  ] // END MAP 2
];

// GENERATE TILEMAP:
let tileMap = [];
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    tileMap.push({ x: x * tileSize, y: y * tileSize, type: tileTypes[mapVer][x + y * columns] });
  }
}
for (let i = 0; i < tileMap.length; i++) { // TRANSLATE TYPE PROPERTY FROM NUMBERS TO STRINGS
  if (tileMap[i].type === 0) {
    tileMap[i].type = "open";
    tileMap[i].pill = "none";
  }
  if (tileMap[i].type === 1) {
    tileMap[i].type = "wall";
    tileMap[i].pill = "none";
  }
  if (tileMap[i].type === 2) {
    tileMap[i].type = "open";
    tileMap[i].pill = "normal";
    pillsRemaining++; // COUNT PILLS AS THEY ARE CREATED
  }
  if (tileMap[i].type === 3) {
    tileMap[i].type = "open";
    tileMap[i].pill = "power";
  }
  if (tileMap[i].type === 4) {
    tileMap[i].type = "ghostwall";
    tileMap[i].pill = "none";
  }
}

function updateMap() {
  for (let i = 0; i < tileMap.length; i++) {
    if (tileMap[i].type === "open") {
      fill("black"); // FILL BLACK FOR OPEN CELLS
      rect(tileMap[i].x, tileMap[i].y, tileSize);
    }
    if (tileMap[i].type === "wall") {
      if (mapVer === 0) {
        fill(0, 0, 255); 
      }
      if (mapVer === 1) {
        fill(90, 0, 245);   
      }
      if (mapVer === 2) {
        fill(0, 160, 60);  
      }
      rect(tileMap[i].x, tileMap[i].y, tileSize);
    }
    if (tileMap[i].type === "ghostwall") {
      fill("lightblue"); // FILL BLUE FOR GHOST WALL
      rect(tileMap[i].x, tileMap[i].y, tileSize, tileSize * 0.5);
    }
    if (tileMap[i].pill === "normal") { // DRAW PILLS
      fill("white");
      ellipse(tileMap[i].x, tileMap[i].y, tileSize * 0.35);
    }
    if (tileMap[i].pill === "power") { // DRAW POWER-PILLS
      fill(blinkColor); // VARIABLE ALTERNATES BETWEEN "white" AND "black"
      ellipse(tileMap[i].x, tileMap[i].y, tileSize * 0.7);
    }
  }
}

let pacMan = {
  x: pacManStartX[mapVer],
  y: pacManStartY[mapVer],
  xCoord: this.x * tileSize,
  yCoord: this.y * tileSize,
  dir: "right",
  nextDir: "right",
  int: 0.02 * speed,
  mouthOpen: 0.5, // RANGE = 0 to 0.5 (CLOSED TO OPEN)
  mouthState: "closing",
  dead: false,
  deathArcPos1: -1.57, // NEGATIVE HALF-PI (STRAIGHT-UP, RIGHT SIDE)
  deathArcPos2: 4.71, // PI + HALF-PI (STRAIGHT-UP, LEFT SIDE)
  canMoveRight: true,
  canMoveLeft: true,
  canMoveUp: false,
  canMoveDown: false,
  onGrid: function () { // CHECK WHETHER PAC-MAN IS ON A GRID CELL
    if (this.x % 1 === 0 && this.y % 1 === 0) {
      return true;
    }
    else {
      return false;
    }
  },
  draw: function () {
    this.xCoord = this.x * tileSize;
    this.yCoord = this.y * tileSize;
    if (this.dead === false) {
      push();
      noStroke();
      fill(255, 255, 0); // YELLOW FOR PAC-MAN
      ellipse(this.xCoord, this.yCoord, tileSize);
      fill(0); // SET TO BACKGROUND COLOR FOR MOUTH
      if (this.dir === "right") {
        triangle(this.xCoord - tileSize * 0.1, this.yCoord, this.xCoord + tileSize * 0.5, this.yCoord - tileSize * this.mouthOpen, this.xCoord + tileSize * 0.5, this.yCoord + tileSize * this.mouthOpen);
      }
      if (this.dir === "left") {
        triangle(this.xCoord + tileSize * 0.1, this.yCoord, this.xCoord - tileSize * 0.5, this.yCoord - tileSize * this.mouthOpen, this.xCoord - tileSize * 0.5, this.yCoord + tileSize * this.mouthOpen);
      }
      if (this.dir === "up") {
        triangle(this.xCoord, this.yCoord + tileSize * 0.1, this.xCoord - tileSize * this.mouthOpen, this.yCoord - tileSize * 0.5, this.xCoord + tileSize * this.mouthOpen, this.yCoord - tileSize * 0.5);
      }
      if (this.dir === "down") {
        triangle(this.xCoord, this.yCoord - tileSize * 0.1, this.xCoord - tileSize * this.mouthOpen, this.yCoord + tileSize * 0.5, this.xCoord + tileSize * this.mouthOpen, this.yCoord + tileSize * 0.5);
      }
      pop();
    }
  },
  chomp: function () {
    if (this.mouthState === "closing") {
      this.mouthOpen -= 0.1;
      if (this.mouthOpen <= 0) {
        this.mouthState = "opening";
      }
    }
    if (this.mouthState === "opening") {
      this.mouthOpen += 0.1;
      if (this.mouthOpen >= 0.6) {
        this.mouthState = "closing";
      }
    }
    if (cell(Math.round(this.x), Math.round(this.y)).pill === "normal") { // EAT PILLS
      cell(Math.round(this.x), Math.round(this.y)).pill = "none";
      pillsRemaining--; // REDUCE PILL COUNT AS THEY ARE EATEN
      score += 10;
    }
    if (cell(Math.round(this.x), Math.round(this.y)).pill === "power") { // EAT POWER PILLS
      cell(Math.round(this.x), Math.round(this.y)).pill = "none";
      for (let i = 0; i < ghosts.length; i++) {
        if (ghosts[i].seekMode != "home") {
          ghosts[i].scared = true;
          ghosts[i].scaredTimer = 600; // ADJUST DURATION OF POWER PILL MODE
          ghosts[i].bodyBlue = true; // RESET SCARED BODY TO BLUE
          ghostsEaten = 0;
        }
      }
    }
  },
  controls: function () {
    // ACCEPT TURN REQUESTS FROM USER:
    if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && pauseTimer === 0) {
      this.nextDir = "up";
    }
    if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && pauseTimer === 0) {
      this.nextDir = "down";
    }
    if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && pauseTimer === 0) {
      this.nextDir = "left";
    }
    if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && pauseTimer === 0) {
      this.nextDir = "right";
    }

    // CHECK WHICH DIRECTIONS PAC-MAN CAN MOVE:
    if (cell(Math.floor(this.x) + 1, Math.round(this.y)).type === "open") {
      this.canMoveRight = true;
    }
    else {
      this.canMoveRight = false;
    }
    if (cell(Math.ceil(this.x) - 1, Math.round(this.y)).type === "open") {
      this.canMoveLeft = true;
    }
    else {
      this.canMoveLeft = false;
    }
    if (cell(Math.round(this.x), Math.ceil(this.y) - 1).type === "open") {
      this.canMoveUp = true;
    }
    else {
      this.canMoveUp = false;
    }
    if (cell(Math.round(this.x), Math.floor(this.y) + 1).type === "open") {
      this.canMoveDown = true;
    }
    else {
      this.canMoveDown = false;
    }

    // APPLY DIRECTION CHANGE, IF ALLOWED:
    if (this.nextDir === "up" && this.canMoveUp === true && this.onGrid() === true) {
      this.dir = "up";
    }
    if (this.nextDir === "down" && this.canMoveDown === true && this.onGrid() === true) {
      this.dir = "down";
    }
    if (this.nextDir === "left" && this.canMoveLeft === true && this.onGrid() === true) {
      this.dir = "left";
    }
    if (this.nextDir === "right" && this.canMoveRight === true && this.onGrid() === true) {
      this.dir = "right";
    }
  },
  move: function () {
    if (this.dir === "right" && this.canMoveRight === true) {
      this.x += this.int;
    }
    if (this.dir === "left" && this.canMoveLeft === true) {
      this.x -= this.int;
    }
    if (this.dir === "up" && this.canMoveUp === true) {
      this.y -= this.int;
    }
    if (this.dir === "down" && this.canMoveDown === true) {
      this.y += this.int;
    }
    if (this.x < warp1left[mapVer]) { // WRAP AROUND LEFT SIDE TO RIGHT SIDE
      this.x = warp1right[mapVer];
      this.nextDir = "left";
      this.dir = "left";
    }
    if (this.x > warp1right[mapVer]) {  // WRAP AROUND RIGHT SIDE TO LEFT SIDE
      this.x = warp1left[mapVer];
      this.nextDir = "right";
      this.dir = "right";
    }
    if (this.y < warp1top[mapVer]) { // WRAP AROUND TOP TO BOTTOM
      this.y = warp1bottom[mapVer];
      this.nextDir = "up";
      this.dir = "up";
    }
    if (this.y > warp1bottom[mapVer]) { // WRAP AROUND BOTTOM TO TOP
      this.y = warp1top[mapVer];
      this.nextDir = "down";
      this.dir = "down";
    }
    // ROUND PAC-MAN'S POSITION TO THE GRID IF IT'S WITHIN 0.05 OF THE INTERVAL
    if (Math.abs(Math.round(pacMan.x) - pacMan.x) < pacMan.int * 0.95) { 
      pacMan.x = Math.round(pacMan.x);
    }
    if (Math.abs(Math.round(pacMan.y) - pacMan.y) < pacMan.int * 0.95) { 
      pacMan.y = Math.round(pacMan.y);
    }
  },
  death: function() {
    if (this.dead === true) {
      pauseTimer = Infinity; // PAUSE INDEFINITELY UNTIL ANIMATION COMPLETES
      push();
      fill(255, 255, 0); // YELLOW FOR PAC-MAN
      arc(this.xCoord, this.yCoord, tileSize, tileSize, this.deathArcPos1, this.deathArcPos2);
      this.deathArcPos1 += 0.03; // MOVE ARC POSITION CLOCKWISE
      this.deathArcPos2 -= 0.03; // MOVE ARC POSITION COUNTER-CLOCKWISE
      if (this.deathArcPos1 >= 1.57) { // FREEZE ARC AT HALF-PI STRAIGHT-DOWN POSITION (PAC-MAN IS GONE)
        this.deathArcPos1 = 1.57;
      }
      if (this.deathArcPos2 <= 1.57) { // FREEZE ARC AT HALF-PI STRAIGHT-DOWN POSITION (PAC-MAN IS GONE)
        this.deathArcPos2 = 1.57;
        this.dead = false;
        this.deathArcPos1 = -1.57, // RESET DEATH-ARC POSITION FOR NEXT DEATH
        this.deathArcPos2 =  4.71, // RESET DEATH-ARC POSITION FOR NEXT DEATH
        lives--; // LOSE ONE LIFE
        reset();
      }
      pop();
    }
  }
} // END PAC-MAN

class Ghost {
  constructor(startingX, startingY, color, exitDelay, huntType) {
    this.x = startingX;
    this.y = startingY;
    this.startingX = startingX;
    this.startingY = startingY;
    this.color = color;
    this.huntType = huntType; // "AHEAD", "BEHIND", OR "EXACT"
    this.startingExitDelay = exitDelay;
    this.exitDelay = exitDelay;
    this.exitTimer = 0;
    this.visible = true;
    this.dir = "none";
    this.int = 0.02 * speed;
    this.moveDirs = []; // KEEP TRACK OF VALID MOVEMENT DIRECTIONS
    this.closestDirs = []; // DIRECTIONS THAT MOVE TOWARDS TARGET COORDINATES
    this.skirtState = 0;
    this.dead = false;
    this.seekMode = "home"; // "HUNT", "RANDOM", "HOME"
    this.targetX = pacMan.x; // TARGET COORDINATES FOR HUNTING MODE
    this.targetY = pacMan.y; // TARGET COORDINATES FOR HUNTING MODE
    this.targetDebug = false; // ENABLE TO SHOW TARGET BOX
    this.scaredTimer = 0;
    this.scared = false;
    this.bodyBlue = true; // FOR FLASHING, TRUE MEANS BODY BLUE FACE WHITE, FALSE MEANS REVERSE
    this.scaredBodyColor = "rgb(50, 50, 255)";
    this.scaredFaceColor = 255;
    this.onGrid = function () { // CHECK WHETHER GHOST IS ON A GRID CELL
      if (this.x % 1 === 0 && this.y % 1 === 0) {
        return true;
      }
      else {
        return false;
      }
    },
    this.draw = function () {
      if (this.visible === true) {
      let xCoord = this.x * tileSize;
      let yCoord = this.y * tileSize;
      let eyeX = this.x * tileSize;
      let eyeY = this.y * tileSize;
      let pupilX = this.x * tileSize;
      let pupilY = this.y * tileSize;
      if (this.bodyBlue === true) {
        this.scaredBodyColor = "rgb(50, 50, 255)";
        this.scaredFaceColor = 255;
      }
      else {
        this.scaredBodyColor = 255;
        this.scaredFaceColor = "rgb(50, 50, 255)";
      }
      if (this.dir === "right" && this.scared === false) {
        eyeX = (this.x + 0.1) * tileSize;
        pupilX = (this.x + 0.175) * tileSize;
        eyeY = this.y * tileSize;
        pupilY = this.y * tileSize;
      }
      if (this.dir === "left" && this.scared === false) {
        eyeX = (this.x - 0.1) * tileSize;
        pupilX = (this.x - 0.175) * tileSize;
        eyeY = this.y * tileSize;
        pupilY = this.y * tileSize;
      }
      if (this.dir === "up" && this.scared === false) {
        eyeX = this.x * tileSize;
        pupilX = this.x * tileSize;
        eyeY = (this.y - 0.1) * tileSize;
        pupilY = (this.y - 0.175) * tileSize;
      }
      if (this.dir === "down" && this.scared === false) {
        eyeX = this.x * tileSize;
        pupilX = this.x * tileSize;
        eyeY = (this.y + 0.1) * tileSize;
        pupilY = (this.y + 0.175) * tileSize;
      }
      if (this.scared === true) {
        eyeX = this.x * tileSize;
        pupilX = this.x * tileSize;
        eyeY = this.y * tileSize;
        pupilY = this.y * tileSize;
      }
      // BEGIN GHOST BODY
      if (this.dead === false) {
        if (this.skirtState === 0) {
          push();
          noStroke();
          if (this.scared === false) {
            fill(this.color);  
          }
          else {
            fill(this.scaredBodyColor); // MAKE GHOST BLUE (OR FLASHING) IF SCARED
          }
          arc(xCoord, yCoord, tileSize, tileSize, PI, 0);  // DRAW GHOST HEAD
          beginShape(); // DRAW GHOST LEGS
          vertex(xCoord - tileSize * 0.5, yCoord);
          vertex(xCoord - tileSize * 0.5, yCoord + tileSize * 0.5);
          vertex(xCoord - tileSize * 0.33, yCoord + tileSize * 0.3);
          vertex(xCoord - tileSize * 0.166, yCoord + tileSize * 0.5);
          vertex(xCoord - tileSize * 0, yCoord + tileSize * 0.3);
          vertex(xCoord + tileSize * 0.166, yCoord + tileSize * 0.5);
          vertex(xCoord + tileSize * 0.33, yCoord + tileSize * 0.3);
          vertex(xCoord + tileSize * 0.5, yCoord + tileSize * 0.5);
          vertex(xCoord + tileSize * 0.5, yCoord);
          endShape(CLOSE);
          pop();
        }
        if (this.skirtState === 1) {
          push();
          noStroke();
          if (this.scared === false) {
            fill(this.color);
          }
          else {
            fill(this.scaredBodyColor); // MAKE GHOST BLUE (OR FLASHING) IF SCARED
          }
          arc(xCoord, yCoord, tileSize, tileSize, PI, 0);  // DRAW GHOST HEAD
          beginShape(); // DRAW GHOST LEGS
          vertex(xCoord - tileSize * 0.5, yCoord);
          vertex(xCoord - tileSize * 0.5, yCoord + tileSize * 0.3);
          vertex(xCoord - tileSize * 0.375, yCoord + tileSize * 0.5);
          vertex(xCoord - tileSize * 0.250, yCoord + tileSize * 0.3);
          vertex(xCoord - tileSize * 0.125, yCoord + tileSize * 0.5);
          vertex(xCoord - tileSize * 0, yCoord + tileSize * 0.3);
          vertex(xCoord + tileSize * 0.125, yCoord + tileSize * 0.5);
          vertex(xCoord + tileSize * 0.250, yCoord + tileSize * 0.3);
          vertex(xCoord + tileSize * 0.375, yCoord + tileSize * 0.5);
          vertex(xCoord + tileSize * 0.5, yCoord + tileSize * 0.3);
          vertex(xCoord + tileSize * 0.5, yCoord);
          endShape(CLOSE);
          pop();
        }
      }
      // END GHOST BODY
      // BEGIN GHOST EYES
      if (this.scared === false) { // NORMAL GHOST EYES
        push();
        noStroke();
        // LEFT EYE
        fill(255);
        ellipse(eyeX - tileSize * 0.2, eyeY - tileSize * 0.15, tileSize * 0.35, tileSize * 0.425);
        fill(0, 0, 150);
        ellipse(pupilX - tileSize * 0.2, pupilY - tileSize * 0.15, tileSize * 0.2, tileSize * 0.2);
        // RIGHT EYE
        fill(255);
        ellipse(eyeX + tileSize * 0.2, eyeY - tileSize * 0.15, tileSize * 0.35, tileSize * 0.425);
        fill(0, 0, 150);
        ellipse(pupilX + tileSize * 0.2, pupilY - tileSize * 0.15, tileSize * 0.2, tileSize * 0.2);
        pop();  
      }
      else { // SCARED GHOST EYES AND MOUTH
        push();
        noStroke();
        // LEFT EYE
        fill(this.scaredFaceColor);
        ellipse(pupilX - tileSize * 0.185, pupilY - tileSize * 0.15, tileSize * 0.2, tileSize * 0.2);
        // RIGHT EYE
        fill(this.scaredFaceColor);
        ellipse(pupilX + tileSize * 0.185, pupilY - tileSize * 0.15, tileSize * 0.2, tileSize * 0.2);
        // MOUTH
        stroke(this.scaredFaceColor);
        strokeWeight(tileSize / 15); // STROKEWEIGHT MUST BE RELATIVE TO TILESIZE
        line(xCoord - tileSize * 0.30, yCoord + tileSize * 0.2, xCoord - tileSize * 0.20, yCoord + tileSize * 0.1);
        line(xCoord - tileSize * 0.20, yCoord + tileSize * 0.1, xCoord - tileSize * 0.10, yCoord + tileSize * 0.2);
        line(xCoord - tileSize * 0.10, yCoord + tileSize * 0.2, xCoord - tileSize * 0.00, yCoord + tileSize * 0.1);
        line(xCoord + tileSize * 0.00, yCoord + tileSize * 0.1, xCoord + tileSize * 0.10, yCoord + tileSize * 0.2);
        line(xCoord + tileSize * 0.10, yCoord + tileSize * 0.2, xCoord + tileSize * 0.20, yCoord + tileSize * 0.1);
        line(xCoord + tileSize * 0.20, yCoord + tileSize * 0.1, xCoord + tileSize * 0.30, yCoord + tileSize * 0.2);
        pop();
      } 
      // END GHOST EYES
    } // END VISIBLE IF-STATEMENT
  }, // END DRAW METHOD  
    this.flash = function() { //
      if (this.scaredTimer % 10 === 0) { // INCREASE MOD TO SLOW FLASH RATE
        this.bodyBlue = !this.bodyBlue; // FLIP THE TRUE/FALSE VALUE OF BODYBLUE
      }
  },
    this.findClosestDir = function (targetX, targetY) { // DESTINATION COORDINATES
      let dirsFound = [];
      if (checkDist(this.x + 1, targetX) < checkDist(this.x, targetX)) { // MOVING RIGHT REDUCES DISTANCE
        dirsFound.push("right");
      }
      if (checkDist(this.x - 1, targetX) < checkDist(this.x, targetX)) { // MOVING LEFT REDUCES DISTANCE
        dirsFound.push("left");
      }
      if (checkDist(this.y + 1, targetY) < checkDist(this.y, targetY)) { // MOVING DOWN REDUCES DISTANCE
        dirsFound.push("down");
      }
      if (checkDist(this.y - 1, targetY) < checkDist(this.y, targetY)) { // MOVING UP REDUCES DISTANCE
        dirsFound.push("up");
      }
      this.closestDirs = dirsFound;
    },
    this.move = function () {
      this.x = Math.round(this.x * 100) / 100; // ROUND TO 0.01 DECIMAL PLACE TO PREVENT FLOAT ERRORS
      this.y = Math.round(this.y * 100) / 100; // ROUND TO 0.01 DECIMAL PLACE TO PREVENT FLOAT ERRORS
      // ROUND POSITION TO THE GRID IF IT'S WITHIN 0.05 OF THE INTERVAL
      if (Math.abs(Math.round(this.x) - this.x) < this.int * 0.95) { 
        this.x = Math.round(this.x);
      }
      if (Math.abs(Math.round(this.y) - this.y) < this.int * 0.95) { 
        this.y = Math.round(this.y);
      }
       // GHOST GETS EATEN (PAC-MAN EATS GHOST)
      if (collision(this.x, this.y, pacMan.x, pacMan.y, 0.5) && this.scared === true) {
        ghostsEaten++;
        score += 2**ghostsEaten * 100; // SCORE BONUS = 2 RAISED TO THE POWER OF GHOSTS EATEN
        showBonus = true; // DISPLAY BONUS SCORE OVERLAY
        this.dead = true;
        this.x = Math.round(this.x * 10) / 10; // SNAP COORDINATES BACK TO 0.1 ALIGNMENT AFTER SLOW MOVEMENT ENDS
        this.y = Math.round(this.y * 10) / 10; // SNAP COORDINATES BACK TO 0.1 ALIGNMENT AFTER SLOW MOVEMENT ENDS
        pauseTimer = 45; // BRIEF PAUSE WHEN A GHOST IS EATEN
        if (soundEnabled) {
          eatGhostSound.play();  
        }
      }
  
      // PAC-MAN KILLED BY GHOST
      if (collision(this.x, this.y, pacMan.x, pacMan.y, 0.5) && this.scared === false && this.dead === false) { 
        pauseTimer = 60; // PAUSE FOR ONE SECOND (ASSUMING 60 FPS)
        setTimeout(deathSequence, 1000); // CALL DEATH SEQUENCE FUNCTION AFTER ONE SECOND
      }
      
      if (this.scared === true) {
        this.int = 0.01 * speed; // GHOST MOVES SLOWER WHEN SCARED
        this.scaredTimer --; // MAKE TIMER GO DOWN
        this.seekMode = "random"; // GHOST MOVES RANDOMLY WHEN SCARED
        if (this.scaredTimer < 240 && this.scaredTimer > 0) { // ADJUST DURATION OF FLASHING MODE
          this.flash();
        }
        if (this.scaredTimer <= 0) { // END SCARED MODE WHEN TIMER ENDS
          this.scaredTimer = 0;
          this.scared = false;
          this.bodyBlue = true; // RESET SCARED BODY TO BLUE SO NEXT POWER PILL DOESN'T RESULT IN WHITE GHOST
        }
      }
      else if (this.dead === false && this.seekMode != "home") { // DON'T DOUBLE-ROUND IF GHOST IS AT HOME
        if (this.onGrid() === true) { // WAIT TILL ON-GRID BEFORE SWITCHING MOVEMENT INTERVALS
          this.int = 0.02 * speed; // ORIGINAL GHOST SPEED
        }
        this.seekMode = "hunt"; // GO BACK TO HUNTING WHEN SCARED MODE ENDS
      }
  
      if (this.dead === true) {
        this.scared = false;
        this.seekMode = "hunt";
        if (this.onGrid() === true) { // WAIT TILL ON-GRID BEFORE SWITCHING MOVEMENT INTERVALS
          this.int = 0.04 * speed; // EYEBALLS MOVE HOME QUICKLY  
        }
        this.targetX = homeEntranceX[mapVer]; // GHOST USES HUNT MODE TO MOVE TO CELL ABOVE GHOST EXIT
        this.targetY = homeEntranceY[mapVer]; // GHOST USES HUNT MODE TO MOVE TO CELL ABOVE GHOST EXIT
        if (this.x >= homeEntranceX[mapVer] - 0.5 && this.x <= homeEntranceX[mapVer] + 0.5 && this.y === homeEntranceY[mapVer]) { // GHOST IS ABOVE EXIT, HUNT MODE ENDS AND GHOST MOVES DOWN
          this.seekMode = "none";
          this.dir = entranceDir[mapVer];
        }
        if (this.x >= homeBoundaryLeft[mapVer] && this.x <= homeBoundaryRight[mapVer] && this.y >= homeBoundaryTop[mapVer] && this.y <= homeBoundaryBottom[mapVer]) { // DEAD GHOST MADE IT HOME, GOES BACK TO HOME MODE
          this.dead = false;
          this.seekMode = "home";
          this.exitTimer = 0; // RESET EXIT TIMER
          this.exitDelay = 60; // ALL GHOSTS GET THE SAME EXIT DELAY UPON ARRIVING HOME
        }
      }
      
      // UPDATE TARGET COORDINATES BASED ON HUNT TYPE
      let targetAdj = 0;
      if (this.huntType === "exact") {
        targetAdj = 0;
      }
      if (this.huntType === "ahead") {
        targetAdj = 4;
      }
      if (this.huntType === "behind") {
        targetAdj = -4;
      }
      if (pacMan.onGrid() === true) { // PAC-MAN MUST BE ON THE GRID BEFORE UPDATING TARGET COORDINATES
        if (pacMan.dir === "right" && this.dead === false) {
          this.targetX = pacMan.x + targetAdj;
          this.targetY = pacMan.y;
        }
        if (pacMan.dir === "left" && this.dead === false) {
          this.targetX = pacMan.x - targetAdj;
          this.targetY = pacMan.y;
        }
        if (pacMan.dir === "up" && this.dead === false) {
          this.targetX = pacMan.x;
          this.targetY = pacMan.y - targetAdj;
        }
        if (pacMan.dir === "down" && this.dead === false) {
          this.targetX = pacMan.x;
          this.targetY = pacMan.y + targetAdj;
        }
      }
  
      // BEGIN HOME MOVEMENT MODE
      if (this.seekMode === "home") {
        this.scaredTimer = 0;
        this.int = 0.02 * speed;
        this.x = Math.round(this.x * 10) / 10; // FIX FLOATING POINT ERRORS
        this.y = Math.round(this.y * 10) / 10; // FIX FLOATING POINT ERRORS
        if (this.exitTimer < this.exitDelay) { // HANG OUT AT HOME UNTIL EXITTIMER REACHES EXIT DELAY
          this.dir = "none";
          if (this.x < this.startingX) { // FIND PROPER X POSITION WITHIN HOME
            this.x += this.int;
          }
          if (this.x > this.startingX) { // FIND PROPER X POSITION WITHIN HOME
            this.x -= this.int;
          }
          if (this.y < this.startingY) { // MOVE GHOST DOWN TO ITS PROPER Y POSITION WHEN IT ARRIVES HOME
            this.y += this.int;
          }
          this.exitTimer += 0.35;
          if (this.y > this.startingY - 0.1) { // START BOUNCING ONCE GHOST IS CLOSE ENOUGH TO ITS STARTING Y POSITION
            this.y = this.startingY + Math.sin(this.exitTimer) * 0.125; // VERTICAL BOUNCING  
          }
        }
        else if (this.x < homeEntranceX[mapVer]) { // EXIT DELAY IS OVER, IF LEFT OF EXIT, MOVE RIGHT TO HORIZONTAL CENTER OF EXIT
          this.dir = "right";
        }
        else if (this.x > homeEntranceX[mapVer]) { // EXIT DELAY IS OVER, IF RIGHT OF EXIT, MOVE RIGHT TO HORIZONTAL CENTER OF EXIT
          this.dir = "left";
        }
        else { // MOVE UP THROUGH EXIT WHEN POSITIONED PROPERLY
          this.dir = "up";
        }
        if (this.y <= homeEntranceY[mapVer]) { // GHOST HAS EXITED HOME
          this.y = homeEntranceY[mapVer];
          this.dir = exitDir[mapVer]; // MOVE LEFT AFTER EXITING HOME
          this.seekMode = "hunt"; // START HUNTING
        }
      } // END: HOME MOVEMENT MODE
  
      // BEGIN RANDOM MOVEMENT MODE
      if (this.seekMode === "random") {
        if (this.onGrid() === true) {
          this.dirCheck(); // UPDATE MOVEDIRS ARRAY WITH ALL POSSIBLE MOVEMENT DIRECTIONS
          this.dir = this.moveDirs[randNum(0, this.moveDirs.length)]; // PICK A NEW RANDOM DIRECTION FROM MOVEDIRS
        }
      } // END: RANDOM MOVEMENT MODE
  
      if (this.seekMode === "hunt") {
        if (this.onGrid() === true) {
          this.dirCheck(); // UPDATE MOVEDIRS ARRAY WITH ALL POSSIBLE MOVEMENT DIRECTIONS
          this.findClosestDir(this.targetX, this.targetY); // UPDATE CLOSESTDIRS ARRAY WITH DIRECTIONS THAT ARE CLOSER TO TARGET
          let matchingDir = findArrayMatch(this.moveDirs, this.closestDirs); // FIND A CLOSER DIRECTION THAT IS ALLOWED
          if (matchingDir != undefined) {  // IF THERE'S A MATCHING DIRECTION, USE IT
            this.dir = matchingDir;
          }
          else { // IF THERE ARE NO ALLOWED DIRECTIONS THAT RESULT IN CLOSER DISTANCE, PICK A RANDOM ONE
            this.dir = this.moveDirs[randNum(0, this.moveDirs.length)];
          }
        }
        if (this.targetDebug === true) { // FOR TESTING (HIGHLIGHT TARGET CELL):
          push();
          fill(this.color);
          // IF-STATEMENT PREVENTS ERROR CAUSED BY TRYING TO DRAW SQUARE OFF-MAP
          if (cell(this.targetX, this.targetY) != undefined && cell(this.targetX, this.targetY) != undefined) { 
            rect(cell(this.targetX, this.targetY).x, cell(this.targetX, this.targetY).y, tileSize);
          }
          pop();  
        }
  
      } // END: HUNTING MODE
      if (this.x < warp1left[mapVer]) { // WRAP AROUND LEFT SIDE TO RIGHT SIDE
        this.x = warp1right[mapVer];
        this.dir = "left";
      }
      if (this.x > warp1right[mapVer]) {  // WRAP AROUND RIGHT SIDE TO LEFT SIDE
        this.x = warp1left[mapVer];
        this.dir = "right";
      }
      if (this.y < warp1top[mapVer]) { // WRAP AROUND LEFT SIDE TO RIGHT SIDE
        this.y = warp1bottom[mapVer];
        this.dir = "up";
      }
      if (this.y > warp1bottom[mapVer]) {  // WRAP AROUND RIGHT SIDE TO LEFT SIDE
        this.y = warp1top[mapVer];
        this.dir = "down";
      }
      if (this.dir === "left") {
        this.x -= this.int;
      }
      if (this.dir === "right") {
        this.x += this.int;
      }
      if (this.dir === "up") {
        this.y -= this.int;
      }
      if (this.dir === "down") {
        this.y += this.int;
      }
    }, // END MOVE METHOD
    this.dirCheck = function () {
      if (this.onGrid() === true) { // MUST BE ON THE GRID TO CHECK DIRECTIONS
        this.moveDirs = []; // CLEAR THE MOVEDIRS ARRAY SO IT CAN BE REPOPULATED
        if (cell(this.x - 1, this.y).type === "open") {
          this.moveDirs.push("left");
        }
        if (cell(this.x + 1, this.y).type === "open") {
          this.moveDirs.push("right");
        }
        if (cell(this.x, this.y - 1).type === "open") {
          this.moveDirs.push("up");
        }
        if (cell(this.x, this.y + 1).type === "open") {
          this.moveDirs.push("down");
        }
        
        if (this.moveDirs.length > 1) { // AT LEAST TWO POSSIBLE DIRECTIONS (NOT AT A DEAD END)
          removeIfPresent(this.moveDirs, oppositeDir(this.dir)); // REMOVE THE OPPOSITE DIRECTION
        }
        // console.log(this.moveDirs); // FOR TESTING
      }
    } // END DIRCHECK METHOD
  }
} // END GHOST CONSTRUCTOR

let fruit = {
  x: fruitX[mapVer],
  y: fruitY[mapVer],
  // x: 3, // FOR TESTING
  // y: 3, // FOR TESTING
  type: "cherries",
  types: ["cherries", "strawberry", "watermelon", "pineapple"],
  //types: ["strawberry"], // FOR TESTING
  value: 400,
  values: [400, 800, 1600, 3200],
  visible: false,
  spawn: function() {
    if (this.visible === false && randNum(0, 1000) === 0) { // CHANCE OF SPAWNING
      let randItem = randNum(0, this.types.length);
      this.type = this.types[randItem];
      this.value = this.values[randItem];
      this.visible = true;
    }
    if (collision(this.x, this.y, pacMan.x, pacMan.y, 0.5) && this.visible === true) { // PAC-MAN EATS FRUIT
      pauseTimer = 30;
      showFruitBonus = true;
      this.visible = false;
      score += this.value;
    }
  },
  draw: function() {
    if (this.visible === true) {
      if (this.type === "cherries") {
        push();
        fill(255, 0, 0);
        stroke(0);
        strokeWeight(tileSize / 15);
        //      X POSITION                            Y POSITION                           WIDTH           HEIGHT
        ellipse(this.x * tileSize - tileSize * 0.225, this.y * tileSize - tileSize * 0.00, tileSize * 0.6, tileSize * 0.6); // LEFT CHERRY
        ellipse(this.x * tileSize + tileSize * 0.225, this.y * tileSize + tileSize * 0.20, tileSize * 0.6, tileSize * 0.6); // RIGHT CHERRY
        noStroke();
        fill(255, 255, 255);
        //      X POSITION                           Y POSITION                           WIDTH            HEIGHT
        ellipse(this.x * tileSize - tileSize * 0.35, this.y * tileSize + tileSize * 0.05, tileSize * 0.15, tileSize * 0.15); // LEFT HIGHLIGHT
        ellipse(this.x * tileSize + tileSize * 0.15, this.y * tileSize + tileSize * 0.30, tileSize * 0.15, tileSize * 0.15); // RIGHT HIGHLIGHT
        noFill();
        stroke(200, 150, 60);
        strokeWeight(tileSize / 7.5);
        //  X POSITION                           Y POSITION                           WIDTH           HEIGHT          ANG1 ANG2
        arc(this.x * tileSize + tileSize * 0.7,  this.y * tileSize - tileSize * 0.25, tileSize * 1.7, tileSize * 0.6, 3.14, -2);
        arc(this.x * tileSize + tileSize * 0.85, this.y * tileSize - tileSize * 0.10, tileSize * 1.2, tileSize * 1.0, 3.14, -2);
        pop();  
      }
      if (this.type === "strawberry") {
        push();
        fill(255, 0, 0);
        noStroke();
        //      X POSITION                            Y POSITION                          WIDTH           HEIGHT
        ellipse(this.x * tileSize - tileSize * 0.22, this.y * tileSize - tileSize * 0.2, tileSize * 0.55, tileSize * 0.55);
        ellipse(this.x * tileSize + tileSize * 0.22, this.y * tileSize - tileSize * 0.2, tileSize * 0.55, tileSize * 0.55);
        ellipse(this.x * tileSize, this.y * tileSize + tileSize * 0.275, tileSize * 0.40, tileSize * 0.40);
        triangle(this.x * tileSize - tileSize * 0.5, this.y * tileSize - tileSize * 0.1, this.x * tileSize + tileSize * 0.5, this.y * tileSize - tileSize * 0.1, this.x * tileSize, this.y * tileSize + tileSize * 0.5);
        //      X POSITION                          Y POSITION                          WIDTH           HEIGHT
        fill(255, 255, 255);
        ellipse(this.x * tileSize - tileSize * 0.2, this.y * tileSize - tileSize * 0.0, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.175, this.y * tileSize + tileSize * 0.1, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize - tileSize * 0.3, this.y * tileSize - tileSize * 0.2, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.3, this.y * tileSize - tileSize * 0.225, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.2, this.y * tileSize - tileSize * 0.08, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.0, this.y * tileSize - tileSize * 0.15, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize - tileSize * 0.05, this.y * tileSize + tileSize * 0.2, tileSize * 0.1, tileSize * 0.1); // SEEDS
        noFill();
        stroke(0, 255, 0);
        strokeWeight(tileSize / 7.5);
        //  X POSITION                          Y POSITION                          WIDTH            HEIGHT           ANG1 ANG2
        arc(this.x * tileSize + tileSize * 0.1, this.y * tileSize - tileSize * 0.5, tileSize * 0.25, tileSize * 0.35, 3.14, -2);
        fill(0, 255, 0);
        noStroke();
        triangle(this.x * tileSize - tileSize * 0.375, this.y * tileSize - tileSize * 0.49, this.x * tileSize + tileSize * 0.375, this.y * tileSize - tileSize * 0.49, this.x * tileSize, this.y * tileSize - tileSize * 0.25)
        pop();  
      }
      if (this.type === "watermelon") {
        push();
        
        fill(255, 0, 0);
        triangle(this.x * tileSize - tileSize * 0.6, this.y * tileSize + tileSize * 0.1, this.x * tileSize + tileSize * 0.6, this.y * tileSize + tileSize * 0.1, this.x * tileSize, this.y * tileSize - tileSize * 0.5)   
        strokeWeight(tileSize / 10);
        stroke(0, 255, 0);
        arc(this.x * tileSize, this.y * tileSize - tileSize * 0.10, tileSize * 1.2, tileSize * 1.0, 0.34, 2.8);
        stroke(255, 180, 180);
        arc(this.x * tileSize, this.y * tileSize - tileSize * 0.1, tileSize * 1.05, tileSize * 0.85, 0.34, 2.8);
        noStroke();
        fill(0);
        //      X POSITION                          Y POSITION                          WIDTH           HEIGHT
        ellipse(this.x * tileSize - tileSize * 0.2, this.y * tileSize - tileSize * 0.0, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.175, this.y * tileSize + tileSize * 0.1, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize - tileSize * 0.25, this.y * tileSize - tileSize * 0.2, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.05, this.y * tileSize - tileSize * 0.35, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.2, this.y * tileSize - tileSize * 0.08, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize + tileSize * 0.0, this.y * tileSize - tileSize * 0.15, tileSize * 0.1, tileSize * 0.1); // SEEDS
        ellipse(this.x * tileSize - tileSize * 0.05, this.y * tileSize + tileSize * 0.2, tileSize * 0.1, tileSize * 0.1); // SEEDS
        pop();  
      }
      if (this.type === "pineapple") {
        push();
        fill(255, 255, 0);
        stroke(0);
        strokeWeight(tileSize / 15);
        ellipse(this.x * tileSize, this.y * tileSize + tileSize * 0.1, tileSize * 0.7, tileSize * 0.8); // PINEAPPLE BODY
        noStroke();
        fill(255, 255, 255);
        stroke(0, 255, 0); // GREEN FOR STEM
        strokeWeight(tileSize / 10);
        noFill();
        arc(this.x * tileSize + tileSize * 0.4, this.y * tileSize - tileSize * 0.30, tileSize * 0.8, tileSize * 0.6, 3.14, -2); // STEMS
        arc(this.x * tileSize + tileSize * 0.4, this.y * tileSize - tileSize * 0.20, tileSize * 0.8, tileSize * 0.5, 3.14, -2); // STEMS
        arc(this.x * tileSize - tileSize * 0.4, this.y * tileSize - tileSize * 0.30, tileSize * 0.8, tileSize * 0.6, -1.17, 0); // STEMS
        arc(this.x * tileSize - tileSize * 0.4, this.y * tileSize - tileSize * 0.20, tileSize * 0.8, tileSize * 0.5, -1.17, 0); // STEMS
        stroke(255, 140, 0);
        strokeWeight(tileSize / 17.5);
        line(this.x * tileSize - tileSize * 0.175, this.y * tileSize - tileSize * 0.175, this.x * tileSize + tileSize * 0.275, this.y * tileSize + tileSize * 0.12);
        line(this.x * tileSize + tileSize * 0.175, this.y * tileSize - tileSize * 0.175, this.x * tileSize - tileSize * 0.275, this.y * tileSize + tileSize * 0.12);
        line(this.x * tileSize - tileSize * 0.275, this.y * tileSize - tileSize * 0, this.x * tileSize + tileSize * 0.175, this.y * tileSize + tileSize * 0.275);
        line(this.x * tileSize + tileSize * 0.275, this.y * tileSize - tileSize * 0, this.x * tileSize - tileSize * 0.175, this.y * tileSize + tileSize * 0.275);
        pop();  
      }
    }
  }
}

function cell(x, y) { // USE X AND Y TO ACCESS AN ITEM FROM TILEMAP
  return tileMap[x + y * columns];
}

function randNum(min, max) { // MIN IS INCLUSIVE, MAX IS EXCLUSIVE
  return (Math.floor(Math.random() * (max - min)) + min);
}

function checkDist(num1, num2) {
  return Math.abs(num1 - num2);
}

function oppositeDir(inputDir) {
  switch (inputDir) {
    case "up": return "down";
    case "down": return "up";
    case "left": return "right";
    case "right": return "left";
  }
}

function removeIfPresent(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) {
      array.splice(i, 1);
    }
  }
}

function findArrayMatch(array1, array2) { // FIND A MATCHING ITEM BETWEEN TWO ARRAYS
  let matches = [];
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        matches.push(array1[i]);
      }
    }
  }
  return matches[randNum(0, matches.length)]; // RETURN A RANDOM MATCHING DIRECTION
}

function blink() { // ALTERNATE FILL COLOR OF POWER-PILL
  if (blinkColor === "white") {
    blinkColor = "black";
  }
  else {
    blinkColor = "white";
  }
}

function skirtChange() {
  for (let i = 0; i < ghosts.length; i++) { // UPDATE FOR CONSTRUCTOR
    if (ghosts[i].skirtState === 0) {
      ghosts[i].skirtState = 1;
    }  
    else {
      ghosts[i].skirtState = 0;
    }
  }  
}

function pauseHandler() {
  pauseTimer --;
  if (pauseTimer <= 0) {
    pauseTimer = 0;
    getReady = false;
    showBonus = false;
    showFruitBonus = false;
  }
  if (getReady === true) {
    showText("READY!", textX[mapVer], textY[mapVer], 0.95, "yellow", "CENTER"); // STRING, X, Y, SIZE, COLOR, ALIGN (SIZE IS NOT PT. SIZE)
  }
  if (showBonus === true) {
    showText(2**ghostsEaten * 100, pacMan.x, pacMan.y, 1.2, "white", "CENTER"); // STRING, X, Y, SIZE, COLOR, ALIGN
  }
  if (showFruitBonus === true) {
    showText(fruit.value, pacMan.x, pacMan.y, 1.2, "white", "CENTER"); // STRING, X, Y, SIZE, COLOR, ALIGN
  }
  if (introScreen === true) {
    push();
    noStroke();
    fill("rgba(0, 0, 0, 0.75)");
    rect(width/2, height/2, width, height); // DARKEN SCREEN
    pop();
    textAlign(CENTER);
    showText("PAC-MAN", textX[mapVer], 6.5, 3, "yellow", "CENTER");
    showText("Coded in p5js JavaScript\n by Dane Hartman,\n CS Teacher at WRHS\ndane.hartman@jeffco.k12.co.us", 19.5, 11.5, 1, "yellow", "CENTER");
    showText("Use Arrow Keys or WASD to Control\n10,000 Points = Extra Life\nUnique Map for Each Level", textX[mapVer], 16.5, 1, "white", "CENTER");
    showText("Game Speed:", textX[mapVer], 24, 1.25, "white", "CENTER");
    showText(speed - 2, textX[mapVer], 26.6, 2, "white", "CENTER");
  }
}

function soundHandler() {
  if (soundEnabled) {
    soundTimeout++;
    let scaredGhostPresent = false;
    if (pauseTimer === 0 && pacMan.dead === false) {
      sirenSound.loop();
    }
    else {
      sirenSound.pause();
    }
    if (cell(Math.round(pacMan.x), Math.round(pacMan.y)).pill === "normal" && pauseTimer === 0) {
      chompSound.loop();
      soundTimeout = 0;
    }
    if (soundTimeout >= 50 / speed) { // PAUSE CHOMP SOUND DELAY SCALES WITH GAME SPEED
     chompSound.pause() ;
    }
    if (pacMan.dead) {
      deathSound.play();
    }
    for (let i = 0; i < ghosts.length; i++) {
      if (ghosts[i].scaredTimer > 0) {
        scaredGhostPresent = true;
      }
    }
    if (scaredGhostPresent === true && pauseTimer === 0) {
      powerSound.loop();  
    }
    else {
      powerSound.pause();
    }
    if (collision(fruit.x, fruit.y, pacMan.x, pacMan.y, 0.5) && fruit.visible === true) { // PAC-MAN EATS FRUIT
      fruitSound.play();
    }
    // eatGhostSound.play() IS CALLED OUTSIDE OF THIS FUNCTION WHERE PAC-MAN EATS GHOST
  }
}

function increaseSpeed() {
  if (speed < 7) {
    speed++;
  }
}

function decreaseSpeed() {
  if (speed > 3) {
    speed--;
  }
}

function startGame() {
  pacMan.int = 0.02 * speed; // INT MUST BE UPDATED BECAUSE SPEED MAY HAVE CHANGED AND OBJECT PROPERTY HAS ALREADY BEEN DEFINED
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].int = 0.02 * speed; // INT MUST BE UPDATED BECAUSE SPEED MAY HAVE CHANGED AND OBJECT PROPERTY HAS ALREADY BEEN DEFINED
  }
  startButton.hide();
  restartButton.hide();
  increaseButton.hide();
  decreaseButton.hide();
  checkbox.hide();
  lives = 3;
  score = 0;
  getReady = true;
  mapVer = -1; // RESETMAP INCREASES MAPVER BY 1, SO STARTING IT AT -1 ENSURES IT WILL LAUNCH AT 0
  resetMap();
  reset();
  introScreen = false;
  pauseTimer = 250; // DELAY BEFORE GAME STARTS
  if (soundEnabled) {
    introSound.play();  
  }
}

function showText(textStr, x, y, size, color, align) {
  textSize(tileSize * size);
  if (align === "LEFT") {
    textAlign(LEFT);
  }
  if (align === "RIGHT") {
    textAlign(RIGHT);
  }
  if (align === "CENTER") {
    textAlign(CENTER);
  }
  push();
  fill(color);
  stroke(0, 0, 0);
  strokeWeight(7);
  strokeJoin(ROUND); // FIX SPIKES IN STROKE
  textStyle(BOLD);
  text(textStr, tileSize * x, tileSize * y);
  pop();
}

function deathSequence() {
  for (let i = 0; i < ghosts.length; i++) { // UPDATE FOR CONSTRUCTOR
    ghosts[i].visible = false; // HIDE GHOSTS FOR DEATH SEQUENCE
  }
  pacMan.dead = true; // TRIGGER PAC-MAN DEATH ANIMATION
}

function lifeDisplay() {
  if (score >= extraLifeGoal) {
    extraLifeGoal += 10000; // MOVE THE EXTRA-LIFE "GOALPOST" FURTHER OUT
    if (lives <= 4) { // LIMIT LIVES TO FIVE
      lives++;
    }
  }
  if (lives >= 0) {
    for (let i = 0; i < lives; i++) {
    push();
    fill(255, 255, 0);
    arc((34 + i) * tileSize, 0.85 * tileSize, tileSize, tileSize, 0.8, -0.8); // X, Y, WIDTH, HEIGHT, STARTING ANGLE, ENDING ANGLE
    pop();
    }
  }
  else {
    pauseTimer = Infinity;
    getReady = false;
    push();
    noStroke();
    fill("rgba(0, 0, 0, 0.75)");
    rect(width/2, height/2, width, height); // DARKEN SCREEN
    pop();
    showText("GAME OVER", textX[mapVer], textY[mapVer], 0.95, "yellow", "CENTER"); // STRING, X, Y, SIZE, COLOR, ALIGN
    restartButton.show();
  }
}

function levelComplete() {
  if (pillsRemaining === 0) {
    pillsRemaining = -1; // PREVENT FUNCTION FROM RUNNING MULTIPLE TIMES
    pauseTimer = Infinity; // PAUSE INDEFINITELY UNTIL ANIMATION COMPLETES
    for (let i = 0; i < ghosts.length; i++) { // UPDATE FOR CONSTRUCTOR
      ghosts[i].visible = false; // HIDE GHOSTS UPON LEVEL COMPLETION
    }
    setTimeout(resetMap, 1500);
    setTimeout(reset, 1500);
    }
  if (pillsRemaining === -1) { // ONCE THE TIMEOUTS HAVE BEEN TRIGGERED, SHOW "STAGE COMPLETE"
    showText("STAGE COMPLETE", textX[mapVer], textY[mapVer], 0.95, "yellow", "CENTER"); // STRING, X, Y, SIZE, COLOR, ALIGN
  }
}

function reset() {
  pacMan.x = pacManStartX[mapVer];
  pacMan.y = pacManStartY[mapVer];
  pacMan.dir = "right";
  pacMan.nextDir = "right";
  ghost1.startingX = ghost1x[mapVer];
  ghost1.startingY = ghost1y[mapVer];
  ghost2.startingX = ghost2x[mapVer];
  ghost2.startingY = ghost2y[mapVer];
  ghost3.startingX = ghost3x[mapVer];
  ghost3.startingY = ghost3y[mapVer];
  ghost4.startingX = ghost4x[mapVer];
  ghost4.startingY = ghost4y[mapVer];
  fruit.x = fruitX[mapVer];
  fruit.y = fruitY[mapVer];
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].x = ghosts[i].startingX;
    ghosts[i].y = ghosts[i].startingY;
    ghosts[i].exitDelay = ghosts[i].startingExitDelay; // GHOSTS GET THEIR ORIGINAL EXITDELAY UPON RESET
    ghosts[i].dir = "none";
    ghosts[i].visible = true;
    ghosts[i].scared = false;
    ghosts[i].dead = false;
    ghosts[i].seekMode = "home";
    ghosts[i].exitTimer = 0;
  }
  getReady = true;
  fruit.visible = false;
  pauseTimer = 70;
}

function resetMap() {
  mapVer++;
  // mapVer = 0; // FOR TESTING
  if (mapVer > 2) { // LOOP MAPS ONCE LAST ONE HAS BEEN REACHED
    mapVer = 0;
  }
  pillsRemaining = 0;
  tileMap = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      tileMap.push({ x: x * tileSize, y: y * tileSize, type: tileTypes[mapVer][x + y * columns] });
    }
  }
  for (let i = 0; i < tileMap.length; i++) { // TRANSLATE TYPE PROPERTY FROM NUMBERS TO STRINGS
    if (tileMap[i].type === 0) {
      tileMap[i].type = "open";
      tileMap[i].pill = "none";
    }
    if (tileMap[i].type === 1) {
      tileMap[i].type = "wall";
      tileMap[i].pill = "none";
    }
    if (tileMap[i].type === 2) {
      tileMap[i].type = "open";
      tileMap[i].pill = "normal";
      pillsRemaining++; // COUNT PILLS AS THEY ARE CREATED
    }
    if (tileMap[i].type === 3) {
      tileMap[i].type = "open";
      tileMap[i].pill = "power";
    }
    if (tileMap[i].type === 4) {
      tileMap[i].type = "ghostwall";
      tileMap[i].pill = "none";
    }
  }
  //pillsRemaining = 10; // FOR TESTING
}

function collision(obj1x, obj1y, obj2x, obj2y, tolerance) {
  if (Math.abs(obj1x - obj2x) <= tolerance && Math.abs(obj1y - obj2y) <= tolerance) {
    return true;
  }
  else {
    return false;
  } 
}

setInterval(blink, 200); // MAKE POWER-PILLS BLINK
setInterval(skirtChange, 125); // GHOST-BOTTOM ANIMATION EFFECT

let ghost1 = new Ghost(ghost1x[mapVer], ghost1y[mapVer], "rgb(255, 150, 0)", 300, "exact"); // ORANGE (X, Y, COLOR, DELAY, HUNT TYPE)
let ghost2 = new Ghost(ghost2x[mapVer], ghost2y[mapVer], "rgb(0, 200, 255)", 210, "behind"); // BLUE GHOST (X, Y, COLOR, DELAY, HUNT TYPE)
let ghost3 = new Ghost(ghost3x[mapVer], ghost3y[mapVer], "rgb(255, 175, 175)", 120, "ahead"); // PINK GHOST (X, Y, COLOR, DELAY, HUNT TYPE)
let ghost4 = new Ghost(ghost4x[mapVer], ghost4y[mapVer], "rgb(255, 25, 0)", 30, "exact"); // RED GHOST (X, Y, COLOR, DELAY, HUNT TYPE)
let ghosts = []; // ARRAY CONTAINING ALL GHOSTS
ghosts.push(ghost1, ghost2, ghost3, ghost4);

// pillsRemaining = 10; // FOR TESTING

function draw() {
  background("black");
  updateMap();
  soundHandler(); // MUST COME BEFORE OTHER COLLISION DETECTION FUNCTIONS
  pacMan.controls();
  pacMan.draw();
  pacMan.death();
  fruit.spawn();
  fruit.draw();
  for (let i = 0; i < ghosts.length; i++) { 
    ghosts[i].draw();
  }
  if (pauseTimer === 0) {
    pacMan.chomp();
    pacMan.move();
    for (let i = 0; i < ghosts.length; i++) { 
      ghosts[i].move();
    }
  }
  lifeDisplay();
  levelComplete();
  pauseHandler(); // PLACE AFTER OTHER DRAW METHODS TO MAKE SURE BONUS OVERLAY DISPLAYS PROPERLY
  showText("Score: " + score, 0.7, 0.85, 1.2, "white", "LEFT"); // STRING, X, Y, SIZE, COLOR, ALIGN
}

