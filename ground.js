class Ground
{
    constructor(x, y, width, height)
    {
        var bodyOptions=
        {
            friction:1,
            frictionStatic:1,
            density:1,
            isStatic:true
        }
        
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle(x,y,this.width,this.height,bodyOptions);
        World.add(world,this.body);
        this.sprite = createSprite(x, y, this.width, this.height);
    }

    display(color)
    {
        this.sprite.rotation = this.body.angle;
        this.sprite.shapeColor = color;
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }
}