// RNG.js
function primeFactors(n) {
  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return [...(new Set(factors))];
}

// watch Zanzlanz's video on this! https://youtu.be/XDsYPXRCXAs
var lcgModulus, lcgOffset, lcgMultiplier;
function generateLCG(modulus) {
	lcgModulus = modulus;

	var primeFactorsOfModulus = primeFactors(lcgModulus);

	// Rule 1: Choose a random offset that's co-prime with modulus
	lcgOffset = Math.floor(Math.random()*(lcgModulus-1)+1);
	for(let prime of primeFactorsOfModulus) {
		while(lcgOffset%prime == 0) lcgOffset = Math.floor(lcgOffset/prime);
	}

	// Rule 2: Create multiplier by multiplying all prime factors of modulus and adding 1
	lcgMultiplier = 1;
	for(let prime of primeFactorsOfModulus) lcgMultiplier *= prime;
	// Rule 3: (But multiplier should be a multiple of 4 if modulus is divisible by 4.)
	if(lcgModulus%4 == 0) lcgMultiplier *= 2;
	lcgMultiplier++;
}

let oldFrameCount = -1;
function genNo(lastNumber, theFrameCount) {
	if(oldFrameCount != theFrameCount) generateLCG(236196 + Math.floor((Math.random()-0.5)*50));
	oldFrameCount = theFrameCount;
	return (lastNumber * lcgMultiplier + lcgOffset) % lcgModulus;
}

// randomnessimage.js
let prevNo = 0;
function setup() {
	createCanvas(128, 128);
	background(100);

	document.getElementsByTagName("canvas")[0].style.position       = "fixed";
	document.getElementsByTagName("canvas")[0].style.imageRendering = "pixelated";

	document.getElementsByTagName("canvas")[0].style.top            =
	document.getElementsByTagName("canvas")[0].style.left           = "0px";

	document.getElementsByTagName("canvas")[0].style.width          =
	document.getElementsByTagName("canvas")[0].style.height         = "100%";
}

function draw() {
	for(let x = 0; x < width; x++)
	{
		for(let y = 0; y < height; y++)
		{
			prevNo = genNo(prevNo, frameCount);
			noStroke();
			fill(prevNo % 255);
			rect(x, y, 1, 1);
		}
	}
}
