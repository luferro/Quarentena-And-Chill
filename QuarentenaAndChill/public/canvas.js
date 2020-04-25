let r, g, b;

function setup() {
    let canvasDiv = document.getElementById('page-content');
    let width = canvasDiv.offsetWidth;
    let height = canvasDiv.offsetHeight;
    let myCanvas = createCanvas(width, height);
    myCanvas.parent('sketch');

    socket.on('mouse', newDrawing);

    r = random(255);
    g = random(255);
    b = random(255);
}

function newDrawing(data) {
    noStroke();
    fill(255,0,100);
    ellipse(data.x, data.y, 15, 15);
}

function mouseDragged() {
    var data_canvas = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('mouse', data_canvas);

    noStroke();
    fill(r, g, b);
    ellipse(mouseX, mouseY, 15, 15);
}

function keyPressed()
{
    if(keyCode == UP_ARROW){
        setup();
    }
}