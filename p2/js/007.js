//	Stanford University CS247
// 	
//			Calvin Fernandez: cfernand@cs.stanford.edu  
//			Maurizio Caligaris:
//			Roberto Goizueta:
//			Deniz Kahramaner:

var package = 
{
	//	All data for 007 initialization 

	barrelPath: "..\/images\/barrel007.png",
	barrelID: 	"barrelOverlay",
	barrelCenterCheat: {x: -170, y: 0},	//	X and Y constant offset to barrel center
	barrelCenter: {x: 0, y: 0},			//	Barrel center
	
	bloodPath: "..\/images\/blood007.png",
	bloodID: "bloodOverlay", 
	bloodSpeed: 8000,					//	Speed of falling blood. Used in animation

	parent_container: "capture",
	canvas_container: "shadowCanvas",

	view_width: 640,
	view_height: 480,

	barrelSongPath: "..\/audio\/barrel.wav",	// James Bond's theme song
	barrelSongID: "barrelSong",

	ballWhitePath : "..\/images\/ballWhite.png",	// White ball that scrolls left and right
	ballWhiteID: "ballWhite",

	ballBlackPath: "..\/images\/ballBlack.png",		// White ball with black background
	ballBlackID: "ballBlack"
};

var barrelOverlay = 
{
	center: function(JSONcoord)
	{
		//	Centers barrel around user coordinates, x and y.
		//	If using with the kinect, call interpolate before 
		//	center so you can map kinect coordinates to 
		//	screen coordinates. 
		if (JSONcoord.hasOwnProperty("x"))
		{
			return JSONcoord.x - package.barrelCenter.x + package.barrelCenterCheat.x;
		}
		else if (JSONcoord.hasOwnProperty("y"))
		{
			return JSONcoord.y - package.barrelCenter.y + package.barrelCenterCheat.y;
		}
	},

	move: function(JSONcoord)
	{
		//	Moves the center of the barrel to the position passed into
		//	the function. Currently, these are passed in as an event 
		//	object, but the function can be changed if utitil
		$("#" + package.barrelID)
			.css({"left": barrelOverlay.center({"x": JSONcoord.x}), 
					"top": barrelOverlay.center({"y": JSONcoord.y})});
	},

	init: function()
	{
		$("#" + package.parent_container)
			.append($("<img/>")
				.attr({"id": package.barrelID,
						"src": package.barrelPath})
				.load(function(){
					package.barrelCenter.x = $(this).width()/2;
					package.barrelCenter.y = $(this).height()/2;
				}));

		$("#" + package.barrelID).get(0).style.opacity = '0';
			/*.mousemove(function(){ barrelOverlay.move({"x": event.clientX, "y": event.clientY})})
			.click(function() {bloodOverlay.bleed()});*/


	},

	barrelAnimate: function(type)
	{
		//	TODO: Add custom animations to barrel movement
		//	eg the shaking after the shot and stuff.

		var $barrel = $("#" + package.barrelID);
		var $currentLeft = parseInt($barrel.get(0).style.left, 10);
		var $currentTop = parseInt($barrel.get(0).style.top, 10);
		// Slide left
		var $leftDestination1 = $currentLeft + 100;
 		$barrel.animate({left:$leftDestination1 + 'px'}, {duration: 1200});

 		// Slide right
 		var $leftDestination2 = $leftDestination1 - 200;
 		$barrel.animate({left:$leftDestination2 + 'px'}, {duration: 1200});

 		// Slide diagonally towards the bottom
 		var $topDestination1 = $currentTop + 150;

 		$barrel.animate({left:$leftDestination1 + 'px', top: $topDestination1 +'px'}, {duration: 1200});
	}

};
var ballOverlay = 
{
		init: function()
		{

			$("#" + package.parent_container)
			.append($("<img>")
				.attr({"id": package.ballBlackID,
						"src": package.ballBlackPath,
						"top": '0px',
						"z-index": "10"}));
			var $ballBlack = $("#" + package.ballBlackID);
			$ballBlack.get(0).style.left = '-650px';


			$("#" + package.parent_container)
			.append($("<img>")
				.attr({"id": package.ballWhiteID,
						"src": package.ballWhitePath,
						"top": '0px',
						"z-index": "11"}));
			var $ballWhite = $("#" + package.ballWhiteID);
			$ballWhite.get(0).style.left = '-650px';

		},

		ballAnimateRight: function()
		{
			var $ballBlack = $("#" + package.ballBlackID);
			var $ballWhite = $("#" + package.ballWhiteID);
			var $currentLeftBlack = parseInt($ballBlack.get(0).style.left, 10);
			$ballWhite.get(0).style.left = $ballBlack.get(0).style.left;
			$ballWhite.get(0).style.opacity = '1';

			$ballBlack.animate({left:$currentLeftBlack + 100 + 'px'}, {duration: 600});
			$ballWhite.animate({opacity: 0},{duration:600});
		},

		ballAnimateLeft: function()
		{
			var $ballBlack = $("#" + package.ballBlackID);
			var $ballWhite = $("#" + package.ballWhiteID);
			var $currentLeftBlack = parseInt($ballBlack.get(0).style.left, 10);
			$ballWhite.get(0).style.left = $ballBlack.get(0).style.left;
			$ballWhite.get(0).style.opacity = '1';

			$ballBlack.animate({left:$currentLeftBlack - 100 + 'px'}, {duration: 600});
			$ballWhite.animate({opacity: 0},{duration:600});
		},

		ballGrows: function()
		{
			// ----- REALIGNS BARREL ACCORDING TO CENTER OF THE BALL -------
			var $barrel = $("#" + package.barrelID);
			var $ballBlack = $("#" + package.ballBlackID);

			var $ballWidth = parseInt($ballBlack.width(), 10);
			var $ballHeight = parseInt($ballBlack.height(), 10);

			// Makes the barrel visible and put the barrel in the right place
			$barrel.get(0).style.opacity = '1';
			// Left distance of the center of the ball
			var $ballCenterLeft = parseInt($ballBlack.get(0).style.left, 10) + 450;
			var $ballCenterTop = 170;
			// Reposition barrel so that barrel's center aligns with the ball that will grow
			$barrel.get(0).style.left = -1250 + $ballCenterLeft + 'px';
			$barrel.get(0).style.top = -1250 + $ballCenterTop+ 'px';

			// ----- END OF REALIGNMENT

			this.ballGrowsHelper();
		},

		ballGrowsHelper: function()
		{
			var $ballBlack = $("#" + package.ballBlackID);
			var $ballWidth = parseInt($ballBlack.width(), 10);
			var $ballHeight = parseInt($ballBlack.height(), 10);


			// increase factor
			var increase = 500;
			
			/*
			$ballBlack.css({
            	'-moz-transform':'scale('+factor+')',
            	'-webkit-transform':'scale('+factor+')'
    		});
*/
			/*
    		$ballBlack.animate({
    			top: '-=' + ( ( $ballHeight / $ballWidth ) * increase ) / 2,
    			left: '-=' + increase / 2,
    			width: '+=' + increase,
    			height: '+=' + ( $ballHeight / $ballWidth ) * increase
    		});
*/

    		$ballBlack.css({
    			'-webkit-transition': 'all 3s linear',
    			'-moz-transition': 'all 3s linear',
    			'-o-transition': 'all 3s linear',
			    '-webkit-transform': 'scale(50)',
			    '-moz-transform': 'scale(50)',
			    '-o-transform': 'scale(50)'
			});


			/*
    		
		    $ballBlack.animate(
		    	{scale: '+=3'}, {queue: false, duration: 1000}
            	/*
		        top: '-=' + $ballHeight / factor,
		        left: '-=' + $ballWidth / factor ,
		        width: $ballWidth * factor
		    );

			*/
		}
}


var bloodOverlay = 
{
	init: function()
	{
		//	Initializes blood overlay
		$("#" + package.parent_container)
			.append($("<img>")
				.attr({"id": package.bloodID,
						"src": package.bloodPath}));
	},

	bleed: function()
	{
		//	Animates the blood overlay
		$("#" + package.bloodID).slideDown(package.bloodSpeed);
	},

	heal: function()
	{
		//	Cleans up all the blood
		$("#" + package.bloodID).hide();
	}
}

var kinectMotion = 
{
	//	TODO: Interface with Kinect and KinectJS
	//	MOTIONTRACKING: Interpolate coordinates
	//	from kinect to map to screen coordinates
	//	after interpolation call barrelOverlay.move
	//	and the barrel center around whatever interpolated
	//	coordinates you pass it.
	//	HANDTRACKING: Watch at least one hand, 
	//	better both. If the hand is above a certain
	//	threshold height, classify that as a gun shot
	//	and call bloodOverlay.bleed()
	JOINTS: ['HIP_CENTER', 'HAND_LEFT', 'HAND_RIGHT'],

	interpolate: function(type, point)
	{	
		//	Interpolates the coordinates of kinect to 
		//	map to coordinates of viewing window
		if (type === 'x')
		{
			return Math.max(point / 100 * package.view_width, 0);
		}
		else if (type === 'y')
		{
			return Math.max(point / 100 * package.view_height, 0);
		}
	},

	init: function()
	{
		kinect.setUp({
    		players:  1,   
    		relative: true,
    		meters: false,
    		sensitivity: 1.0,                 // # of players, max = 2
    		joints:   this.JOINTS,          // array of joints to track
    		gestures: ['ESCAPE', 'JUMP']    // array of gestures to track
		})
		.setPercentageMode()
		.sessionPersist()
		.modal.make('../css/knctModal.css')    // Green modal connection bar
		.notif.make();

		console.log("finished");
		kinect.onMessage(function()
		{
			var interpX = kinectMotion.interpolate('x', this.coords[0][0].x);
			var interpY = kinectMotion.interpolate('y', this.coords[0][0].y);
			barrelOverlay.move({'x': interpX, 'y': interpY});

			if ( ( this.coords[0][1].y - this.coords[0][0].y ) <= -70 || 
					( this.coords[0][2].y - this.coords[0][0].y ) <= -70)
			{
				bloodOverlay.bleed();
				//orchestra.fire();
			}
		});
	}


}

var orchestra =
{

	//	TODO: Simple javascript class 
	//	for firing music at specific points in 
	//	the interaction. 

	barrelSongInit: function()
	{
		$("#" + package.barrelSongID).src = package.barrelSongPath;
	},

	barrelSongPlayFromTime: function(currentTime)
	{
		$("#" + package.barrelSongID).get(0).play(currentTime);
	},

	barrelSongPlay: function()
	{
		$("#" + package.barrelSongID).get(0).play();
	},

	barrelSongPause: function()
	{
		$("#" + package.barrelSongID).get(0).pause();
	}
}

$(function()
{

	//kinectMotion.init();
	barrelOverlay.init();
	ballOverlay.init();
	bloodOverlay.init();
});