class Application {
	applyStyle() {
		var style;
		style = `margin:0; padding:0;`;
		document.body.setAttribute("style", style);
	}
	constructor() {
		var canvas = document.getElementById("canvas");
		var graphics = new WebGLSystem({canvas: canvas});
		graphics.setFragSource(document.getElementById("fragScript").text);
		graphics.setVertexSource(document.getElementById("vertScript").text);
		this.graphics = graphics;
		this.canvas = canvas;
		this.applyStyle();
		graphics.init();
		graphics.render();
	}
	onResize() {
	}
}