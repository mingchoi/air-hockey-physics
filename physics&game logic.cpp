#include <iostream>
using namespace std;


// air hocky
  bool inputUp = false;
  bool inputDown = false;
  bool inputLeft = false;
  bool inputRight = false;
  float tableX = 0;
  float tableY = 0;
  float tableWidth = 400;
  float tableHeight = 600;

  float holeWidth = 160;
  float holeHeight = 50;

  float enemyHoleX = tableX + tableWidth*0.5 - holeWidth*0.5;
  float enemyHoleY = tableY;
  float playerHoleX = tableX + tableWidth*0.5 - holeWidth*0.5;
  float playerHoleY = tableY + tableHeight - holeHeight;

  float ballRadius = 25;
  float malletRadius = 30;
  float playerX = 200;
  float playerY = 500;
  float playerSpeed = 5;
  float ballX = 200;
  float ballY = 300;
  float enemyX = 200;
  float enemyY = 100;
  float ballForce =  5;
  float ballVX = 3.53553390593;
  float ballVY = 3.53553390593;

void Update(){
    
    // update input
    if(inputLeft)  // left
      setPlayerPosition(playerX - playerSpeed, playerY);
    if(inputUp)  // top
      setPlayerPosition(playerX, playerY - playerSpeed);
    if(inputRight)  // right
      setPlayerPosition(playerX + playerSpeed, playerY);
    if(inputDown)  // down
      setPlayerPosition(playerX, playerY + playerSpeed);

    // update enemy
    enemyX = 200 + Math.sin(new Date().getTime()/500) * 100;


    // update ball
    updateBall();

    // win
    int ballStatus = ballInHole(ballX, ballY);
    if(ballStatus == 1){
      console.log("You Win!");
    } else if(ballStatus == 2){
      console.log("You lose!");
    }
    
    // Render...
}



  void updateBall(){
    float newX = ballX + ballVX;
    float newY = ballY + ballVY;

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
  int ballInHole(float x,float  y){
    if(x > enemyHoleX && x < enemyHoleX + holeWidth && y > enemyHoleY && y < enemyHoleY + holeHeight){
        return 1;
    }
    else if(x > playerHoleX && x < playerHoleX + holeWidth && y > playerHoleY && y < playerHoleY + holeHeight){
        return 2;
    }
    return 0;
  }



  // collision between player or enemy mallet to the ball
  collisionWithMallet(float x1, float y1, float x2, float y2){
    if(distance(x1, y1, x2, y2) < malletRadius + ballRadius){
      float angle = Math.atan2(y1 - y2, x1 - x2) + Math.PI;
      ballVX = ballForce * Math.cos(angle);
      ballVY = ballForce * Math.sin(angle);
    }
  }



  // move player based on mouse position
  // clamped in the player's area
  void setPlayerPosition(float x, float y){
    playerX = clamp(x, tableX + malletRadius, tableX + tableWidth - malletRadius);
    playerY = clamp(y, tableY + malletRadius + tableHeight*0.5, tableY + tableHeight - malletRadius);
  }



// clamp the value between min and max
  float clamp (float value, float min, float max) {
    return Math.min(Math.max(value, min), max);
  };



// calculate distrance
  float distance(float x1, float y1, float x2, float y2){
    float dx = x2 - x1;
    float dy = y2 - y1;
    return dx / Math.cos(Math.atan2(dy, dx));
  };









int main() {
    
    // start loop
    while(false){
        Update();
    }
    
	return 0;
}


