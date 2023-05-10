//Images
let img1,img2;
let cactusImage;
//Objects
let dino;
let obstacle=[];
//Timing and score
let interval;
let t;
let score
let scoreHi = 0;
//Background
let lines = {
  x:[],
  y:[],
  size:[]
}
let cloudX=[]
let cloudY=[]
let firstPlay = true;
let endGame = true;
let day = true
let sunCol, grndCol, scoreCol, cloudCol

function preload(){
  img1 = loadImage("Dinos.png")
  img2 = loadImage("DinosWhite.png")
  cactusImage = loadImage("Cactus.png")
  cactusImage2 = loadImage("CactusWhite.png")
}

function setup() {
  createCanvas(800, 400);
  
  //Setting initilizing first obstacles and character and animations
  interval = int(random(30,100))
  dino = new Dino()
  obstacle[0] = new Obstacle(700,height-70,60)
  score = 0;
  t=0;
  
  //Creates moving lines, ensuring they spaced somewhat equally along the x-axis
  for(let i = 0; i<20; i++){
    lines.x[i] = random(i*40,(i+1)*40)
    lines.y[i] = random(height-38,height-30)
    lines.size[i] = random(2,10)
  }
  
  //Initializing clouds
  for(let i = 0; i<3; i++){
    cloudX[i] = random(200,400)*i+random(40,100)
    cloudY[i] = random(50,height/2)
  }
 
  noLoop()
  textSize(20)

}

function draw() {
  scenery()
  score += 0.25
  collision()
  createObstacles()
  for(let i = 0; i<obstacle.length; i++){
    obstacle[i].show()
    obstacle[i].update()
  }
  dino.show()
  dino.update()
}

function collision(){
  //detects collision with dino
  for(let i = 0; i< obstacle.length; i++){
    let d = dist(dino.x,dino.y,obstacle[i].x,obstacle[i].y)
    if(d < dino.size/2 + obstacle[i].size/2){
      noLoop()
      endGame =true;
      if(score>scoreHi){
        scoreHi = int(score);
      }
    }
  }
}

function createObstacles(){
  //creating obstacles, random intervals
  t++
  if(t/interval==1){
    interval = int(random(40,150))
    t=0;
    let siz = int(random(40,70));
    obstacle[obstacle.length] = new Obstacle(width,height-40-siz/2,siz)
  }
  
  //managing the number of objects to ensure good run speed
  if(obstacle.length > 10){
    obstacle.shift()
  }
  
}

function keyPressed(){
  if(dino.y == height-65){
      if(key == " "){
      dino.ySpeed = 11
    }
  }
}

function mousePressed(){
  
  if(endGame == true){
    
  
    if(firstPlay == true){
      loop(); 
      firstPlay = false;
    } else{
      while(obstacle.length>0){
        obstacle.pop()
      }
      setup();
      loop()
    }
    endGame = false;
  }

}

function scenery(){
  
  //Checking if it is day or night and setting colours accordingly
  if(score%400 == 0 && score%800 == 0){
    day = true
  } else if(score%400 == 0 && score%800 != 0){
    day = false
  }

  if(day == true){
    background("lightblue");
    sunCol = "yellow"
    grndCol = 255
    scoreCol = "black"
    cloudCol = "white"
    
  }
  if(day == false){
    background("darkblue");
    sunCol = "white"
    grndCol = 50
    scoreCol = "white"
    cloudCol = [0,0,0,0]
  }
  
  //Ground
  noStroke()
  fill(grndCol)
  rect(0,height-40,width,40)
  //Drawing, Moving and Looping ground Lines
  stroke(scoreCol)
  for(let i = 0; i<20; i++){
    line(lines.x[i],lines.y[i],lines.x[i]+lines.size[i], lines.y[i])
    lines.x[i] += obstacle[0].xSpeed 
    if(lines.x[i] < 0){
      lines.x[i] = width
    }
  }
  
  //Sun
  noStroke()
  fill(sunCol)
  circle(40,40,40)
  
  //clouds
  fill(cloudCol)
  noStroke()
  for(let i = 0; i<3; i++){
    ellipse(cloudX[i],cloudY[i],40)
    ellipse(cloudX[i]+15,cloudY[i]+10,40)
    ellipse(cloudX[i]-15,cloudY[i]+10,40)
    cloudX[i]-=0.5
    if(cloudX[i]<-50){
      cloudX[i] = width+50
      cloudY[i] = random(50,height/2)
    }
  }
  
    //Score and Starting Text
    noStroke()
    fill(scoreCol)
    text("Score: " + int(score) + "  Best: " + scoreHi, 5,20)
  if(firstPlay == true){
    text("Click to Start",width/2-40,height/2)
  }
}

class Dino{
  constructor(){
    this.x = 200
    this.y = height-65
    this.ySpeed = 0
    this.yAcc = 0.5
    this.size = 50
  }
  
  show(){
    //circle(this.x, this.y, this.size)
    if(day == true){
    image(img1,this.x-this.size/2,this.y-this.size/2,this.size,this.size)
    }
    if(day == false){
    image(img2,this.x-this.size/2,this.y-this.size/2,this.size,this.size)
    }
  }
  
  update(){
    this.y -= this.ySpeed;
    if(this.y < height-65){
      this.ySpeed -= this.yAcc
    } else{
      this.ySpeed = 0;
    }
  }
}

class Obstacle{
  constructor(_x,_y,_size){
    this.x = _x
    this.y = _y
    this.size=_size
    this.xSpeed = -7
  }
  
  show(){
    //ellipse(this.x,this.y,this.size)
    if(day == true){
      image(cactusImage,this.x-this.size/2,this.y-this.size/2,this.size,this.size)
    }
    if(day == false){
        image(cactusImage2,this.x-this.size/2,this.y-this.size/2,this.size,this.size)
    }

  }
  
  update(){
    this.x += this.xSpeed
  }
}