module.exports = function(onInitEventStreaming, onStreamingClose) {
	return (function(req, res) {
		// init SSE
		///////////////////////////////////////////////////////////////////////
		//send headers for event-stream connection
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		// add a sseSend() method to the result object
		res.sseSend = function(data, event) {
			if (event) res.write("event: " + event.toString() + "\n");
			res.write("data: " + JSON.stringify(data) + "\n\n");
		}
		res.write('\n');
		///////////////////////////////////////////////////////////////////////
		
		// initialize event streaming
		///////////////////////////////////////////////////////////////////////
		var v;
		if (typeof onInitEventStreaming === 'function') v = onInitEventStreaming(req, res);
		///////////////////////////////////////////////////////////////////////
		
		// The 'close' event is fired when a user closes their browser window.
		req.on("close", function() {
			if (typeof onStreamingClose === 'function') onStreamingClose(req, res, v);
		});
	});
};