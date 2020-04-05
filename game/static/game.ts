"use strict";

window.addEventListener('load', function() {
    let race = new Race();
    window.addEventListener('mousemove', function() {
        race.setMousePosition(event);
    });
    window.addEventListener('resize', function() {
        race.setCanvasSize();
    });
    window.addEventListener('click', function() {
        race.end();
        race = new Race();
        // race.start();
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
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _boundingRectangle: DOMRect;
    private _id: number;
    private _interval: number;
    private _currentCheckPoint: number;
    private _maxCheckPoint: number;  
    private _mousePosition: XYCoordinates;
    private _car: Car;
    private _track: Track;
    private _stopWatch: StopWatch;
    private _explosion: SpriteSheet;
    private _smoke: SpriteSheet;

    private _upperCanvas: HTMLCanvasElement;
    private _upperContext: CanvasRenderingContext2D;
    private _trafficLight: SpriteSheet;
    
    private _lowerCanvas: HTMLCanvasElement;
    private _lowerContext: CanvasRenderingContext2D;
    private _supportTrack: Track;

    /**
     * Creates an instance of race.
     * @param [canvasID]        HTML5 canvas ID
     * @param [updateInterval]  Interval for updating canvas (in miliseconds)
     */
    constructor(canvasID: string = "gameArea", updateInterval: number = 20) {
        let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this._boundingRectangle = this._canvas.getBoundingClientRect();
        this._interval = updateInterval;
        this._currentCheckPoint = 0;
        this._maxCheckPoint = 3;
        this._mousePosition = { x: this._canvas.width / 2, y: this._canvas.height / 2};
        this._car = new Car(this, "/static/img/car.png", "20px", "42px", { x: this._canvas.width / 2, y: this._canvas.height / 2}, 1.5 * Math.PI);
        this._track = new Track(this._canvas, "/static/img/track.jpg", "1024px", "768px", { x:  this._canvas.width / 2 -285, y: this._canvas.height / 2 -185 });
        this._stopWatch = new StopWatch("stopWatch");

        //Animations
        let upperCanvas = document.getElementById("lowerLayer") as HTMLCanvasElement;
        upperCanvas.width  = window.innerWidth;
        upperCanvas.height = window.innerHeight;
        this._upperCanvas = upperCanvas;
        this._upperContext = upperCanvas.getContext("2d");
        this._trafficLight = new SpriteSheet(this._upperCanvas, "/static/img/animation/traffic-light.png", "162px", "127px", 54, 1000);
        this._explosion = new SpriteSheet(this._canvas, "/static/img/animation/explosion.png", "1600px", "64px", 64, updateInterval);
        this._smoke = new SpriteSheet(this._canvas, "/static/img/animation/smoke.png", "1600px", "64px", 64, updateInterval);
        
        // Support track layer for detecting colisions
        let lowerCanvas = document.getElementById("lowerLayer") as HTMLCanvasElement;
        lowerCanvas.width  = window.innerWidth;
        lowerCanvas.height = window.innerHeight;
        this._lowerCanvas = lowerCanvas;
        this._lowerContext = lowerCanvas.getContext("2d");
        this._supportTrack = new Track(this._lowerCanvas, "/static/img/track.png", "1024px", "768px", { x:  this._canvas.width / 2 -285, y: this._canvas.height / 2 -185 });
        
        this._id = setInterval(this.updateCanvas.bind(this), this._interval);
        this._trafficLight.animate({ x:  this._canvas.width / 2 -27, y: 100 });
        setTimeout(this.start.bind(this), 3000);
    }

    get canvas() {
        return this._canvas;
    }
    get supportCanvas() {
        return this._lowerCanvas;
    }
    get mousePosition() {
        return this._mousePosition;
    }

    start() {
        clearInterval(this._id);
        this._id = setInterval(this.update.bind(this), this._interval);
    }
    stop() {
        clearInterval(this._id);
        this._id = setInterval(this.updateCanvas.bind(this), this._interval);
    }
    end() {
        clearInterval(this._id);
        this._smoke.endAnimation();
    }
    update() {
        this.updatePositions();
        this.calculateCollisions();
        this.updateCanvas();
        this._stopWatch.update();
    }
    updatePositions() {
        this._car.update();
        this._track.update(this._car);
        this._supportTrack.update(this._car);
    }
    calculateCollisions() {
        this._lowerContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._supportTrack.draw();
        this.readCanvas();
    }
    updateCanvas() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._track.draw();
        this._car.draw();
    }
    readCanvas() {
        let carFrontCoords: XYCoordinates = { x: this._car.position.x + this._car.halfSize.y * Math.cos(this._car.azimuth + Math.PI / 2), y: this._car.position.y + this._car.halfSize.y * Math.sin(this._car.azimuth + Math.PI / 2)};
        let carFrontLeftCoords: XYCoordinates = { x: carFrontCoords.x + this._car.halfSize.x * Math.cos(this._car.azimuth), y: carFrontCoords.y + this._car.halfSize.x * Math.sin(this._car.azimuth) };
        let carFrontRightCoords: XYCoordinates = { x: carFrontCoords.x + this._car.halfSize.x * Math.cos(this._car.azimuth + Math.PI), y: carFrontCoords.y + this._car.halfSize.x * Math.sin(this._car.azimuth + Math.PI) };
        let leftCornerImgData = this._lowerContext.getImageData(carFrontLeftCoords.x, carFrontLeftCoords.y, 1, 1);
        let rightCornerImgData = this._lowerContext.getImageData(carFrontRightCoords.x, carFrontRightCoords.y, 1, 1);
        this.checkSurface(leftCornerImgData, rightCornerImgData);
    }
    checkSurface(leftCornerImgData: ImageData, rightCornerImgData: ImageData) {
        if (leftCornerImgData.data.toString() == "0,0,0,255" && rightCornerImgData.data.toString() == "0,0,0,255") {    // black (asphalt)
            this._car.acceleration = 0.015;
            this._car.inertia = 0.5;
        } else if (leftCornerImgData.data[0] == 255 || rightCornerImgData.data[0] == 255) { // red (object)
            // clearInterval(this._id);
            this.stop();
            this._explosion.animate(this._car.position, false);
            this._smoke.animate(this._car.position, true);
        } else if (leftCornerImgData.data[1] == 255 || rightCornerImgData.data[1] == 255) { // greeen (grass)
            this._car.acceleration = 0.01;
            this._car.inertia = 0;
        } else if (leftCornerImgData.data[2] == 255) {  // blue (checkpoint)
            this.checkPoint(leftCornerImgData);
        } else if (rightCornerImgData.data[2] == 255) { // blue (checkpoint)
            this.checkPoint(rightCornerImgData);
        } 
    }
    checkPoint(cornerImgData: ImageData) {
        if (cornerImgData.data[0] == this._currentCheckPoint) {
            this._currentCheckPoint++;
            if (this._currentCheckPoint == this._maxCheckPoint) {
                this.stop();
            }
        }
    }

    setMousePosition(e) {
        this._mousePosition.x = e.clientX - this._boundingRectangle.left;
        this._mousePosition.y = e.clientY - this._boundingRectangle.top;
    }
    setCanvasSize() {
        this._canvas.width  = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._car.position = { x: this._canvas.width / 2, y: this._canvas.height / 2 };
    }
}

/**
 * Racing track
 */
class Track {
    private _img: HTMLImageElement;
    private _position: XYCoordinates;
    private _ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, imageSource: string, imageWidth: string, imageHeight: string, startPosition: XYCoordinates = { x: 0, y: 0 }) {
        let img = document.createElement("IMG") as HTMLImageElement;
        this._img = img;
        this._img.setAttribute("src", imageSource);
        this._img.setAttribute("width", imageWidth);
        this._img.setAttribute("height", imageHeight);
        this._img.setAttribute('crossOrigin', '');
        
        this._position = {
            x : startPosition.x,
            y : startPosition.y
        };

        this._ctx = canvas.getContext("2d");
        this._ctx.save();
    }
    
    update(car: Car) {
        let carSpeed = car.speed;
        this._position.x -= carSpeed.x
        this._position.y -= carSpeed.y;
    }
    draw() {
        // this.ctx.save();
        this._ctx.drawImage(this._img, this._position.x, this._position.y);
        // this.ctx.restore();
    }
}

/**
 * Racing car
 */
class Car {
    private _img: HTMLImageElement;
    private _halfSize: XYCoordinates;
    private _mousePosition: XYCoordinates;
    private _position: XYCoordinates;
    private _speed: XYCoordinates;
    private _acceleration: number;
    private _inertia: number;
    private _azimuth: number;
    private _ctx: CanvasRenderingContext2D;

    /**
     * Creates an instance of car.
     * @param race 
     * @param imageSource       Car image relative path
     * @param imageWidth 
     * @param imageHeight 
     * @param [startPositionX] 
     * @param [startPositionY] 
     */
    constructor(race: Race, imageSource: string, imageWidth: string, imageHeight: string, startPosition: XYCoordinates, startAzimuth: number) {
        let img = document.createElement("IMG") as HTMLImageElement;
        this._img = img;
        this._img.setAttribute("src", imageSource);
        this._img.setAttribute("width", imageWidth);
        this._img.setAttribute("height", imageHeight);
        this._img.setAttribute('crossOrigin', '');
        
        this._halfSize = { x: this._img.width / 2, y: this._img.height / 2};
        this._mousePosition = race.mousePosition;
        this._position = startPosition;
        this._speed = { x: 0, y: 0 };
        this._acceleration = 0.015;
        this._inertia = 0.5;
        this._azimuth = startAzimuth;

        this._ctx = race.canvas.getContext("2d");
        this._ctx.save();
    }

    get speed() {
        return this._speed;
    }
    set acceleration(newAcceleration: number) {
        this._acceleration = newAcceleration;
    }
    set inertia(newInertia: number) {
        this._inertia = newInertia;
    }
    set position(newPosition: XYCoordinates) {
        this._position = newPosition;
    }
    get position() {
        return this._position;
    }
    get azimuth() {
        return this._azimuth;
    }
    get halfSize() {
        return this._halfSize;
    }
    
    update() {
        this.newSpeed();
        this.newAzimuth();
    }
	newSpeed() {
		this._speed.x = (this._mousePosition.x - this._position.x)*this._acceleration + this._speed.x*this._inertia;
		this._speed.y = (this._mousePosition.y - this._position.y)*this._acceleration + this._speed.y*this._inertia;
    }
    newAzimuth() {
        this._azimuth = Math.atan2(this._position.y - this._mousePosition.y, this._position.x - this._mousePosition.x) + Math.PI / 2;
    }

    draw() {
        this._ctx.save();
        this._ctx.translate(this._position.x, this._position.y);
        this._ctx.rotate(this._azimuth);
        this._ctx.drawImage(this._img,-this._halfSize.x,-this._halfSize.y);
        this._ctx.restore();
    }
}

class StopWatch {
    private _htmlText: HTMLHeadingElement;
    private _minutes: number;
    private _seconds: number;
    private _milisecondes: number;

    constructor(htmlTextID: string = "stopWatch") {
        this._htmlText = document.getElementById(htmlTextID) as HTMLHeadingElement;
        this._minutes = 0;
        this._seconds = 0;
        this._milisecondes = 0;
    }

    get minutes() {
        return this._minutes;
    }

    update() {
        this._milisecondes+=20;
        if (this._milisecondes >= 1000) {
            this._milisecondes = 0;
            this._seconds++;
            if (this._seconds >= 60) {
                this._seconds = 0;
                this._minutes++;
            }
        }
        
        this._htmlText.textContent = (this._minutes ? (this._minutes > 9 ? this._minutes : "0" + this._minutes) : "00") + ":" + (this._seconds ? (this._seconds > 9 ? this._seconds : "0" + this._seconds) : "00") + ":" + (this._milisecondes > 99 ? this._milisecondes : "0" + (this._milisecondes > 9 ? this._milisecondes : "0" + this._milisecondes));
    }
}

class SpriteSheet {
    private _img: HTMLImageElement;
    private _frameWidth: number;
    private _frameCount: number;
    private _currentFrame: number;
    private _interval: number;
    private _intervalID: number;
    private _ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, imageSource: string, imageWidth: string, imageHeight: string, frameWidth: number, interval: number) {
        let img = document.createElement("IMG") as HTMLImageElement;
        this._img = img;
        this._img.setAttribute("src", imageSource);
        this._img.setAttribute("width", imageWidth);
        this._img.setAttribute("height", imageHeight);
        this._img.setAttribute('crossOrigin', '');

        this._frameWidth = frameWidth;
        this._frameCount = parseInt(imageWidth) / parseInt(imageHeight);
        this._currentFrame = 0;
        this._interval = interval;

        this._ctx = canvas.getContext("2d");
        this._ctx.save();
    }

    animate(position: XYCoordinates, repeat: boolean = false) {
        this._intervalID = setInterval(this.draw.bind(this, position, repeat), this._interval);
    }

    endAnimation() {
        clearInterval(this._intervalID);
    }

    private draw(position: XYCoordinates, repeat: boolean) {
        this._ctx.drawImage(this._img, this._currentFrame * this._frameWidth, 0, this._frameWidth, this._img.height, position.x - this._frameWidth/2, position.y - this._img.height/2, this._frameWidth, this._img.height);
        this._currentFrame++;
        if (this._currentFrame == this._frameCount) {
            if (repeat) {
                this._currentFrame = 0;
            } else {
                clearInterval(this._intervalID);
            }
        } 
    }
}