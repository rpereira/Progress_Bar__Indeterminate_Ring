Indeterminate Ring
================================

Canvas progress bar like Windows Metro.


###Usage

Include the canvas_spinner.js file on your HTML page:
```html
<script type="text/javascript" src="js/canvas_spinner.js"></script>
```


On your main .js file, load your image:
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
