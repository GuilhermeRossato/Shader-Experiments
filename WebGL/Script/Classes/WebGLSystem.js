class WebGLSystem {
	constructor(config={}) {
		if (!(config.canvas instanceof HTMLCanvasElement)) {
			throw new ParameterError("WebGLSystem must receive a valid canvas element in its configuration parameter");
		}
		this.canvas = config.canvas;
		if (config.vertex) {
			[config.vertex, config.vertex.text, config.vertex.innerText].any((text)=>(typeof text === "string" && (this.setVertexSource(text) || true)));
		}
		if (config.frag) {
			[config.frag, config.frag.text, config.frag.innerText].any((text)=>(typeof text === "string" && (this.setFragSource(text) || true)));
		}
	}
	clear(r=0, g=0, b=0, a=1) {
		this.GL.clearColor(r, g, b, a);
		this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
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
			var message = ("Shader Linking Error:\n" + GL.getProgramInfoLog(shader));
			throw new Error(message);
		}
	}
	checkUnclosedTags(source) {
		var line = 0
		  , j = 0
		  , stack = []
		  , c = 'a'
		  , char_array = source.split('\n').map(line=>line.split(''))
		  , pairs = [['(', ')'], ['[', ']'], ['{', '}']]
		  , last = "Undefined Error";
		for (line = char_array.length - 1; line >= 0; line--) {
			for (j = char_array[line].length - 1; j >= 0; j--) {
				c = char_array[line][j];
				if (pairs.some(pair=>{
					if (c === pair[1]) {
						stack.push([pairs[0], line]);
					} else if (c === pair[0]) {
						if ((stack.length > 0) && (c !== stack.pop()[0][1])) {
							last = `${((stack.length == 0)?"Unopened":"Unclosed")} "${pair[1]}" on line ${line}`;
							return true;
						}
					}
					return false;
				}
				)) {
					return new Error(last);
				}
			}
		}
		if (stack.length > 0) {
			return new Error(`Unopened ${stack[0][0][0]} on line ${stack[0][1]}`);
		}
		return false;
	}
	validateSource(source) {
		var closedTags = this.checkUnclosedTags(source);
		if (closedTags) {
			return closedTags;
		}
		return false;
	}
	getUniformLocations() {
		
	}
	init() {
		this.GL = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
		if (!this.GL) {
			throw new Error("WebGL Context couldn't be created");
		}
		if (typeof this.vertexSource !== "string") {
			throw new Error("Missing Vertex Program Source");
		}
		if (typeof this.fragmentSource !== "string") {
			throw new Error("Missing Fragment Program Source");
		}
		var err;
		if (err = this.validateSource(this.vertexSource)) {
			throw new Error("Validation Vertex Source Error:\n" + err);
		}
		if (err = this.validateSource(this.fragmentSource)) {
			throw new Error("Validation Fragment Source Error:\n" + err);
		}
		this._initShaders();
		this.getUniformLocations();
		this.clear();
		this.uTime_uniform = this.GL.getUniformLocation(this.shaderProgram, "uTime");
		this.position_attrib = this.GL.getAttribLocation(this.shaderProgram, "position");
	}
	resetTime(x) {
		this.startTime = x;
	}
	updateTime() {
    	this.GL.uniform1f(this.uTime_uniform, this.startTime-performance.now());
	}
	render() {
		this.GL.useProgram(this.shaderProgram);
		this.updateTime();
		this.GL.enableVertexAttribArray(this.position_attrib);
	}
}
