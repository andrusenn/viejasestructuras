/*

Viejas estructuras

Viejas estructuras aparecen recursivamente, todo se rompe y vuelve a nacer.

Fxhash project
Andrés Senn - 07/2022

*/
let overlay;

let X = 0;
let Y = 0;
let ys, xs;
let STEP = 0;
let gestureIdx = 0;
let gPos = [];
let rotf = 0;
let linesat;
let linecolor;
let cutSize;
function setup() {
	// Pixel density param
	let uparams = getURLParams();
	if (uparams.pd) {
		pixelDensity(int(uparams.pd));
	} else {
		pixelDensity(1);
	}

	// Seed
	const seed = int(fxrand() * 1000000000000);

	overlay = document.querySelector(".overlay");
	let cv = createCanvas(2160, 2160);
	cv.id("ve");
	cv.class("ve");

	// Seeds
	randomSeed(seed);
	noiseSeed(seed);

	// Color mode
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

	// Rotate
	rotateAll(8);

	// Bg
	colorRect(width / 2, height / 2, width * 2, height * 2, random(255));

	// Slice 0 | 1
	setShadow(8, 8, 20, 200);
	if (random() < 0.5) {
		rotateAll(8);
		sliceCanvas("X");
	}
	rotateAll(8);
	sliceCanvas("Y");

	// Lines colors
	linesat = random(0, 60);
	linecolor = random(255);

	// Gesture ----------------------------
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

	// x & y step
	xs = random(40, 60);
	ys = random(40, 60);

	// Title
	document.title = `Viejas estructuras | Andr\u00e9s Senn | 2022`;

	// Console
	console.log(
		`%cViejas estructuras | Andr\u00e9s Senn | Projet: https://github.com/andrusenn/viejasestructuras`,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function draw() {
	for (let i = 0; i < 10; i++) {
		// Draw gesture
		if (STEP == 0) {
			setShadow(6, 6, 15, 100);
			let pos = gPos[gestureIdx % gPos.length];
			for (let i = 0; i < gPos.length; i++) {
				if (pos !== gPos[i]) {
					let d = dist(pos[0], pos[1], gPos[i][0], gPos[i][1]);
					if (d > 50 && d < 180) {
						stroke(255);
						let fi = drawingContext.createLinearGradient(
							pos[0],
							pos[1],
							gPos[i][0],
							gPos[i][1],
						);
						fi.addColorStop(0, color(0, 0));
						fi.addColorStop(0.1, color(0, 100));
						let linebright = map(d, 50, 180, 100, 255);
						fi.addColorStop(
							0.5,
							color(linecolor, linesat, linebright),
						);
						fi.addColorStop(
							0.9,
							color(linecolor, linesat, linebright),
						);
						fi.addColorStop(1, color(0, 100));
						drawingContext.strokeStyle = fi;
						line(pos[0], pos[1], gPos[i][0], gPos[i][1]);
					}
				}
			}
			circle(pos[0], pos[1], random(2, 5));
			gestureIdx++;

			// On complete -> next step
			if (gestureIdx > gPos.length) {
				STEP++;
			}
		}
		// Cut
		if (STEP == 1) {
			push();
			if (X < width * random(0.1, 0.5)) {
				translate(width / 2, height / 2);
				rotate(rotf * (TAU / 8));
				translate(-width / 2, -height / 2);
				setShadow(20, 20, 10, 60);
				let nz = map(sin(Y * 0.01), -1, 1, 0.001, 0.002);
				const n = noise(X * nz, Y * nz, X * 0.001);
				const dx = cos(n * TAU) * 100;
				const dy = sin(n * TAU) * 100;
				let img = get(X, Y, random(10, cutSize), random(10, cutSize));
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
					strokeWeight(random(1, 3));
					stroke(random(255));
					line(
						X + dx + img.width / 2 - random(200, 800),
						Y + dy + img.height / 2,
						X + dx + img.width / 2 + random(200, 800),
						Y + dy + img.height / 2,
					);
				}
				strokeWeight(1);
				rect(
					X + dx + img.width / 2,
					Y + dy + img.height / 2,
					img.width,
					img.height,
				);
			}
			pop(); // *****************
			// Big loop --------
			if (Y < height - random(100, 500)) {
				Y += ys;
			} else {
				Y = random(100, 400);
				X += xs;
			}
			if (X > width - random(100, 500)) {
				X = random(100, 500);
				// Ends -> next step
				STEP++;
			}
		}
	}
	// ******************
	// Finish
	if (STEP == 2) {
		if (random() < 0.5) {
			setShadow(0, 0, 20, 200);
			translate(random(-1000, 1000), random(-1000, 1000));
			rotateAll(8);
			setShadow(8, 8, 20, 200);
			sliceCanvas("Y");
		}
		// Preview
		if (!isFxpreview) {
			fxpreview();
		}
		noLoop();
	}
}

function sliceCanvas(_slice) {
	push();
	noSmooth();
	const num = int(random(2, 80));
	let imgs = [];

	for (let s = 0; s < num; s++) {
		let img;
		if (_slice == "X") {
			img = get((s * width) / num, 0, width / num, height);
		} else {
			img = get(0, (s * height) / num, width, height / num);
		}
		imgs.push(img);
	}
	let rimg = imgs.sort((a, b) => 0.5 - random());
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
	let s = random(2, 5);
	let c = random(0, 255);
	let w = _w;
	let h = _h;
	for (let x = _x - w / 2; x < _x + w / 2; x += s) {
		for (let y = _y - h / 2; y < _y + h / 2; y += s) {
			s = random(2, 5);
			c = 255;
			if (random() > 0.5) {
				c = 0;
			}
			noStroke();
			fill(c);
			rect(x, y, s + random(1, 20), s);
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
	let c1 = color(c, 0, 255);
	let c2 = color(c + random(-50, 50), random(255), random(255));
	if (random() < 0.2) {
		c1 = color(c, 0, 255);
		c2 = color(c, 0, 0);
	}
	fi.addColorStop(0, color(0));
	fi.addColorStop(0.5, c1);
	fi.addColorStop(0.75, c2);
	fi.addColorStop(1, color(0, 100));
	drawingContext.fillStyle = fi;
	rect(width / 2, height / 2, w, h);
}

function keyReleased() {
	if (key == "s" || key == "S") {
		grabImage();
	}
}
function doubleClicked() {
	grabImage();
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
	saveCanvas("ve_" + date);
}
