class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
  }
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value",function(data){
      gameState = data.val();
    })
  }


  update(state){
    database.ref("/").update({
      gameState : state
    })
  }
  start() {

    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2 - 50,height - 100);
    car1.addImage("car1",car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width/2 +100,height - 100);
    car2.addImage("car2",car2_img);
    car2.scale = 0.07;
cars =[car1,car2]
  fuels = new Group();
  powerCoins = new Group();
  obstacles = new Group();
  var obstaclesPosition = [
    {x:width/2 + 250,y:height -800,image:obstacle2Image},
    {x:width/2 - 150,y:height -1300,image:obstacle1Image},
    {x:width/2 + 250,y:height -1800,image:obstacle1Image},
    {x:width/2-180,y:height -2300,image:obstacle2Image},
    {x:width/2 ,y:height -3300,image:obstacle1Image},
    {x:width/2 -180 ,y:height -3300,image:obstacle1Image},
    {x:width/2 + 180,y:height -3300,image:obstacle2Image},
    {x:width/2 + 250,y:height -3800,image:obstacle2Image},
    {x:width/2 - 150,y:height -4300,image:obstacle1Image},
    {x:width/2 + 250,y:height -4800,image:obstacle2Image},
    {x:width/2  ,y:height -5300,image:obstacle1Image},
    {x:width/2 - 180,y:height -5500,image:obstacle2Image},

  ]
  this.addSprites(fuels,4,fuelimage,0.02);
  this.addSprites(powerCoins,18,powerCoinImage,0.09);
  this.addSprites(obstacles,obstaclesPosition.length,obstacle1Image,0.04,obstaclesPosition)
  }
  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions = []){
    for(var i = 0; i < numberOfSprites; i++){
      var x,y;
      if(positions.length >0){
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      else{
        x = random(width/2 + 150,width/2 - 150);
        y = random(-height *4.5,height-400);

      }
      var sprite = createSprite(x,y);
      sprite.addImage("sprite",spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);  
    }
  }

  
  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200,40);
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 +230,100);
    this.leadeboardTitle.html("Leaderboard")
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width/3 -60,40);
    this.leader1.class("leadersText");
    this.leader1.position(width/3 -50,80);
    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50,130);
  }
  play(){
    this.handleElements();
    this.handleResetButton()
    Player.getPlayersInfo();
    player.getCarsatEnd();
    if(allPlayers!== undefined){
      image(track,0,-height*5,width,height*6);
      this.showLeaderboard();
      this.showFuelBar();
      this.showlife();
      var index = 0;
      for(var plr in  allPlayers){
        index = index +1;
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y; 
        
        if(index===player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          this.handleFuel(index);
          this.handlePowerCoins(index);
          camera.position.x = cars[index - 1].position.x
          camera.position.y = cars[index - 1].position.y
        }
      }
      
      if(this.playerMoving){
        player.positionY += 5;
        player.update();
      }
      this.handlePlayerControls()
      const finishLine = height*6 - 100;
      if(player.positionY> finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsatEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites();
      
    }
  }
  showeRank(){
    swal({
      title:`Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text:"you reached the finish line successfully",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"ok"
    });
  }
  showlife(){
    push();
    image(lifeImage,width/2 - 130,height-player.positionY -400,20,20);
    fill("white");
    rect(width/2 -100,height-player.positionY - 400,185,20);
    fill("red");
    rect(width/2 - 100,height - player.positionY - 400,player.life,20);
    noStroke();
    pop();
  }
  showFuelBar(){
    push();
    image(fuelimage,width/2 - 130,height-player.positionY -350,20,20);
    fill("white");
    rect(width/2 -100,height-player.positionY - 350,185,20);
    fill("yellow");
    rect(width/2 - 100,height - player.positionY - 350,player.fuel,20);
    noStroke();
    pop();
  }
  handleObstacleCollision(index){
   if(cars[index - 1].collide(obstacles)){
    if(this.leftKeyActive){
      player.positionX += 100

    }
    else{
      player.positionX -= 100
    }
    if(player.life>0){
      player.life -= 185/4
    }
    player.update()
   }
  }
  handleCarCollision(index){
   if(index===1){
    if(cars[index - 1].collide(cars[1])){
      if(this.leftKeyActive){
        player.positionX += 100
  
      }
      else{
        player.positionX -= 100
      }
      if(player.life>0){
        player.life -= 185/4
      }
      player.update()
    }
   }
   if(index===2){
    if(cars[index - 1].collide(cars[0])){
      if(this.leftKeyActive){
        player.positionX += 100
  
      }
      else{
        player.positionX -= 100
      }
      if(player.life>0){
        player.life -= 185/4
      }
      player.update()
    }
   }
  }
  gameOver(){
    swal({
      title:`gameOver`,
      text:"Oops you lost the race",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"thanks For playing",
    })
  }
  handleFuel(index){
    cars[index - 1]. overlap(fuels,function(collector,collected){
      player.fuel = 185;
      collected.remove();
    })
if(player.fuel>0 && this.playerMoving){
  player.fuel -= 0.3;

}
if(player.fuel<= 0){
  gameState = 2;
  this.gameOver();
}
  }
  handlePowerCoins(index){
  cars[index - 1].overlap(powerCoins,function(collector,collected){
    player.score += 21;
    player.update();
    collected.remove();
  })
  }
  handlePlayerControls(){
    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true
      player.positionY += 10;
      player.update();

    }
    if(keyIsDown(LEFT_ARROW)){
      player.positionX  -=5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.positionX +=5;
      player.update();
    }


    
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players:{}
      });
      window.location.reload();
    })
  }
  showLeaderboard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    if(( players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1){
    leader1 = players[0].rank +"&emsp;"+players[0].name +"&emsp;"+players[0].score;
    leader2 = players[1].rank +"&emsp;"+players[1].name +"&emsp;"+players[1].score;
    }
    if(players[1].rank ===1){
      leader2 = players[0].rank +"&emsp;"+players[0].name +"&emsp;"+players[0].score;
      leader1 = players[1].rank +"&emsp;"+players[1].name +"&emsp;"+players[1].score;  
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  end(){
    console.log("gameover")
  }
}


