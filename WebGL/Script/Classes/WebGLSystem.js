class WebGLSystem {
	constructor(config) {
		if (!(config.canvas instanceof HTMLCanvasElement)) {
			throw new ParameterError("WebGLSystem must receive a valid canvas element in its configuration parameter");
		}
		this.canvas = config.canvas;
		if (config.vertex) {
			[config.vertex, config.vertex.text, config.vertex.innerText].any((text) => (typeof text === "string" && (this.setVertexSource(text) || true)));
		}
		if (config.frag) {
			[config.frag, config.frag.text, config.frag.innerText].any((text) => (typeof text === "string" && (this.setFragSource(text) || true)));
		}	
	}
	clear(r=0, g=0, b=0, a=1) {
		this.GL.clearColor(r,g,b,a);
		this.GL.clear(GL.COLOR_BUFFER_BIT| GL.DEPTH_BUFFER_BIT);
	}
	setVertexSource(source) {
		this.vertexSource = source;
	}
	setFragSource(source) {
		this.fragmentSource = source;
	}
	_initShaders() {
		var GL = this.GL;
		this.shaderProgram = GL.createProgram();
		var shaderId = this.shaderProgram;
		var vertId = GL.createShader(GL.VERTEX_SHADER);
		var fragId = GL.createShader(GL.FRAGMENT_SHADER);
		GL.shaderSource(vertId, this.vertexSource);
		GL.shaderSource(fragId, this.fragmentSource);
		GL.compileShader(vertId);
		if (!GL.getShaderParameter(vertId, GL.COMPILE_STATUS)) {
			var message = ("Vertex Shader Compiler Error:\n" + GL.getShaderInfoLog(vertId));
			GL.deleteShader(vertId);
			throw new Error(message);
		}
		GL.compileShader(fragId);
		if (!GL.getShaderParameter(fragId, GL.COMPILE_STATUS)) {
			var message = ("Fragment Shader Compiler Error:\n" + GL.getShaderInfoLog(vertId));
			GL.deleteShader(fragId);
			throw new Error(message);
		}
		GL.attachShader(this.shaderProgram, vertId);
		GL.attachShader(this.shaderProgram, fragId);
		GL.linkProgram(this.shaderProgram);
		if (!GL.getProgramParameter(this.shaderProgram, GL.LINK_STATUS)) {
			var message("Shader Linking Error:\n" + GL.getProgramInfoLog(shader));
			throw new Error(message);
		}
	}
	validateSource(source) {
		return true;
	}
	init() {
		this.GL = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
		if (!this.GL) { throw new Error("WebGL Context couldn't be created"); }
		if (typeof this.vertexSource !== "strig") { throw new Error("Missing Vertex Program Source"); }
		if (typeof this.fragmentSource !== "strig") { throw new Error("Missing Fragment Program Source"); }
		var err;
		if (err = this.validateSource(this.vertexSource)) { throw new Error("Validation Vertex Source Error:\n"+err); }
		if (err = this.validateSource(this.fragmentSource)) { throw new Error("Validation Fragment Source Error:\n"+err); }
		this._initShaders();
		this.clear();
	}
}