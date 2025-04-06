
var navigation = new Class({

  initialize: function() {
    this.paginatedBox = [];
    this.nodes = [];
    this.paginatedBox1 = $("about");
    this.paginatedBox1_next = $("aboutD");
    this.paginatedBox1_prev = $("aboutL");    
    this.paginatedBox2 = $("social");
    this.paginatedBox2_next = $("socialD");
    this.paginatedBox2_prev = $("socialL");   
    this.NextPrevPage(this.paginatedBox1_prev, this.paginatedBox1_next, this.paginatedBox1);
    this.NextPrevPage(this.paginatedBox2_prev,this.paginatedBox2_next,this.paginatedBox2);

  },


  NextPrevPage: function(a,b,c) {
    nodes = c.getElements('article');
     a.addEvent('click', this.previousPage.bind(this));
      b.addEvent('click', this.nextPage.bind(this)); 
  },

  nextPage: function(e) {
    if (e == "socialD"){
      var l = e;
      var k = document.getElementById("social").getElements('article');

    } else {
      var l = e.target.attributes.id.nodeValue.slice(0, -1);
      var k = document.getElementById(l).getElements('article');
    }

      if (k[0].match('.active')){
        var myTarget = k[0].removeClass('active').addClass("notactive");
        var slideMeDiv = myTarget.getParent().set('styles', {left: '-795px'});
        k[1].removeClass('notactive').addClass("active");

        } else if (k[1].match('.active')) {

          var myTarget = k[1].removeClass('active').addClass("notactive");
          var slideMeDiv = myTarget.getParent().set('styles', {left: '-1590px'});
          k[2].removeClass('notactive').addClass("active");

        } else {}

  },

  previousPage: function(a) {
    if (a == "socialL"){
      var foo = a;
      var bar = document.getElementById("social").getElements('article');
      console.log("prevPage");
    } else {
      var foo = a.target.attributes.id.nodeValue.slice(0, -1); 
      var bar = document.getElementById(foo).getElements('article');
    }


   if (bar[0].match('.active')){
     } else if (bar[2].match('.active')) {
      var myTarget1 = bar[2].removeClass('active').addClass("notactive");
      var slideMeDiv1 = myTarget1.getParent().set('styles', {left: '-795px'});
      bar[1].removeClass('notactive').addClass("active");

     } else if (bar[1].match('.active')){
      
      var myTarget1 = bar[1].removeClass('active').addClass("notactive");
      var slideMeDiv1 = myTarget1.getParent().set('styles', {left: '0px'});
      bar[0].removeClass('notactive').addClass("active");

     }

  }

});




/*end navigation*/ 

/*AI code start*/




window.addEvent('load', function(){
  var navi = new navigation();

});
const config = {
  video: { width: 640, height: 480, fps: 30 },
};
let videoWidth, videoHeight, drawingContext, canvas, gestureEstimator;
let model;

const gestureStrings = {
    left: 'left',
    right: 'right'
};

const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const landmarkColors = {
  thumb: 'red',
  indexFinger: 'blue',
  middleFinger: 'yellow',
  ringFinger: 'green',
  pinky: 'pink',
  palmBase: 'white',
};


function createFingersLeft() {
  const HorizontalLeft = new fp.GestureDescription('left');


// index:
HorizontalLeft.addCurl(fp.Finger.Index,  fp.FingerCurl.NoCurl, 1.0);
HorizontalLeft.addDirection(fp.Finger.Index,  fp.FingerDirection.HorizontalLeft, 8);                                                                


// middle:
HorizontalLeft.addCurl(fp.Finger.Middle,  fp.FingerCurl.NoCurl, 9);
HorizontalLeft.addDirection( fp.Finger.Middle,  fp.FingerDirection.HorizontalLeft, 8);

// ring:
HorizontalLeft.addCurl(fp.Finger.Ring,  fp.FingerCurl.NoCurl, 9);
HorizontalLeft.addDirection( fp.Finger.Ring,  fp.FingerDirection.HorizontalLeft, 8);

// pinky:
HorizontalLeft.addCurl(fp.Finger.Pinky,  fp.FingerCurl.NoCurl, 9);
HorizontalLeft.addDirection( fp.Finger.Pinky,  fp.FingerDirection.HorizontalLeft, 8);

  return HorizontalLeft;
}

function createFingersRight() {
  const HorizontalRight = new fp.GestureDescription('right');


// index:
HorizontalRight.addCurl(fp.Finger.Index,  fp.FingerCurl.NoCurl, 9);
HorizontalRight.addDirection(fp.Finger.Index,  fp.FingerDirection.HorizontalRight, 9);


// middle:
HorizontalRight.addCurl(fp.Finger.Middle,  fp.FingerCurl.NoCurl, 9);
HorizontalRight.addDirection( fp.Finger.Middle,  fp.FingerDirection.HorizontalRight, 9);

// ring:
HorizontalRight.addCurl(fp.Finger.Ring,  fp.FingerCurl.NoCurl, 9);
HorizontalRight.addDirection( fp.Finger.Ring,  fp.FingerDirection.HorizontalRight, 9);

// pinky:
HorizontalRight.addCurl(fp.Finger.Pinky,  fp.FingerCurl.NoCurl, 9);
HorizontalRight.addDirection( fp.Finger.Pinky,  fp.FingerDirection.HorizontalRight, 9);


  return HorizontalRight;
}

function drawKeypoints(keypoints) {
  for (let i = 0; i < keypoints.length; i++) {
    const y = keypoints[i][0];
    const x = keypoints[i][1];
    drawPoint(x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(points, false, landmarkColors[finger]);
  }
  
  const singleFingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(points, false, landmarkColors[finger]);
  }

}

function drawPoint(y, x, r) {
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, 0, 2 * Math.PI);
  drawingContext.fill();
}

console.log(drawPoint);


function drawPath(points, closePath, color) {
  drawingContext.strokeStyle = color;
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  drawingContext.stroke(region);
}

async function loadWebcam(width, height, fps) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia is not available'
    );
  }

  let video = document.getElementById('webcam');
  video.muted = true;
  video.width = width;
  video.height = height;

  const mediaConfig = {
    audio: false,
    video: {
      facingMode: 'user',
      width: width,
      height: height,
      frameRate: { max: fps },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await loadWebcam(
    config.video.width,
    config.video.height,
    config.video.fps
  );
  video.play();
  return video;
}
async function continuouslyDetectLandmarks(video) {
  async function runDetection() {
    drawingContext.drawImage(
      video,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw hand landmarks
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const result = predictions[0].landmarks;
      drawKeypoints(result, predictions[0].annotations);
    }

    if (
      predictions.length > 0 &&
      Object.keys(predictions[0]).includes('landmarks')
    ) {
      const est = gestureEstimator.estimate(predictions[0].landmarks, 7);
      if (est.gestures.length > 0) {
        // Find gesture with highest match score
        let result = est.gestures.reduce((p, c) => {
          return p.score > c.score ? p : c;
        });

        if (result.score > 9) {

          document.getElementById('gesture-text').textContent = gestureStrings[result.name];
          document.getElementById('footer').textContent = gestureStrings;
        }
      }
    }

    requestAnimationFrame(runDetection);
  }
  
  // Initialize gesture detection
  const knownGestures = [
    fp.Gestures.VictoryGesture,
    createFingersLeft(),
    createFingersRight()
  ];

  gestureEstimator = new fp.GestureEstimator(knownGestures);

  model = await handpose.load();
  runDetection();
}

async function main() {
  let video = await loadVideo();

  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;

  canvas = document.getElementById('canvas');
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  drawingContext = canvas.getContext('2d');
  drawingContext.clearRect(0, 0, videoWidth, videoHeight);

  drawingContext.fillStyle = 'white';
  drawingContext.translate(canvas.width, 0);
  drawingContext.scale(-1, 1);

  continuouslyDetectLandmarks(video);
}

main();


//now create our observer and get our target element
var observer = new MutationObserver(txtHandler),
        elTarget = document.getElementById("gesture-text"),
        objConfig = {
            childList: true,
            subtree : true,
            attributes: false, 
            characterData : false
        };

//then actually do some observing
observer.observe(elTarget, objConfig);

var lastMove = 0;
function txtHandler () {
                          if(Date.now() - lastMove > 800) {


                            var myProps = $('gesture-text').outerText.toString();
                            var goRight  =  $('socialD');
                            var goLeft  =  $('socialL');

                            console.log(myProps);

                            if (myProps === 'right'){
                              goRight.fireEvent('click', "socialD"); 
                            } else if (myProps === 'left'){
                              goLeft.fireEvent('click', "socialL");
                            } else {

                            }

                            lastMove = Date.now();
} 


}
