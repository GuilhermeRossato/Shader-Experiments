class Application {
	constructor() {
		var canvas = document.getElementById("canvas");
		var graphics = new WebGLSystem(canvas);
		graphics.setFragmentSource(document.getElementById("fragScript").text);
		graphics.setVertexSource(document.getElementById("vertScript").text);
		graphics.init();
		graphics.render();
	}
}