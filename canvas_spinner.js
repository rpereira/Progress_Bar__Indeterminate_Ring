// Canvas: spinner constants
var SPINNER_IMG_SRC      = 'your_scource.gif';
var SPINNER_IMG_TIMEOUT  = false;
var SPINNER_SPEED        = 7;
var SPINNER_WIDTH        = 55;
var SPINNER_HEIGHT       = 55;
var SPINNER_TOTAL_FRAMES = 75;
var SPINNER_FRAME_WIDTH  = 55;

/**
 * The base class for all elements that appear in the game.
 * @class
 */
function GameObject() 
{	
	this.zOrder = 0;   // A smaller z-order means the element is rendered first
	this.x = 0;
	this.y = 0;

	/**
	 * Initialises the object and adds it to the list of objects held by the GameObjectManager.
	 * @param x      The position on the X axis
	 * @param y      The position on the Y axis
	 * @param z      The z order of the element (elements in the background have a lower z value)
	 */
	this.startupGameObject = function (x, y, z)
    	{
		this.zOrder = z;
		this.x      = x;
		this.y      = y;
		g_GameObjectManager.addGameObject(this);
		
		return this;
	};

	// Cleans up the object and removes it from the list of objects held by the GameObjectManager.
	this.shutdownGameObject = function ()
    {
		g_GameObjectManager.removeGameObject(this);
	};
}

/**
 * Main class
 * @class
 */
function VisualGameObject() 
{
	// The image that will be displayed by this object
	this.image = null;

	/**
	 * Draws this element to the back buffer
	 * @param dt         Time in seconds since the last frame
	 * @param context    The context to draw to
	 * @param xScroll    The global scrolling value of the x axis
	 * @param yScroll    The global scrolling value of the y axis
	 */
	this.draw = function (dt, context, xScroll, yScroll) 
    {
		context.drawImage(this.image, this.x - xScroll, this.y - yScroll);
	};

	/**
	 * Initialises this object
	 * @param image    The image to be displayed
	 * @param x        The position on the X axis
	 * @param y        The position on the Y axis
	 * @param z        The depth
	 */
	this.startupVisualGameObject = function (image, x, y, z) 
    {
		this.startupGameObject(x, y, z);
		this.image = image;
        
		return this;
	};

	// Clean up this object
	this.shutdownVisualGameObject = function () 
    {
		this.shutdownGameObject();
	};
}

VisualGameObject.prototype = new GameObject;

/**
 * Displays a repeating texture that can optionall be offset in either
 * the x or y axis
 * @class
 */
function RepeatingGameObject()
{
	this.width  = 0;
	this.height = 0;
	this.scrollFactor = 1;

	/**
     * Initialises this object
     * @return    A reference to the initialised object
     */
	this.startupRepeatingGameObject = function (image, x, y, z, width, height, scrollFactor)
    {
		this.startupVisualGameObject(image, x, y, z);
		this.width        = width;
		this.height       = height;
		this.scrollFactor = scrollFactor;
		
		return this;
	};
	
	// Clean this object
	this.shutdownstartupRepeatingGameObject = function () 
    {
		this.shutdownVisualGameObject();
	};

	/**
     * Draws this element to the back buffer
     * @param dt         Time in seconds since the last frame
	 * @param context    The context to draw to
	 * @param xScroll    The global scrolling value of the x axis  
	 * @param yScroll    The global scrolling value of the y axis  
     */
	this.draw = function (dt, canvas, xScroll, yScroll) 
    {
		var areaDrawn = [0, 0];

		for (var y = 0; y < this.height; y += areaDrawn[1]) 
        {
			for (var x = 0; x < this.width; x += areaDrawn[0]) 
            {
				// the top left corner to start drawing the next tile from
				var newPosition = [this.x + x, this.y + y];
				
				// the amount of space left in which to draw
				var newFillArea = [this.width - x, this.height - y];
				
				// the first time around you have to start drawing from the middle of the image
				// subsequent tiles alwyas get drawn from the top or left
				var newScrollPosition = [0, 0];
				
				if (x == 0) 
					newScrollPosition[0] = xScroll * this.scrollFactor;
				
				if (y == 0)
					newScrollPosition[1] = yScroll * this.scrollFactor;
				
				areaDrawn = this.drawRepeat(canvas, newPosition, newFillArea, newScrollPosition);
			}
		}
	};

	this.drawRepeat = function (canvas, newPosition, newFillArea, newScrollPosition) 
    {
		// start drawing on the top left corner
		var xOffset = Math.abs(newScrollPosition[0]) % this.image.width;
		var yOffset = Math.abs(newScrollPosition[1]) % this.image.height;
		var left    = newScrollPosition[0] < 0 ? this.image.width - xOffset : xOffset;
		var top     = newScrollPosition[1] < 0 ? this.image.height - yOffset : yOffset;
		var width   = newFillArea[0] < this.image.width - left ? newFillArea[0] : this.image.width - left;
		var height  = newFillArea[1] < this.image.height - top ? newFillArea[1] : this.image.height - top;

		canvas.drawImage(this.image, left, top, width, height, newPosition[0], newPosition[1], width, height);

		return [width, height];
	};
}

RepeatingGameObject.prototype = new VisualGameObject();

/**
 * Displays an animated GameObject
 * @class
 */
function AnimatedGameObject() 
{
	this.currentFrame       = 0;
	this.timeBetweenFrames  = 0;
	this.timeSinceLastFrame = 0;
	this.frameWidth         = 0;

	/**
     * Initialises this object
     * @param image         The image to be displayed
	 * @param x             The position on the X axis
     * @param y             The position on the Y axis
     * @param z             The depth
     * @param frameCount    The number of animation frames in the image
     * @param fps           The frames per second to animate this object at
     */
	this.startupAnimatedGameObject = function (image, x, y, z, frameCount, fps) 
    {
		if (frameCount <= 0) {
			throw "framecount can't be <= 0";
		}
		
		if (fps <= 0) {
			throw "FPS can't be <= 0";
		}

		this.startupVisualGameObject(image, x, y, z);
		this.currentFrame       = 0;
		this.frameCount         = frameCount;
		this.timeBetweenFrames  = 1 / fps;
		this.timeSinceLastFrame = this.timeBetweenFrames;
		this.frameWidth         = this.image.width / this.frameCount;
	};

	/**
     * Draws this element to the back buffer.
     * @param dt         Time in seconds since the last frame
	 * @param context    The context to draw to
	 * @param xScroll    The global scrolling value of the x axis
	 * @param yScroll    The global scrolling value of the y axis
     */
	this.draw = function (dt, context, xScroll, yScroll) 
    {
		var sourceX = this.frameWidth * this.currentFrame;
		context.drawImage(this.image, sourceX, 0, this.frameWidth, this.image.height, this.x - xScroll,
						  this.y - yScroll, this.frameWidth, this.image.height);

		this.timeSinceLastFrame -= dt;
        
		if (this.timeSinceLastFrame <= 0) 
        {
			this.timeSinceLastFrame = this.timeBetweenFrames;
			++this.currentFrame;
			this.currentFrame %= this.frameCount;
		}
	};
}

AnimatedGameObject.prototype = new VisualGameObject;

/**
 * Removes a number of objects from the array.
 * @param from             The first object to remove
 * @param to (Optional)    The last object to remove
 */
Array.prototype.remove = function (from, to) 
{
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	
	return this.push.apply(this, rest);
};

/**
 * Removes a specific object from the array.
 * @param object      The object to remove
 */
Array.prototype.removeObject = function (object) 
{
	for (var i = 0; i < this.length; ++i) 
    {
		if (this[i] === object) 
        {
			this.remove(i);
			break;
		}
	}
};

function ApplicationManager() 
{
	this.startupApplicationManager = function () 
    {
		this.runner = new AnimatedGameObject().startupAnimatedGameObject(g_run, 0, 0, 1,
                                                                         SPINNER_TOTAL_FRAMES, 
                                                                         FPS);
		return this;
	};
}

/**
 * A manager for all objects.
 * @class
 */
function GameObjectManager() 
{
	this.gameObjects 		 = new Array();
	this.lastFrame 			 = new Date().getTime();
	this.xScroll 			 = 0;
	this.yScroll 		     = 0;
	this.applicationManager  = null;
	this.canvas 			 = null;
	this.context2D           = null;
	this.backBuffer          = null;
	this.backBufferContext2D = null;

	/**
     * Initialises this object
     * @return this      A reference to the initialised object
     */
	this.startupGameObjectManager = function () 
    {
		// global pointer references this
		g_GameObjectManager = this;

		// references to the canvas elements
		this.canvas				 = document.getElementById('canvas');
		this.context2D 			 = this.canvas.getContext('2d');
		this.backBuffer          = document.createElement('canvas');
		this.backBuffer.width    = this.canvas.width;
		this.backBuffer.height   = this.canvas.height;
		this.backBufferContext2D = this.backBuffer.getContext('2d');

		// create a new ApplicationManager
		this.applicationManager = new ApplicationManager().startupApplicationManager();

		setInterval(function () {
			g_GameObjectManager.draw();
		}, SECONDS_BETWEEN_FRAMES);

		return this;
	};

	/**
	 * The render loop.
	 */
	this.draw = function () 
    {
		// Compute the time since the last frame
		var thisFrame = new Date().getTime();
		var dt = (thisFrame - this.lastFrame) / 1000;
		
		this.lastFrame = thisFrame;

		// Clear the drawing contexts
		this.backBufferContext2D.clearRect(0, 0, this.backBuffer.width, this.backBuffer.height);
		this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Update all the game objects
		for (x in this.gameObjects) {
			if (this.gameObjects[x].update) {
				this.gameObjects[x].update(dt, this.backBufferContext2D, this.xScroll, this.yScroll);
			}
		}

		// Draw the game objects
		for (x in this.gameObjects) 
        {
			if (this.gameObjects[x].draw) 
            {
				this.gameObjects[x].draw(dt, this.backBufferContext2D, this.xScroll, this.yScroll);
			}
		}

		// Copy the buffer to the displayed canvas.
		this.context2D.drawImage(this.backBuffer, 0, 0);
	};

	/**
     * Adds a new GameObject to the gameObjects collection.
     * @param gameObject    The object to add
     */
	this.addGameObject = function (gameObject) 
    {
		this.gameObjects.push(gameObject);
		this.gameObjects.sort(function (a, b) {
			return a.zOrder - b.zOrder;
		});
	};

	/**
	 * Removes a GameObject from the gameObjects collection.
	 * @param gameObject    The object to remove
	 */
	this.removeGameObject = function (gameObject) 
    {
		this.gameObjects.removeObject(gameObject);
	};
}

function initCanvas() 
{
	new GameObjectManager().startupGameObjectManager();
}
