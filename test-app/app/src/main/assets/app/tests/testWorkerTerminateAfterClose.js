describe("Worker terminate after close", function () {
	var SETTLE_AFTER = 300;

	it("stops a worker that keeps running after it called close()", function (done) {
		var counter = new Int32Array(new SharedArrayBuffer(4));
		var worker = new Worker("./workerCloseThenSpinWorker.js");
		worker.postMessage(counter.buffer);
		var started = Date.now();

		(function waitForSpin() {
			if (Atomics.load(counter, 0) === 0) {
				if (Date.now() - started > 5000) {
					fail("the worker never started running");
					done();
					return;
				}
				setTimeout(waitForSpin, 20);
				return;
			}
			worker.terminate();
			setTimeout(function () {
				var afterTerminate = Atomics.load(counter, 0);
				setTimeout(function () {
					expect(Atomics.load(counter, 0)).toBe(afterTerminate);
					done();
				}, SETTLE_AFTER);
			}, SETTLE_AFTER);
		})();
	});
});
