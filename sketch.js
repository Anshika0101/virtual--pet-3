var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog = createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  for (var i = 5; i < 1000; i=i+10) 
  {
  
  var dot = createSprite(i, 5, 3, 3);
  dot.shapeColor = "blue";
  
  }
  for (var i = 5; i < 1000; i=i+10) 
  {
  
  var dot1 = createSprite(i, 495, 3, 3);
  dot1.shapeColor = "blue";
  
  }
  for (var i = 5; i < 1000; i=i+10) 
  {
  
  var dot1 = createSprite(995,i, 3, 3);
  dot1.shapeColor = "blue";
  
  }
  for (var i = 5; i < 1000; i=i+10) 
  {
  
  var dot1 = createSprite(5,i, 3, 3);
  dot1.shapeColor = "blue";
  
  }
}

function draw() {
  background("pink");
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
  textSize(17);
  fill("black");
  text("❤This is your Puppy Tommy🐶 and he is so Hungry❤",320,120);
  fill("black");
  text("💖Add food for Tommy 'ADD FOOD' then click on 'FEED DRAGO' to feed your pet Dog Tommy💖",200,100);
  fill("black");
  text("Milk Bottles Remaining  "+foodS,400,440);
  fill("black");
  text("💛Hellow Once Again,Gorgeous mam💛",400,80);
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
