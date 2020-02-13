"use strict";

window.addEventListener('load', function() {
    let race = new Race();
    window.addEventListener('mousemove', function() {
        race.setMousePosition(event);
    });
    window.addEventListener('resize', function() {
        race.setCanvasSize();
    });
});

/**
 * Cartesian coordinates (x, y) specifying point position in a plane
 * or two-dimensional vector
 * 
 * let XYCoordinates {
 *  x: number; y: number
 * }
 */
interface XYCoordinates {
    x: number;
    y: number;
}

/**
 * Racing event
 */
class Race {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    boundingRectangle: DOMRect;
    interval: number;
    mousePosition: XYCoordinates;
    car: Car;

    /**
     * Creates an instance of race.
     * @param [canvasID]        HTML5 canvas ID
     * @param [updateInterval]  Interval for updating canvas (in miliseconds)
     */
    constructor(canvasID: string = "gameArea", updateInterval: number = 20) {
        let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        this.canvas = canvas;
        this.context = context;
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
    setCanvasSize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

/**
 * Racing car
 */
class Car {
    img: HTMLImageElement;
    mousePosition: XYCoordinates;
    position: XYCoordinates;
    speed: XYCoordinates;
    azimuth: number;
    ctx: CanvasRenderingContext2D;

    /**
     * Creates an instance of car.
     * @param race 
     * @param imageSource       Car image relative path
     * @param imageWidth 
     * @param imageHeight 
     * @param [startPositionX] 
     * @param [startPositionY] 
     */
    constructor(race: Race, imageSource: string, imageWidth, imageHeight, startPositionX = 0, startPositionY = 0) {
        let img = document.createElement("IMG") as HTMLImageElement;
        this.img = img;
        this.img.setAttribute("src", imageSource);
        this.img.setAttribute("width", imageWidth);
        this.img.setAttribute("height", imageHeight);
        this.img.setAttribute('crossOrigin', '');
        
        this.mousePosition = race.mousePosition;
        this.position = {
            x : startPositionX,
            y : startPositionY
        };
        this.speed = {
            x : 0,
            y : 0
        };
        this.azimuth = 0;

        this.ctx = race.canvas.getContext("2d");
        this.ctx.save();
    }
    
    update() {
        this.newPosition();
    }
	newSpeed() {
		this.speed.x = ((this.mousePosition.x - this.position.x)/20 + this.speed.x)/2;
		this.speed.y = ((this.mousePosition.y - this.position.y)/20 + this.speed.y)/2;
	}
    newAzimuth() {
        this.azimuth = Math.atan2(this.position.y - this.mousePosition.y, this.position.x - this.mousePosition.x) + Math.PI / 2;
    }
    newPosition() {
		this.newSpeed();
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.newAzimuth();
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.azimuth);
        this.ctx.drawImage(this.img,-10,-21);
        this.ctx.restore();
    }
}