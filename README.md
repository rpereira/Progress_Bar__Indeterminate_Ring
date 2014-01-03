Indeterminate Ring
================================

HTML5 Canvas progress bar like Windows Metro.


###Usage

```javascript
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
...
console.log(SHA256("Message"));
```

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
