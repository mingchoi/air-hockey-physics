(function(){


  var keys = {};
  var stage = new createjs.Stage("canvas");
  createjs.Ticker.setFPS(60);
  var drawArea = new createjs.Shape();


  // init variables for rendering
  var player = new createjs.Shape();
  var ball = new createjs.Shape();
  var enemy = new createjs.Shape();

  // variables for C++
  var tableX = 0;
  var tableY = 0;
  var tableWidth = 400;
  var tableHeight = 600;

  var holeWidth = 160;
  var holeHeight = 50;

  var enemyHoleX = tableX + tableWidth*0.5 - holeWidth*0.5;
  var enemyHoleY = tableY;
  var playerHoleX = tableX + tableWidth*0.5 - holeWidth*0.5;
  var playerHoleY = tableY + tableHeight - holeHeight;

  var ballRadius = 25;
  var malletRadius = 30;
  var playerX = 200;
  var playerY = 500;
  var playerSpeed = 5;
  var ballX = 200;
  var ballY = 300;
  var enemyX = 200;
  var enemyY = 100;
  var ballForce =  5;
  var ballVX = 3.53553390593;
  var ballVY = 3.53553390593;





  // init function
  var init = function(){

    // init UI
    drawArea.graphics.setStrokeStyle(1).beginStroke("#dddddd")
      .moveTo(0, 300).lineTo(400, 300)
      .drawCircle(200, 300, 80)
      .drawRect(enemyHoleX, enemyHoleY, holeWidth, holeHeight)
      .drawRect(playerHoleX, playerHoleY, holeWidth, holeHeight)
      .endStroke();
    stage.addChild(drawArea);

    ball.graphics.beginFill("black").drawCircle(0, 0, 25).endFill();
    ball.x = 200;
    ball.y = 300;
    stage.addChild(ball);

    player.graphics.beginFill("blue").drawCircle(0, 0, 30).endFill();
    player.x = 200;
    player.y = 500;
    stage.addChild(player);

    enemy.graphics.beginFill("red").drawCircle(0, 0, 30).endFill();
    enemy.x = 200;
    enemy.y = 100;
    stage.addChild(enemy);

    // key capture callback
    document.onkeydown = keydown;
    document.onkeyup = keyup;
  }

  var update = function(){

    // update input
    //setPlayerPosition(stage.mouseX, stage.mouseY);
    if(keys[37])
      setPlayerPosition(playerX - playerSpeed, playerY);
    if(keys[38])
      setPlayerPosition(playerX, playerY - playerSpeed);
    if(keys[39])
      setPlayerPosition(playerX + playerSpeed, playerY);
    if(keys[40])
      setPlayerPosition(playerX, playerY + playerSpeed);
    // update enemy
    enemyX = 200 + Math.sin(new Date().getTime()/500) * 100;


    // update ball
    updateBall();

    // win
    var ballStatus = ballInHole(ballX, ballY);
    if(ballStatus == 1){
      console.log("You Win!");
    } else if(ballStatus == 2){
      console.log("You lose!");
    } else {

    }

    // apply changes to render
    player.x = playerX;
    player.y = playerY;
    ball.x = ballX;
    ball.y = ballY;
    enemy.x = enemyX;
    enemy.y = enemyY;
  }

  var updateBall = function(){
    var newX = ballX + ballVX;
    var newY = ballY + ballVY;

    // collision with wall
    if(newX-ballRadius < tableX){
      ballVX = Math.abs(ballVX);
      newX = ballX;// + ballVX;
    }
    if(newX+ballRadius > tableX + tableWidth){
      ballVX = -Math.abs(ballVX);
      newX = ballX;// - ballVX;
    }
    if(newY-ballRadius < tableY){
      ballVY = Math.abs(ballVY);
      newY = ballY;// + ballVY;
    }
    if(newY+ballRadius > tableY + tableHeight){
      ballVY = -Math.abs(ballVY);
      newY = ballY;// -ballVY;
    }

    // collision with mallet
    collisionWithMallet(playerX, playerY, ballX, ballY);
    collisionWithMallet(enemyX, enemyY, ballX, ballY);


    ballX = newX;
    ballY = newY;
  }


  // check the ball go into which hole
  // 0 = none, 1 = enemy hole, 2 = player hole
  var ballInHole = function(x, y){
    if(x > enemyHoleX && x < enemyHoleX + holeWidth && y > enemyHoleY && y < enemyHoleY + holeHeight){
        return 1;
    }
    else if(x > playerHoleX && x < playerHoleX + holeWidth && y > playerHoleY && y < playerHoleY + holeHeight){
        return 2;
    }
    return 0;
  }
  

  // collision between player or enemy mallet to the ball
  var collisionWithMallet = function(x1, y1, x2, y2){
    if(distance(x1, y1, x2, y2) < malletRadius + ballRadius){
      var angle = Math.atan2(y1 - y2, x1 - x2) + Math.PI;
      ballVX = ballForce * Math.cos(angle);
      ballVY = ballForce * Math.sin(angle);
    }
  }


  // move player based on mouse position
  // clamped in the player's area
  var setPlayerPosition = function(x, y){
    playerX = clamp(x, tableX + malletRadius, tableX + tableWidth - malletRadius);
    playerY = clamp(y, tableY + malletRadius + tableHeight*0.5, tableY + tableHeight - malletRadius);
  }

  // clamp the value between min and max
  var clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  // calculate distrance
  var distance = function(x1, y1, x2, y2){
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx / Math.cos(Math.atan2(dy, dx));
  };

  // callback for key status
  var keydown = function(e){
    keys[e.keyCode] = true;
  }

  var keyup = function(e){
    keys[e.keyCode] = false;
  }

  // main loop for the game
  var handleTick = function(event) {
    update();
    stage.update();
  }






  // start program
  init();
  // update event
  createjs.Ticker.addEventListener("tick", handleTick);


  

})();