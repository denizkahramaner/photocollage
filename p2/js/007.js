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
	barrelCenterCheat: {x: -170, y: 0},	//	X and Y constant offset to barrel center -170
	barrelCenter: {x: 0, y: 0},			//	Barrel center
	
	bloodPath: "..\/images\/blood007.png",
	bloodID: "bloodOverlay", 
	bloodSpeed: 8000,					//	Speed of falling blood. Used in animation

	parent_container: "capture",
	canvas_container: "shadowCanvas",

	view_width: 640,
	view_height: 480,

	themeSongPath: "..\/audio\/barrel.wav",	// James Bond's theme song
	themeSongID: "themeSong",

	gunShotPath: "..\/audio\/gunshotAndTheme.wav",
	gunShotID: "gunShot",

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
					orchestra.loadMusic();
				}))
			//.mousemove(function(){ barrelOverlay.move({"x": event.clientX, "y": event.clientY})})
			//.click(function() {bloodOverlay.bleed()});
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

}

var ballBlackOverlay = 
{
		init: function()
		{
			$("#" + package.parent_container)
			.append($("<img>")
				.attr({"id": package.ballBlackId,
						"src": package.ballBlackPath}));
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

		kinect.onMessage(function()
		{
			var interpX = kinectMotion.interpolate('x', this.coords[0][0].x);
			var interpY = kinectMotion.interpolate('y', this.coords[0][0].y);
			barrelOverlay.move({'x': interpX, 'y': interpY});

			if ( ( this.coords[0][1].y - this.coords[0][0].y ) <= -70 || 
					( this.coords[0][2].y - this.coords[0][0].y ) <= -70)
			{
				//	If your hand is above a certain point classify as 
				//	gun fire and queue song and animations.	
				bloodOverlay.bleed();
				orchestra.play();
			}
		});
	}
}

var orchestra =
{

	//	Simple javascript class 
	//	for firing music at specific points in 
	//	the interaction. 

	loadMusic: function()
	{
		//	Function that loads all music
		//	ideally to be called after other media
		//	has been loaded to keep page loads fast.
		//	The gun shot has a function attached to
		//	it that gets called as soon as it is finished
		//	playing. We call the theme song as soon as the 
		//	gun shot is done.
		$("#" + package.gunShotID)
			.bind("ended", function(){ orchestra.playTheme(); });
		$("#" + package.themeSongID)
			.attr("src", package.themeSongPath)
	},

	playTheme: function()
	{
		//	Plays the 007 theme song
		$("#" + package.themeSongID).get(0).play();
	},

	play: function()
	{
		//	Plays music from the gunshot start
		$("#" + package.gunShotID).get(0).play();
	},

	pause: function()
	{
		//	Pauses all currently playing music
		$("#" + package.themeSongID).get(0).pause();
		$("#" + package.gunShotID).get(0).pause();
	},

	barrelSongPlayFromTime: function(currentTime)
	{
		$("#" + package.themeSongID).get(0).play(currentTime);
	},

	barrelSongPlay: function()
	{
		$("#" + package.gunShotID).get(0).play();	
		$("#" + package.themeSongID).get(0).play();
	},

	barrelSongPause: function()
	{
		$("#" + package.themeSongID).get(0).pause();
		$("#" + package.gunShotID).get(0).pause();
	}
}

$(function()
{
	kinectMotion.init();
	barrelOverlay.init();
	bloodOverlay.init();
});