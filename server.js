var http = require('http');
var fs = require('fs');


var SHADER_DIR = './glsl/';


function gatherShaders() {
	var shaders = {};
	var dirs = fs.readdirSync(SHADER_DIR);
	for(var i=0; i<dirs.length; i++) {
		var dir = dirs[i];
		shaders[dir] = {
			vertex: fs.readFileSync(SHADER_DIR + dir + '/vertex', 'utf8'),
			fragment: fs.readFileSync(SHADER_DIR + dir + '/fragment', 'utf8'),
		};
	}
	return shaders;
};


http.createServer(function(req, resp) {
	if(req.url == '/shaders.json' && req.method == 'GET') {
		resp.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		});
		var responseBody = JSON.stringify(gatherShaders());
		resp.end(responseBody);
		console.log('Sent: ' + responseBody);
	}
	else {
		resp.writeHead(404);
		resp.end();
	}
}).listen(8000);