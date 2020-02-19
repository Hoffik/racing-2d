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
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _boundingRectangle: DOMRect;
    private _interval: number;
    private _mousePosition: XYCoordinates;
    private _car: Car;
    private _track: Track;

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
        let context = canvas.getContext("2d");
        this._context = context;
        
        this._boundingRectangle = this._canvas.getBoundingClientRect();
        this._interval = updateInterval;
        this._mousePosition = { x: this._canvas.width / 2, y: this._canvas.height / 2};
        let carPosition = { x: this._canvas.width / 2, y: this._canvas.height / 2};
        this._car = new Car(this, "img/car.png", "20px", "42px", carPosition);
        this._track = new Track(this, "img/indianapolis.png", "11890px", "6050px", { x: -4900, y: -3880 });
        this.start();
    }

    get canvas() {
        return this._canvas;
    }
    get mousePosition() {
        return this._mousePosition;
    }

    start() {
        setInterval(this.updateCanvas.bind(this), this._interval);
    }
    updateCanvas() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._car.update();
        this._track.update(this._car);
        this._track.draw();
        this.readCanvasValue();
        this._car.draw();
    }
    readCanvasValue() {
        let carFrontCoords: XYCoordinates = { x: this._car.position.x + this._car.halfSize.y * Math.cos(this._car.azimuth + Math.PI / 2), y: this._car.position.y + this._car.halfSize.y * Math.sin(this._car.azimuth + Math.PI / 2)};
        let leftImgData = this._context.getImageData(carFrontCoords.x + this._car.halfSize.x * Math.cos(this._car.azimuth), carFrontCoords.y + this._car.halfSize.x * Math.sin(this._car.azimuth), 1, 1)
        this._context.font = "30px Arial";
        this._context.fillText(leftImgData.data.toString(), 10, 50);
        let rightImgData = this._context.getImageData(carFrontCoords.x + this._car.halfSize.x * Math.cos(this._car.azimuth + Math.PI), carFrontCoords.y + this._car.halfSize.x * Math.sin(this._car.azimuth + Math.PI), 1, 1)
        this._context.fillText(rightImgData.data.toString(), 10, 100);
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

    constructor(race: Race, imageSource: string, imageWidth: string, imageHeight: string, startPosition: XYCoordinates = { x: 0, y: 0 }) {
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

        this._ctx = race.canvas.getContext("2d");
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
    constructor(race: Race, imageSource: string, imageWidth: string, imageHeight: string, startPosition: XYCoordinates) {
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
        this._azimuth = 0;

        this._ctx = race.canvas.getContext("2d");
        this._ctx.save();
    }

    get speed() {
        return this._speed;
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
		this._speed.x = ((this._mousePosition.x - this._position.x)/20 + this._speed.x)/2;
		this._speed.y = ((this._mousePosition.y - this._position.y)/20 + this._speed.y)/2;
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