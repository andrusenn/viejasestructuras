/*
Andrés Senn
*/
let overlay;
let loaded = false;
const rand = fxrand();
const seed = rand * 10000000000;
let center;
let ccolor;
let pg, pgc;

let X = 0;
let Y = 0;
let ys, xs;
let STEP = 0;
let gestureIdx = 0;
let gPos = [];
let rotf = 0;

let cutSize;
function setup() {
	overlay = document.querySelector(".overlay");
	createCanvas(2160, 2160);
	pg = createGraphics(width, height);
	pgc = createGraphics(width, height);
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);
	// noLoop();
	colorMode(HSB, 255, 255, 255, 255);
	rectMode(CENTER);
	imageMode(CENTER);
	rotf = int(random(8));
	X = random(100, 300);
	Y = random(100, 300);
	cutSize = random(30, 200);
	// Background ---------------------------
	background(255);
	overlay.style.display = "none";
	// Shadow
	setShadow(6, 6, 15, 180);
	//push();
	rotateAll(8);
	colorRect(width / 2, height / 2, width * 2, height * 2, random(255));
	setShadow(6, 6, 15, 120);

	if (random(1) < 0.5) {
		rotateAll(8);
		sliceCanvas("X");
	}
	rotateAll(8);
	sliceCanvas("Y");
	// bgRect(pgc, width / 2, height / 2, width * 2, height * 2, random(255));
	//pop();

	// Gesture
	// Artificial gesture ----------------------------
	let noff = 0;
	let ns = 0.001;
	let gdir = createVector(0, 0);
	let gvel = createVector(0, 0);
	let vpos = createVector(width / 2, height / 2);
	let eachG = 0;
	for (let x = 0; x < width; x += 60) {
		for (let y = 0; y < height; y += 60) {
			let n = noise(x * ns, y * ns, noff);
			let dil = 20;
			gdir.x = cos(n * TAU * dil) * 10;
			gdir.y = sin(n * TAU * dil) * 10;
			gvel.add(gdir);
			gvel.mult(0.96);
			vpos.add(gvel);
			noff += 1;
			if (vpos.x < 0 || vpos.x > width || vpos.y < 0 || vpos.y > height) {
				vpos.set(random(width), random(height));
			}
			if (eachG % 2 == 0) {
				gPos.push([vpos.x, vpos.y]);
			}
			eachG++;
		}
	}
	pg.background(255);
	for (let i = 0; i < gPos.length; i++) {
		pg.noStroke();
		pg.fill(0);
		pg.circle(gPos[i][0], gPos[i][1], 50);
	}
	xs = random(20, 60);
	ys = random(20, 60);
}
function draw() {
	//
	//
	for (let i = 0; i < 30; i++) {
		if (STEP == 1) {
			push();
			if (X < width * 0.6) {
				translate(width / 2, height / 2);
				rotate(rotf * (TAU / 8));
				translate(-width / 2, -height / 2);
				setShadow(20, 20, 10, 60);
				// let d = dist(X, Y, width / 2, height / 2);
				// let cutSize = random(50, 100);
				let candraw = () => true; //brightness(pg.get(X, Y)) > 50;
				if (candraw()) {
					let nz = map(sin(Y * 0.01), -1, 1, 0.001, 0.002);
					const n = noise(X * nz, Y * nz, X * 0.001);
					const dx = cos(n * TAU) * 100;
					const dy = sin(n * TAU) * 100;
					let img = get(
						X,
						Y,
						random(10, cutSize),
						random(10, cutSize),
					);
					noFill();
					stroke(0, 150);
					strokeWeight(2);
					image(img, X + dx + img.width / 2, Y + dy + img.height / 2);
					if (i % 30 == 0) {
						noisemix(
							X + dx + img.width / 2,
							Y + dy + img.height / 2,
							img.width,
							img.height,
						);
						strokeWeight(1);
						stroke(random(255));
						line(
							X + dx + img.width / 2,
							Y + dy + img.height / 2,
							X + dx + img.width / 2 + random(200, 800),
							Y + dy + img.height / 2,
						);
					}
					rect(
						X + dx + img.width / 2,
						Y + dy + img.height / 2,
						img.width,
						img.height,
					);
				}
			}
			pop();
		}

		if (STEP == 0) {
			// Shadow
			setShadow(4, 4, 15, 120);
			let pos = gPos[gestureIdx % gPos.length];
			for (let i = 0; i < gPos.length; i++) {
				if (pos !== gPos[i]) {
					let d = dist(pos[0], pos[1], gPos[i][0], gPos[i][1]);
					if (d > 50 && d < 180) {
						stroke(random(255), random(255));
						let lc = random(255);
						let fi = drawingContext.createLinearGradient(
							pos[0],
							pos[1],
							gPos[i][0],
							gPos[i][1],
						);
						fi.addColorStop(0, color(0, 0));
						fi.addColorStop(0.1, color(0, 100));
						fi.addColorStop(0.5, color(lc, random(0, 100), 255));
						fi.addColorStop(0.9, color(lc, random(0, 100), 255));
						fi.addColorStop(1, color(0, 100));
						drawingContext.strokeStyle = fi;
						line(pos[0], pos[1], gPos[i][0], gPos[i][1]);
					}
				}
			}
			circle(pos[0], pos[1], random(2, 5));
			gestureIdx++;
		}
		// *****************
		// Big loop --------
		if (Y < height - random(100, 500)) {
			Y += ys;
		} else {
			Y = random(100, 400);
			X += xs;
		}
		if (X > width - random(100, 500)) {
			X = random(100, 500);
			STEP++;
			gestureIdx = 0;

			console.log("fin", STEP);
			//image(pg, width / 2, height / 2);
		}
	}
	// ******************
	if (STEP == 2) {
		noLoop();
		if (random(1) < 0.5) {
			setShadow(0, 0, 20, 200);
			translate(random(-1000, 1000), random(-1000, 1000));
			rotateAll(8);
			sliceCanvas("Y");
		}
	}
}

function sliceCanvas(_slice) {
	push();
	noSmooth();
	const num = int(random(2, 20));
	let imgs = [];

	for (let s = 0; s < num; s++) {
		let img;
		if (_slice == "X") {
			img = get((s * width) / num, 0, width / num, height);
		} else {
			// Y default
			img = get(0, (s * height) / num, width, height / num);
		}
		imgs.push(img);
	}
	let rimg = imgs.sort((a, b) => 0.5 - random(1));
	for (let i = 0; i < num; i++) {
		noFill();
		if (_slice == "X") {
			let rpos = 0;
			translate(0, random(-200, 200));
			image(rimg[i], int(width / num) * i + rpos, 0);
		} else {
			let rpos = 0;
			translate(random(-200, 200), 0);
			image(rimg[i], 0, int(height / num) * i + rpos);
		}
	}
	pop();
}
function rotateAll(r = 8) {
	translate(width / 2, height / 2);
	rotate((int(random(r)) * TAU) / r);
	translate(-width / 2, -height / 2 + random(-100, 100));
}
function noisemix(_x, _y, _w, _h) {
	push();
	let s = 20;
	let c = random(0, 255);
	let w = _w;
	let h = _h;
	for (let x = _x - w / 2; x < _x + w / 2; x += s) {
		for (let y = _y - h / 2; y < _y + h / 2; y += s) {
			s = random(2, 5);
			c = 255;
			if (random(1) > 0.5) {
				c = 0;
			}
			noStroke();
			fill(c);
			rect(x, y, s + random(1, 50), s);
		}
	}
	pop();
}
function setShadow(x = 3, y = 3, b = 15, a = 200) {
	// Shadow
	drawingContext.shadowOffsetX = x;
	drawingContext.shadowOffsetY = y;
	drawingContext.shadowBlur = b;
	drawingContext.shadowColor = color(0, a);
}
function colorRect(cx, cy, w, h, c) {
	fill(0);
	noStroke();
	let fi = drawingContext.createLinearGradient(
		cx - w / 2,
		cy - h / 2,
		cx + w / 2,
		cy + h / 2,
	);
	let c1 = color(c, 60, 255);
	let c2 = color(c, 60, 20);
	if (random(1) < 0.2) {
		c1 = color(c, 0, 255);
		c2 = color(c, 0, 0);
	}
	fi.addColorStop(0, color(0));
	fi.addColorStop(0.25, color(0));
	fi.addColorStop(0.5, c1);
	fi.addColorStop(0.75, c2);
	fi.addColorStop(1, color(0, 100));
	drawingContext.fillStyle = fi;
	rect(width / 2, height / 2, w, h);
}

function bgRect(p, cx, cy, w, h, c) {
	p.push();
	p.fill(0);
	p.noStroke();
	p.background(255);
	let ctx = p.elt.getContext("2d");
	let fi = ctx.createLinearGradient(
		cx - w / 2,
		cy - h / 2,
		cx + w / 2,
		cy + h / 2,
	);
	fi.addColorStop(0, color(c, 100, 255), 40);
	fi.addColorStop(0.25, color(c, 100, 255), 40);
	fi.addColorStop(0.5, color(c, 100, 255), 40);
	fi.addColorStop(0.75, color(0, 0, 0), 40);
	fi.addColorStop(1, color(0, 100));
	ctx.fillStyle = fi;
	p.rect(width / 2, height / 2, w, h);
	p.pop();
}
function keyReleased() {
	switch (key) {
		case "1":
			pixelDensity(1);
			break;
		case "2":
			pixelDensity(2);
			break;
		case "3":
			pixelDensity(3);
			break;
		case "4":
			pixelDensity(4);
			break;
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
}
function grabImage() {
	let date =
		year() +
		"" +
		month() +
		"" +
		day() +
		"" +
		hour() +
		"" +
		minute() +
		"" +
		second() +
		"" +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas("__" + date);
}
