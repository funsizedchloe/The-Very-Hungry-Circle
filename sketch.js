//player variables
let x = 380;
let y = 350;
let pColor;
//food variables
let foodItems = [];
let maxFood = 8;
let foodTime = 5000;
let foodInterval = 500;
let lastFood = 0;
//spike variables
let spikeItems = [];
let maxSpikes = 12;
let spikeTime = 8000;
let spikeInterval = 500;
let lastSpike = 0;
let spikeSize = 15;
let invincibleUntil = 0;
//time variables
let timeLeft;
let startTime;
let gameTime = 60;
//other game variables
let startButton;
let restartButton;
let gameState = "start";
let lives = 5;
let score = 0;

function setup() {
    // put setup code here
    createCanvas(800, 800);
    background(150, 240, 218);
    //start button
    startButton = createButton ("Start");
    startButton.position(380, 350);
    startButton.mousePressed(startGame);
    //restart button
    restartButton = createButton ("Play Again");
    restartButton.position(350, 500);
    restartButton.mousePressed(startGame);
    restartButton.hide();
    //player color
    pColor = color(0, 0, 255);
}
function draw() {
    //draw start menu
    if(gameState === "start"){
        background(150, 240, 218);
        textAlign(CENTER, CENTER);
        textSize(50);
        text("The Very Hungry Circle", 400, 200);
        
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Move the circle using the arrow keys to collect food items and avoid the spikes", 400, 250);
    }else if(gameState === "playing"){//draw game items
        background(150, 240, 218); 
        updateTimer();
        drawHUD();
        spawnFood();
        spawnSpikes();
        despawnFood();
        despawnSpikes();
        drawFood();
        drawSpikes();
        checkSpikeCollision();
        checkFoodCollision();
       //player movement 
        if(keyIsDown(LEFT_ARROW)){ 
            x -= 5;//move player left
        }
        if(keyIsDown(RIGHT_ARROW)){
            x += 5;//move player right
        }
        if(keyIsDown(UP_ARROW)){
            y -= 5;//move player up
        }
        if(keyIsDown(DOWN_ARROW)){
            y += 5;//move player down
        }
        //player
        fill(pColor);
        circle(x, y, 50);
        //stop player from going out of bounds
        x = constrain(x, 25, 775);
        y = constrain(y, 60, 775); 
    }else if(gameState === "gameover"){//draw game over for time is up and all 5 lives lost
        background(150, 240, 218);
        restartButton.show();
        fill(0);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("GAME OVER!", 400, 400);
        
        textSize(30);
        text("You collected " + score + " food items!", 400, 450);  
    }
}
function startGame(){//start game function
    gameState = "playing";
    startTime = millis();
    startButton.hide();
    restartButton.hide();
    score = 0;
    lives = 5;
}
function updateTimer(){//timer function
    let elapsed = (millis() - startTime) / 1000; //convert milliseconds to seconds
    timeLeft = gameTime - elapsed;
    if(timeLeft <= 0){
        timeLeft = 0; //prevents negative timer
        gameState = "gameover";
    }
}
function drawHUD(){//draw hud for time, score, and lives
    //invisible background for hud
    fill(150, 240, 218);
    noStroke();
    rect(0, 0, 800, 35);
    
    fill(0);
    textSize(20);
    //timer
    textAlign(CENTER, TOP);
    text("Time: " + floor(timeLeft), 400, 10);
    //score
    textAlign(LEFT, TOP);
    text("Score: " + score, 200, 10);
    //lives
    textAlign(RIGHT, TOP);
    text("Lives: " + lives + "/5", 600, 10);
}
function  checkFoodCollision(){ //increase score when player collides with food item
    for(let i = foodItems.length - 1; i >= 0; i--){
        let d = dist(x, y, foodItems[i].x, foodItems[i].y);
        if(d < 25 + 12.5){
            score += 1;
            foodItems.splice(i, 1);//remove collected food item
        }
    }
}
function drawFood(){//draws the food items
    fill(0, 255, 0);
    for(let i = 0; i < foodItems.length; i ++){
        square(foodItems[i].x, foodItems[i].y, 30);
    }
}
function spawnFood(){//spawns food items if there are less than 5 on screen
    if(foodItems.length < maxFood && millis() - lastFood > foodInterval){
        foodItems.push({//creating new randome food item
            x: random (25, 775),
            y: random (60, 775),
            spawnTime: millis()
        });
        lastFood = millis();
    }
}
function despawnFood(){//despawns food items after 5 seconds
    for(let i = foodItems.length - 1; i >= 0; i--){
        if(millis() - foodItems[i].spawnTime > foodTime){
            foodItems.splice(i, 1);
        }
    }
}
function checkSpikeCollision(){//decrease lives when player collides with spike item
    for(let i = spikeItems.length - 1; i >= 0; i--){
        let d = dist(x, y, spikeItems[i].x, spikeItems[i].y);
        if(d < 25 + spikeSize && millis() > invincibleUntil){
            lives -= 1;
            pColor = color(255, 255, 0);
            console.log("lives"+lives);
            invincibleUntil = millis() + 500;//player is invincible for 0.5 second after spike collision
            spikeItems.splice(i, 1);//removes spike items when player collides with them
            if(lives <= 0){
                gameState = "gameover";
            }
        }else if(millis() > invincibleUntil){//changes color of player back when they are no longer invincible
            pColor = color(0, 0, 255);
        }
    }
}
function drawSpikes(){//draws the spikes all same size random locations
    fill(255, 0, 0);
    for(let i = 0; i < spikeItems.length; i ++){
        triangle(spikeItems[i].x, spikeItems[i].y - spikeSize,
                 spikeItems[i].x - spikeSize, spikeItems[i].y + spikeSize, 
                 spikeItems[i].x + spikeSize, spikeItems[i].y + spikeSize);
    }
}
function spawnSpikes(){//spawns spikes if there are less than 3 on screen
    if(spikeItems.length < maxSpikes && millis() - lastSpike > spikeInterval){
       spikeItems.push({//creating new random spike
           x: random (25, 775),
           y: random (60, 775),
           spawnTime: millis()
       });
       lastSpike = millis();
    }
}
function despawnSpikes(){//despawns spikes after 5 seconds
    for(let i = spikeItems.length - 1; i >= 0; i--){
        if(millis() - spikeItems[i].spawnTime > spikeTime){
            spikeItems.splice(i, 1);
        }
    }
}