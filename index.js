var isGameOver;
var score;

var GRAVITY = 0.5;
var JUMP = -17;
var doubleJump = 0;
var speed = 5;
var t = 0;
var lastobsx = 0;
var coinstringheight1 = 5;
var coinstringheight2 = 5;

var groundSprites;
var GROUND_SPRITE_WIDTH = 50;
var GROUND_SPRITE_HEIGHT = 50;
var numGroundSprites;

var player;

var coinSprites;
var obstacleSprites;

var coinSound;
var crashSound;
var jumpSounds;
var backgroundSound;
var gameoverSound;

var gameover = 0;

function preload(){
    coinSound = loadSound('sounds/coin4.wav');
    crashSound = loadSound('sounds/crash4.wav');
    jumpSounds = [loadSound('sounds/jump1.wav'), loadSound('sounds/jump2.wav'), loadSound('sounds/jump3.wav'), loadSound('sounds/jump4.wav'), loadSound('sounds/jump5.wav')];
    backgroundSound = loadSound('sounds/background.mp3');
    gameoverSound = loadSound('sounds/gameover.wav');
}

function setup() {
    isGameOver = false;
    score = 0;
    
    createCanvas(window.innerWidth, window.innerHeight-4);
    background(150, 200, 250);
    groundSprites = new Group();
    
    numGroundSprites = width/GROUND_SPRITE_WIDTH+1;

    for (var n = 0; n < numGroundSprites; n++) {
        var groundSprite = createSprite(n*50, height-25, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT);
        groundSprite.shapeColor = "black";
        groundSprites.add(groundSprite);
    }
    
    player = createSprite(100, height-75, 50, 50);
    player.shapeColor = "red";
    
    coinSprites = new Group();
    obstacleSprites = new Group();
    backgroundSound.setVolume(0.1);
    backgroundSound.loop();
    
    gameover = 50 + random()*250;
}

function draw() {
    if (isGameOver) {
        background(0);
        fill(255);
        textAlign(CENTER);
        textSize(90);
        text("Game Over!", camera.position.x, camera.position.y);
        textSize(24);
        text(" Click anywhere to revive.", camera.position.x, camera.position.y + 40);
    } else {
        background(150, 200, 250);
        
        player.velocity.y = player.velocity.y + GRAVITY;
        if(keyIsDown(DOWN_ARROW)) {
            player.velocity.y += GRAVITY*4;
        }
        
        if (groundSprites.overlap(player)) {
            player.velocity.y = 0;
            player.position.y = (height-50) - (player.height/2);
            doubleJump = 0;
        }
        
        t++;
        player.position.x = player.position.x + speed + t/100;
        camera.position.x = player.position.x + (width/4);
        
        var firstGroundSprite = groundSprites[0];
        if (firstGroundSprite.position.x <= camera.position.x - (width/2 + firstGroundSprite.width/2)) {
            groundSprites.remove(firstGroundSprite);
            firstGroundSprite.position.x = firstGroundSprite.position.x + numGroundSprites*firstGroundSprite.width;
            groundSprites.add(firstGroundSprite);
        }
        
        if(random() > 0.99) {
            coinstringheight1 = random(10);
            coinstringheight2 = random(10);
        }
        
        if (random() > 0.93) {
            if (random()>0.5){
                coinstringheight = coinstringheight1;
            } else {
                coinstringheight = coinstringheight2;
            }
            var coin = createSprite(camera.position.x + width, height*coinstringheight/10-50-15, 30, 30);
            coin.shapeColor = "rgb(218,165,32)";
            coinSprites.add(coin);
            coinSprites.overlap(coin, function(){
                coin.remove();
            });
        }
        
        var firstcoin = coinSprites[0];
        if (coinSprites.length > 0 && firstcoin.position.x <= camera.position.x - (width/2 + firstcoin.width/2)) {
            removeSprite(firstcoin);
        }
        
        coinSprites.overlap(player, function(obs, ply){
            obs.remove();
            score += 10;
            player.height += 2;
            player.width += 2;
            coinSound.play();
        });
        
        if (random() > 0.99 & camera.position.x-lastobsx > 300) {
            lastobsx = camera.position.x;
            obsheight = height-25;
            var obstacle = createSprite(camera.position.x + width, obsheight, 50, 200*random(1,2));
            obstacle.shapeColor = "black";
            obstacleSprites.add(obstacle);
            obstacleSprites.overlap(obstacle, function(){
                obstacle.remove();
            });
            coinSprites.overlap(obstacle, function(){
                obstacle.remove();
            });
        }
        
        var firstobstacle = obstacleSprites[0];
        if (obstacleSprites.length > 0 && firstobstacle.position.x <= camera.position.x - (width/2 + firstobstacle.width/2)) {
            removeSprite(firstobstacle);
        }
        
        obstacleSprites.overlap(player, function(obs, ply){
            score = max(0, score -= 50);
            t = 0;
            obstacleSprites.remove(obs);
            player.height = max(50, player.height -= 10);
            player.width = max(50, player.width -= 10);
            crashSound.play();
        });
        
        drawSprites();
        
        textAlign(CENTER);
        text(score, camera.position.x, 10);
        
        if(score > gameover) {
            endGame();
        }
    }
}

function keyPressed() {
  if (keyCode === UP_ARROW & doubleJump < 2) {
    player.velocity.y = JUMP;
    doubleJump++;
    jumpSounds[4].play();
  } 
  if (keyCode === DOWN_ARROW){
      jumpSounds[2].play();
  }
}



function endGame() {
    isGameOver = true;
    backgroundSound.stop();
    gameoverSound.play();
}

function mouseClicked() {
  if (isGameOver) {
      
    for (var n = 0; n < numGroundSprites; n++) {
      var groundSprite = groundSprites[n];
      groundSprite.position.x = n*50;
    }

    player.position.x = 100;
    player.position.y = height-75;

    coinSprites.removeSprites();
    
    score = 0;
    gameover = 50 + random()*250;
    isGameOver = false;
  }
}