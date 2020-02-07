"use strict";

window.addEventListener('load', function() {
    let race = new Race();
    window.addEventListener('mousemove', function() {
        race.setMousePosition(event);
    });
});

class Race {

    constructor(raceArea = "gameArea", updateInterval = 20) {
        this.canvas = document.getElementById(raceArea);
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.boundingRectangle = this.canvas.getBoundingClientRect();
        this.interval = updateInterval;
        this.mousePosition = {
            x : 100,
            y : 100
        };
        this.car = new Car(this, "img/car.png", "20px", "42px");
        this.start();
    }

    start() {
        setInterval(this.update.bind(this), this.interval);
    }
    
    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.car.update();
    }

    setMousePosition(e) {
        this.mousePosition.x = e.clientX - this.boundingRectangle.left;
        this.mousePosition.y = e.clientY - this.boundingRectangle.top;
    }
}

class Car {

    constructor(race, imageSource, imageWidth, imageHeight, startPositionX = 0, startPositionY = 0) {
        this.img = document.createElement("IMG");
        this.img.setAttribute("src", imageSource);
        this.img.setAttribute("width", imageWidth);
        this.img.setAttribute("height", imageHeight);
        this.img.setAttribute('crossOrigin', '');
        
        this.mousePosition = race.mousePosition;
        this.positionX = startPositionX;
        this.positionY = startPositionY;
        this.speedX = 0;
        this.speedY = 0;
        this.angle = 0;

        this.ctx = race.canvas.getContext("2d");
        this.ctx.save();
    }
    
    update() {
        this.newPosition();
    }
	newSpeed() {
		this.speedX = ((this.mousePosition.x - this.positionX)/20 + this.speedX)/2;
		this.speedY = ((this.mousePosition.y - this.positionY)/20 + this.speedY)/2;
	}
    newAngle() {
        this.angle = Math.atan2(this.positionY - this.mousePosition.y, this.positionX - this.mousePosition.x) + Math.PI / 2;
    }
    newPosition() {
		this.newSpeed();
        this.positionX += this.speedX;
        this.positionY += this.speedY;
        this.newAngle();
        this.ctx.save();
        this.ctx.translate(this.positionX, this.positionY);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.img,-10,-21);
        this.ctx.restore();
    }
}