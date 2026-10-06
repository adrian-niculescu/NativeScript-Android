// close() lets the running callback finish, so this one never returns unless
// terminate() interrupts it.
onmessage = function (event) {
	var counter = new Int32Array(event.data);
	close();
	for (;;) {
		Atomics.add(counter, 0, 1);
	}
};
