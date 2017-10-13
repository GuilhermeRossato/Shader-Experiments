var GL;
var shaderId;
var vertexBuffer;
var indexBuffer;
var timer = 0;

function initWebGL(){
    // Get Canvas Element
    var canvas = document.getElementById("glcanvas");
    // Get A WebGL Context
    GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Test for Success
    if (!GL) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    // Set clear color to red, fully opaque
    GL.clearColor(1.0, 0.0, 0.0, 1.0);
    // Clear Screen
    GL.clear(GL.COLOR_BUFFER_BIT| GL.DEPTH_BUFFER_BIT);

    initShaderProgram();
    initBuffers();
}

function initShaderProgram(){

    //Create Program and Shaders
    shaderId = GL.createProgram();
    var vertId = GL.createShader(GL.VERTEX_SHADER);
    var fragId = GL.createShader(GL.FRAGMENT_SHADER);

    //Load Shader Source (source text are in scripts below)
    var vert = document.getElementById("vertScript").text;
    var frag = document.getElementById("fragScript").text;

    GL.shaderSource(vertId, vert);
    GL.shaderSource(fragId, frag);

    //Compile Shaders
    GL.compileShader(vertId);
    GL.compileShader(fragId);

    //Check Vertex Shader Compile Status
    if (!GL.getShaderParameter(vertId, GL.COMPILE_STATUS)) {  
        alert("Vertex Shader Compiler Error: " + GL.getShaderInfoLog(id));  
        GL.deleteShader(vertId);
        return null;  
    }

    //Check Fragment Shader Compile Status
    if (!GL.getShaderParameter(fragId, GL.COMPILE_STATUS)) {  
        alert("Fragment Shader Compiler Error: " + GL.getShaderInfoLog(id));  
        GL.deleteShader(fragId);
        return null;  
    }

    //Attach and Link Shaders
    GL.attachShader(shaderId, vertId);
    GL.attachShader(shaderId, fragId);
    GL.linkProgram(shaderId);

    //Check Shader Program Link Status
    if (!GL.getProgramParameter(shaderId, GL.LINK_STATUS)) {
      alert("Shader Linking Error: " + GL.getProgramInfoLog(shader));
    }     

}

function initBuffers(){

    //Some Vertex Data
    var vertices = new Float32Array( [
      -1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
       1.0, -1.0, 0.0
    ]);
    //Create A Buffer
    vertexBuffer = GL.createBuffer();
    //Bind it to Array Buffer
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    //Allocate Space on GPU
    GL.bufferData(GL.ARRAY_BUFFER, vertices.byteLength, GL.STATIC_DRAW);
    //Copy Data Over, passing in offset
    GL.bufferSubData(GL.ARRAY_BUFFER, 0, vertices );

    //Some Index Data
    var indices = new Uint16Array([ 0,1,3,2 ]);
    //Create A Buffer
    indexBuffer = GL.createBuffer();
    //Bind it to Element Array Buffer
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    //Allocate Space on GPU
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices.byteLength, GL.STATIC_DRAW);
    //Copy Data Over, passing in offset
    GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, indices );

}

//ANIMATION FUNCTION (to be passed a callback)  see also http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = ( function() {
   
    //Find best option given current browser
    return  window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame ||  
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame ||
    
    // if none of the above, use non-native timeout method
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  
  } ) (); 

function animationLoop(){
    // feedback loop requests new frame
    requestAnimFrame( animationLoop );
    // render function is defined below
    render(); 
}

function render(){
    timer+=.1;

    //Bind Shader
    GL.useProgram(shaderId);   
    //Update uniform variable on shader
    var uID = GL.getUniformLocation(shaderId, "uTime");
    GL.uniform1f(uID, timer);
    //Enable Position Attribute
    var attId = GL.getAttribLocation(shaderId, "position");
    GL.enableVertexAttribArray(attId);
    //Bind Vertex Buffer
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    //Point to Attribute (loc, size, datatype, normalize, stride, offset)
    GL.vertexAttribPointer( attId, 3, GL.FLOAT, false, 0, 0);
    //Bind Index Buffer
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    //Draw!      --( mode, number_of_elements, data type, offset )
    GL.drawElements(GL.TRIANGLE_STRIP, 4, GL.UNSIGNED_SHORT, 0);
}

function start(){
    initWebGL();
    animationLoop();
}
