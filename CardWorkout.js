"use strict"

const FRAME_WIDTH = 1000;
const FRAME_HEIGHT = 1000;
const PLOT_X = 16;

/* ===================== SETUP ================== */

// Setup the PIXI renderer that handles interactive display and input inside the browser
let renderer = PIXI.autoDetectRenderer(FRAME_WIDTH, FRAME_HEIGHT);
renderer.backgroundColor = 0xFFFFFF;
renderer.autoResize = true;
renderer.roundPixels = true;

// Optionally connect to Firebase Cloud Database.
// IMPORTANT NOTE: Should only be used for internal test piloting. Results saved
// online are not supported by our IRB (due to possible security issues) and
// therefore would be unethical to publish.
const saveToCloud = 0;
if(saveToCloud){
  let firebase = new Firebase("https://testpilotsuperss.firebaseio.com/");
}

// Standard Screen
let stage = new PIXI.Container();
  // Graphics object for lines and squares and such...
let graphics = new PIXI.Graphics();
//graphics.mapper = new ScreenXYMap(30,0,0,30,FRAME_WIDTH/4,FRAME_HEIGHT/2);
let map1 = new FrameXYMap(30,0,0,30,FRAME_WIDTH*1/4,FRAME_HEIGHT/2);
graphics.mapper = map1
stage.addChild(graphics);

let ArcadeScore = 0;
let textPosition = [];

let stepText = new PIXI.Text('0',{fontFamily: 'Gill Sans', fontSize:100, fontWeight:500,fill : 0x770000})
stepText.x = 20
stepText.y = 20
stepText.text = 'Queen of Hearts : 20 Push-ups';
stage.addChild(stepText);

let meterText = new PIXI.Text('0',{fontFamily: 'Gill Sans', fontSize:50, fontWeight:500,fill : 0x000000})
meterText.x = 20
meterText.y = 200
meterText.text = 'PROGRESS: 1 / 52';
stage.addChild(meterText);

/*
let horizAxisText = new PIXI.Text('0',{font : '100px Gill Sans', fill : 0x111111})
textPosition = map1.mapStateToPosition(PLOT_X+50,0)
horizAxisText.x = textPosition[0]
horizAxisText.y = textPosition[1]
horizAxisText.text = 'TIME';
stage.addChild(horizAxisText);
let vertAxisText = new PIXI.Text('0',{font : '100px Gill Sans', fill : 0x111111})
textPosition = map1.mapStateToPosition(PLOT_X,12)
vertAxisText.x = textPosition[0]
vertAxisText.y = textPosition[1]
vertAxisText.text = 'PENDULUM ANGLE';
stage.addChild(vertAxisText);
*/

var encouragements = ["Forward!","You're gonna crush it!","Fight fight!","Remember to Breathe","KYAAAA!","You've got this!","","","","","",""]

var encouragementsClose = ["We're almost there","Don't forget to Breathe","KYAAAA!","KYAAaaugh!","Keep going!!","Keep pushing!!","Almost there!","Just a little further","Just a few more after this","I can see the light at the end of the tunnel",,"","","","","",""]
let legendText = new PIXI.Text('0',{fontFamily : 'Gill Sans', fill : 0x555555})
legendText.x = 20
legendText.y = 500
legendText.text = "";
stage.addChild(legendText);

// ===================== THE MAIN EVENT ================== //

// Main Loop
let clock =  0 ;
let now = Date.now();
window.setInterval(function() {
  /*
  // Rendering the stage
    // Clear the screen
  graphics.clear();
    // Draw the time axis
  graphics.lineStyle(2, 0x111111);
  var position = map1.mapStateToPosition(PLOT_X,0);
  graphics.moveTo(position[0],position[1])
  position = map1.mapStateToPosition(PLOT_X+50,0);
  graphics.lineTo(position[0],position[1])
    // Render the stage
  */
  renderer.render(stage);
},2)

// ====================== Mouse Listener Loop ========================= //
document.addEventListener("mousedown",function(event) {
  flipNewCard();
  // End
})

function shuffle(array) {
  var currentIndex = array.length, temp, randomIndex;

  while (currentIndex > 0) { // While there are cards yet unshuffled
    // Randomly pick a card from the deck
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And move it to the back, swapping with the current last card
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

let suitNames = ['Hearts','Spades','Diamonds','Clubs']
let suitExercises = ['Push-ups','Kicks','Sit-ups and Back-arches','Techniques']
let suitMultipliers = [2,2,2,3]
let suitColors = [0x770000,0x555555,0xAA0000,0x000000]
let rankNames = ['Zero','Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Jack','Queen','King']
let deck = []

for(var thisSuit = 0; thisSuit < 4; thisSuit++) {
  for(var thisRank = 1; thisRank < 14; thisRank++) {
    deck.push([thisRank,thisSuit])
  }
}
shuffle(deck)

var curCard = -1;
flipNewCard()
legendText.text = "";
function flipNewCard() {
  curCard++;
  meterText.text = 'PROGRESS: ' + (curCard+1) +' / 52';
  console.log("Current Card = "+curCard)
  if(curCard >= deck.length) {
    stepText.text = "You've crushed the whole deck"
    legendText.text = "I'm proud of you";
    meterText.text = "PROGRESS: 52 / 52"
  } else {
    let thisNumber = deck[curCard][0];
    let thisSuit = deck[curCard][1];
    stepText.text = rankNames[thisNumber]+" of "+suitNames[thisSuit] + ":: "+suitMultipliers[thisSuit]*thisNumber + " " + suitExercises[thisSuit];
    stepText.style.fill = suitColors[thisSuit];
    if(curCard >= deck.length * 0.75) {
      var randomIndex = Math.floor(Math.random() * encouragements.length);
      legendText.text = encouragementsClose[randomIndex];
    } else {
      var randomIndex = Math.floor(Math.random() * encouragements.length);
      legendText.text = encouragements[randomIndex];
    }
  }
}

// Mount the renderer in the website
let mount = document.getElementById("mount");
mount.insertBefore(renderer.view, mount.firstChild);
resize()

// Listen for window resize events
window.addEventListener('resize', resize);
resize()

// Resize function window
function resize() {
  const parent = renderer.view.parentNode;
	// Resize the renderer
  //let newWidth = window.innerWidth
  //let newHeight = window.innerHeight
  let newWidth = parent.clientWidth
  let newHeight = parent.clientHeight

  renderer.resize(newWidth, newHeight);
  console.log(newWidth, newHeight)
  map1.bx = newWidth/4
  map1.by = newHeight/2

  let scale = newWidth/FRAME_WIDTH
  if(scale > newHeight/FRAME_HEIGHT)
    scale = newHeight/FRAME_HEIGHT

  stage.scale.x = scale
  stage.scale.y = scale
  map1.bx /= scale
  map1.by /= scale
}
