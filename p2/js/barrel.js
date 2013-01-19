var package = 
{
	barrelPath: "..\/images\/barrel007.png",
	barrelID: 	"barrelOverlay",
	barrelCenterCheat: {x: -170, y: 0},
	barrelCenter: {x: 0, y: 0},
	bloodPath: "..\/images\/blood007.png",
	parent_container: "capture",
	canvas_container: "shadowCanvas"

};

var barrelOverlay = 
{
	center: function(JSONobj)
	{
		if (JSONobj.hasOwnProperty("x"))
		{
			return JSONobj.x - package.barrelCenter.x + package.barrelCenterCheat.x;
		}
		else if (JSONobj.hasOwnProperty("y"))
		{
			return JSONobj.y - package.barrelCenter.y + package.barrelCenterCheat.y;
		}
	},
	move: function(event)
	{
		$("#" + package.barrelID)
			.css({"left": barrelOverlay.center({"x": event.clientX}), 
					"top": barrelOverlay.center({"y": event.clientY})});
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
			.mousemove(function(){ barrelOverlay.move(event);});
	},

	interpolate: function(sensor_width, sensor_height)
	{

	},
}