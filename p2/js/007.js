//	CS247: Calvin Fernandez, Maurizio 

var package = 
{
	//	All data for barrel initialization 

	barrelPath: "..\/images\/barrel007.png",
	barrelID: 	"barrelOverlay",
	barrelCenterCheat: {x: -170, y: 0},	//	X and Y constant offset to barrel center
	barrelCenter: {x: 0, y: 0},			//	Barrel center
	bloodPath: "..\/images\/blood007.png",
	parent_container: "capture",
	canvas_container: "shadowCanvas"
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
			.mousemove(function(){ barrelOverlay.move({"x": event.clientX, "y": event.clientY})});
	},

	interpolate: function(sensor_width, sensor_height)
	{
		//	TODO: Add interpolator to map kinect coordinates
		//	to screen coordinates. 
	},

	barrelAnimate: function(type)
	{
		//	TODO: Add custom animations to barrel movement
		//	eg the shaking after the shot and stuff.
	}
}

$(function()
{
	barrelOverlay.init();
});