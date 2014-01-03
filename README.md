Indeterminate Ring
================================

HTML5 Canvas progress bar like Windows Metro.


###Usage

function startAnimation() 
{
FPS = Math.round(100 / SPINNER_SPEED);
SECONDS_BETWEEN_FRAMES = 1 / FPS;
g_GameObjectManager = null;
g_run = genImage;

g_run.width = SPINNER_TOTAL_FRAMES * SPINNER_FRAME_WIDTH;
genImage.onload = function () {
SPINNER_IMG_TIMEOUT = setTimeout(fun, 0);
};
initCanvas();
}

/**
* Pre-loads the sprites image.
* @param s      The image source
*/
function imageLoader(s, fun) {
clearTimeout(SPINNER_IMG_TIMEOUT);
SPINNER_IMG_TIMEOUT = 0;
genImage = new Image();
genImage.onload = function () {
SPINNER_IMG_TIMEOUT = setTimeout(fun, 0);
};
genImage.onerror = new Function('alert(\'N��o foi poss��vel carregar a imagem. :(\')');
genImage.src = s;
}
