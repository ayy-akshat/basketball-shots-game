const
Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies;

var engine, world;

var basketballImg;

var balls = [];

var ground;

var backboard, rimFront, pole, scorer;

var fullRim;

var shootPosX = 80;

var score = 0;

var shotsMade = 0;

var attemptsLeft = 12;

var instruction = true;

var night = false;

var nightBG = 0;

var bgColor = [135, 206, 235];

function preload()
{
  basketballImg = loadImage('basketball.png');
}

function setup()
{
  createCanvas(1000,800);

  engine = Engine.create();
  world = engine.world;
  
  ground = new Ground(500, 780, 1000, 40);

  pole = new Ground(900, 550, 20, 420);
  backboard = new Ground(875, 350, 30, 200);
  rimFront = new Ground(750, 400, 10, 20);
  scorer = new Ground(805, 440, 80, 20);

  fullRim = createSprite((rimFront.body.position.x+backboard.body.position.x-(backboard.width/2))/2, rimFront.body.position.y, backboard.body.position.x-(backboard.width/2)-rimFront.body.position.x, rimFront.height);
  fullRim.shapeColor = rgb(255, 123, 113);
  
  Matter.Events.on(engine, "collisionStart", function(event)
  {

    switch (event.pairs[0].collision.bodyA)
    {
      case (backboard.body):
        for (var i = 0; i < balls.length; i++)
        {
          if (balls[i].body == event.pairs[0].collision.bodyB)
          {
            balls[i].touchedBackboard = true;
            balls[i].lifetime = 100;
  
            break;
          }
        }
        break;
      
      case rimFront.body:
        for (var i = 0; i < balls.length; i++)
        {
          if (balls[i].body == event.pairs[0].collision.bodyB)
          {
            balls[i].touchedRim = true;
            balls[i].lifetime = 100;

            break;
          }
        }
        break;

      case ground.body:
        for (var i = 0; i < balls.length; i++)
        {
          if (balls[i].body == event.pairs[0].collision.bodyB)
          {
            if (balls[i].lifetime > 8)
            {
              balls[i].lifetime = 8;
            }

            break;
          }
        }
        break;
      
      case scorer.body:
        for (var i = 0; i < balls.length; i++)
        {
          if (balls[i].body == event.pairs[0].collision.bodyB)
          {
            if (balls[i].lifetime <= 0 || !balls[i].sprite.isTouching(fullRim))
            {
              break;
            }
            score += balls[i].getScoreWorth();
            shotsMade++;
            balls[i].lifetime = 0;
            shootPosX = Math.round(random(80, 630));
            break;
          }
        }
        break;
    }

  });

  setBg();
  Engine.run(engine);
}

function draw()
{
  if (night)
  {
    bgColor =
    [
      lerp(bgColor[0], 19, 0.01),
      lerp(bgColor[1], 24, 0.01),
      lerp(bgColor[2], 98, 0.01)
    ];
  }
  else
  {
    bgColor =
    [
      lerp(bgColor[0], 135, 0.01),
      lerp(bgColor[1], 206, 0.01),
      lerp(bgColor[2], 235, 0.01)
    ];
  }

  background(bgColor);
  
  for (var i = 0; i < balls.length; i++)
  {
    if (balls[i].lifetime <= 0)
    {
      World.remove(world, balls[i].body)
      balls[i].sprite.destroy();
      delete balls[i];
      balls.splice(i, 1);
      i--;
    }
    else
    {
      balls[i].display();
    }
  }

  ground.display([223, 187, 133]);

  pole.display('gray');
  backboard.display(240);
  rimFront.display([255, 123, 113]);
  scorer.display([255, 255, 255, 200]);


  drawSprites();
  
  //backboard rectangle
  noStroke();
  fill(255, 100, 100);
  rectMode(CENTER);
  rect(backboard.body.position.x-backboard.width/4, backboard.body.position.y+backboard.height/10, backboard.width/2, backboard.height/2);

  //indicates where you are shooting from
  fill('lightblue');
  ellipseMode(CENTER);
  ellipse(shootPosX, 720, 60, 60);
  push();
  translate(shootPosX, 650 + 5*Math.sin(frameCount/8));
  rotate(4*Math.sin(frameCount/5));
  rect(0, 0, 30, 30);
  pop();


  //net
  fill(255, 255, 255, 200);
  rect(scorer.body.position.x, (scorer.body.position.y + rimFront.body.position.y)/2, 110, scorer.height);

  if (night)
  {
    nightBG = lerp(nightBG, 127, 0.01);
  }
  else
  {
    nightBG = lerp(nightBG, 0, 0.01);
  }
  
  background(0, 0, 0, nightBG);

  if (instruction)
  {
    textAlign(CENTER);
    textSize(20);
    push();
    fill(0, 0, 0, 200);
    rect(width/2, 500, 250, 150);
    pop();
    text("Click or press [space] to shoot. Aim using the mouse. Make as many shots as you can in 12 tries.", width/2, 500, 220, 120);
  }


  drawAim();
  
  textAlign(CENTER);
  textSize(32);
  if (attemptsLeft <= 0 && balls.length == 0)
  {
    background(0, 0, 0, 127);
    text("In 12 attempts, you scored " + score + " with an accuracy of " + Math.round(100*shotsMade/12) + "%.", width/2, height/2);
    text("Click or press [space] to reset", width/2, height*5/8);
  }
  else
  {
    fill(100, 150, 200);
    text("Score: " + score, width/2, height/5);
    text("Attempts Remaining: " + attemptsLeft, width/2, height*(2/5));
  }

  if (frameCount%150 == 0)
  {
    setBg();
  }
}

function shootBall(x, y)
{
  if (attemptsLeft <= 0)
  {
    if (balls.length == 0)
    {
      resetGame();
    }
    return;
  }
  balls.push(new Ball(x, y, 30, {x:(mouseX-x)/30, y:(mouseY-720)/30}));
  instruction = false;
  attemptsLeft--;
}

function mouseClicked()
{
  shootBall(shootPosX, 720);
}

function keyPressed()
{
  if (keyCode == 32)
  {
    mouseClicked();
  }
}

var aimVel = 
{
  x: 0,
  y: 0
};

function drawAim()
{
  var lerpFact = 0.4;
  aimVel = 
  {
    x: lerp(aimVel.x, (mouseX-shootPosX)/10, lerpFact),
    y: lerp(aimVel.y, (mouseY-720)/10, lerpFact)
  };

  var aimPoint = 
  {
    x: shootPosX,
    y: 720
  };

  fill(100, 150, 255);
  for (var i = 0; i < 5; i++)
  {
    aimPoint.x += aimVel.x;
    aimPoint.y += aimVel.y;
    ellipseMode(CENTER);
    ellipse(aimPoint.x, aimPoint.y, 10, 10);
  }
}

function resetGame()
{
  instruction = true;

  attemptsLeft = 12;
  score = 0;
  shotsMade = 0;

  for (var i = 0; i < balls.length; i++)
  {
    balls[i].lifetime = 0;
  }
}

async function setBg()
{
  var request = await fetch('https://worldtimeapi.org/api/ip');
  var jsonContent = await request.json();

  var hour = parseFloat(jsonContent.datetime.slice(11, 13));

  if (hour >= 6 && hour < 18)
  {
    night = false;
  }
  else
  {
    night = true;
  }
}
