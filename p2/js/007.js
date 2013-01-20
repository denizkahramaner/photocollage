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
	view_height: 480
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
				}))
			.mousemove(function(){ barrelOverlay.move({"x": event.clientX, "y": event.clientY})})
			.click(function() {bloodOverlay.bleed()});
	},

	barrelAnimate: function(type)
	{
		//	TODO: Add custom animations to barrel movement
		//	eg the shaking after the shot and stuff.
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
}

$(function()
{
	kinectMotion.init();
	barrelOverlay.init();
	bloodOverlay.init();
});