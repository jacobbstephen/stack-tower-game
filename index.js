let canvas = document.getElementById("myCanvas");
let gameOverText = document.querySelector(".gameOverText");
let scoreNumber = document.querySelector(".scoreNumber");
let context = canvas.getContext("2d")
// declare variables
let xSpeed, mode, cameraY,scrollCounter,current;
let ySpeed = 5;
let height = 50;
// current means no of boxes
// declare an arrray for storing the boxes
let boxes = [];
boxes[0] = {
    x:300,
    y:300,
    width:200
}

// declare a variable for debris which is the one cut off, size of debris would depend on the box
let debris = {
    x:0,
    width:0
}

function newBox(){
    boxes[current] = {
        x: 0,
        y: (current + 10) * height,
        width: boxes[current - 1].width
    };
}
function gameOver (){
    // show gameover text
    gameOverText.style.display = 'block';
    mode = 'gameOver';

}
function animate(){
    if(mode != 'gameOver'){
        
        context.clearRect(0,0,canvas.width,canvas.height); // for creating a rectangle
        scoreNumber.innerHTML = current - 1;
        // update the score as we play
        for(let n = 0; n < boxes.length;n++){
            let box = boxes[n];
            context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
            context.fillRect(box.x,600 - box.y + cameraY,box.width,height);// cameraY is used for moving the box to move down as we play the game
        }
        context.fillStyle = 'black';
        context.fillRect(debris.x,600 - debris.y + cameraY,debris.width,height); //   create the debris 

        if(mode == 'bounce'){
            // as animate is called each time the spped is added
            boxes[current].x = boxes[current].x + xSpeed;
            // the code for the box to move left and right
            if(xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
                xSpeed = -xSpeed;
            if(xSpeed < 0 && boxes[current].x  < 0)
                xSpeed = -xSpeed;
            // as soon i click the mode must be fall and it must move down
        }

        if (mode == 'fall'){
            boxes[current].y = boxes[current].y - ySpeed;
            // now we need to stop the fall that is to land the box on the top of the other box

            if(boxes[current].y == boxes[current - 1].y + height) {
                mode = 'bounce';
                // now remove the extra part
                let difference = boxes[current].x - boxes[current - 1].x;

                if(Math.abs(difference) >= boxes[current].width){
                    gameOver();
                }
                // create the debris
                debris = {
                    y: boxes[current].y,
                    width:difference
                }
                // make the debris fall
                if(boxes[current].x > boxes[current - 1].x){
                    boxes[current].width = boxes[current].width - difference;
                    debris.x  = boxes[current].x + boxes[current].width;
                }
                else{
                    debris.x = boxes[current].x - difference;
                    boxes[current].width = boxes[current].width + difference;
                    boxes[current].x = boxes[current - 1].x;
                }
                if(xSpeed > 0) xSpeed++;
                else xSpeed--;
                current++;
                scrollCounter = height;
                newBox();

                
            }
               
        }
        debris.y = debris.y - ySpeed;
        if(scrollCounter){
            cameraY++;
            scrollCounter--;
        }
    }
    window.requestAnimationFrame(animate)// this is used to call the animate fn contionously
}
function restart(){
    gameOverText.style.display = 'none'
    boxes.splice(1,boxes.length -1);
    mode = 'bounce';
    cameraY = 0
    scrollCounter = 0;
    xSpeed = 2;
    current = 1;
    newBox();
    debris.y = 0
}
// as soon i sclick the canvas the mode must change from bounce => fall
canvas.onpointerdown = function(){
    if (mode == 'gameOver') restart();
    else {
        if (mode == 'bounce') {
            mode = 'fall'
        }
    }
}

restart();
animate();