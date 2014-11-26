var canvas;
var stage;
	function init() {

		console.log("easel init()");

	    canvas = document.getElementById('spacemur');
	    width = canvas.width;
	    height = canvas.height;
	    stage = new createjs.Stage(canvas);
	    
	    
	    stage.update();
	}

	function drawmap(plan) {
	 console.log('jsDraw !');
		var o_map = new createjs.Shape();
		var g = o_map.graphics;

		var x = 0;
		var y = 0;
		var tw = th = 16
		for (var i = 0; i < plan.length; i++){
		  x++;
		  if (plan[i] == 'x') {
  			  g.setStrokeStyle(1, 'round', 'round');
          g.beginStroke("#000");
          g.beginFill("#000");
          g.drawRoundRect(x * tw, y, tw, th, 10);
  		}else if (plan[i] == '\n') {
  		    y += th;
  		    x = 0;
  		}else{
  		    g.setStrokeStyle(1, 'round', 'round');
          g.beginStroke("#000");
          g.beginFill("#ccc");
          g.drawRoundRect(x * tw, y, tw, th, 10);
      }
  		  
		}
		
		stage.addChild(o_map);
    stage.update();
		
	}