Indeterminate Ring
================================

Canvas progress bar like Windows Metro.

Preview:
![alt text](https://raw.github.com/ruiafonsopereira/Progress-Bar--Indeterminate-Ring/master/preview.gif "Preview")



###"Install"
1. Add the sprites.gif image to your project
2. Change it's location on the first line of canvas_spinner.js file
3. Include the canvas_spinner.js file on your HTML page:
```
<script type="text/javascript" src="js/canvas_spinner.js"></script>
```


###Usage


On your main .js file, load the image:
```javascript
function imageLoader(s, fun)
{
    clearTimeout(SPINNER_IMG_TIMEOUT);
    SPINNER_IMG_TIMEOUT = 0;
    genImage = new Image();
    genImage.onload = function ()
    {
        SPINNER_IMG_TIMEOUT = setTimeout(fun, 0);
    };
    
    genImage.onerror = new Function('alert(\'Unable to load the image :(\')');
    genImage.src     = s;
}
```


And then start the animation:
```javascript
function startAnimation() 
{
    FPS = Math.round(100 / SPINNER_SPEED);
    SECONDS_BETWEEN_FRAMES = 1 / FPS;
    g_GameObjectManager = null;
    g_run = genImage;

    g_run.width = SPINNER_TOTAL_FRAMES * SPINNER_FRAME_WIDTH;
    genImage.onload = function ()
    {
        SPINNER_IMG_TIMEOUT = setTimeout(fun, 0);
    };

    initCanvas();
}
```
