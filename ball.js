class Ball
{
    constructor(x, y, radius, startVelocity)
    {
        var bodyOptions=
        {
            restitution:0.5,
            frictionAir:0,
            friction:0.5,
            frictionStatic:0.5
        }

        this.initialX = x;
        this.initialY = y;
        
        this.radius = radius;
        this.body = Bodies.circle(x, y, this.radius, bodyOptions);
        World.add(world, this.body);
        Matter.Body.setVelocity(this.body, startVelocity);

        this.sprite = createSprite(x, y, this.radius*2, this.radius*2);
        this.sprite.addImage(basketballImg);
        this.sprite.scale = this.radius*2/100;
        
        this.touchedBackboard = false;
        this.touchedRim = false;
        this.madeShot = false;

        this.lifetime = 100;
    }

    display()
    {
        this.sprite.rotation = 180*this.body.angle/PI;
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;

        this.lifetime--;
    }
    
    getScoreWorth()
    {
        return 100 + (this.touchedBackboard ? -30 : 0) + (this.touchedRim ? -30 : 0);
    }
}