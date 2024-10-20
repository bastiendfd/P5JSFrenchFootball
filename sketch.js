let ballX, ballY, ballSize, ballSpeedX, ballSpeedY;
let scoreLeft = 0;
let scoreRight = 0;

function setup() {
  createCanvas(600, 400);

  // Position initiale et taille du ballon
  ballX = width / 2;
  ballY = height / 2;
  ballSize = 50;
  ballSpeedX = 0;
  ballSpeedY = 0;
}

function draw() {
  background(255);

  // Drapeau de la France
  drawFlag();

  // Cages de but agrandies
  drawGoals();

  // Dessiner la baguette agrandie au-dessus des étoiles
  drawBaguette();

  // Dessiner les étoiles alignées au centre
  drawStars();

  // Dessiner un ballon simple (juste un cercle)
  drawSimpleBall();

  // Afficher le score
  drawScore();

  // Mouvement du ballon
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Limiter le ballon à l'intérieur des bords du canvas
  if (ballX - ballSize / 2 < 0) {
    if (ballY > height / 2 - 100 && ballY < height / 2 + 100) {
      scoreRight++;
      resetBall();
    } else {
      ballSpeedX *= -1;
    }
  }

  if (ballX + ballSize / 2 > width) {
    if (ballY > height / 2 - 100 && ballY < height / 2 + 100) {
      scoreLeft++;
      resetBall();
    } else {
      ballSpeedX *= -1;
    }
  }

  if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > height) {
    ballSpeedY *= -1;
  }
}

// Fonction pour dessiner le drapeau de la France
function drawFlag() {
  noStroke();

  // Bleu
  fill(0, 85, 164);
  rect(0, 0, width / 3, height);

  // Blanc
  fill(255);
  rect(width / 3, 0, width / 3, height);

  // Rouge
  fill(239, 65, 53);
  rect(2 * width / 3, 0, width / 3, height);
}

// Fonction pour dessiner la baguette agrandie au-dessus des étoiles
function drawBaguette() {
  fill(255, 204, 153); // Couleur beige pour la baguette
  stroke(153, 102, 51); // Lignes brunes pour les contours
  strokeWeight(2);
  
  // Position de la baguette au-dessus des étoiles, centrée
  let baguetteWidth = 150; // Taille agrandie
  let baguetteHeight = 30; // Taille agrandie
  let centerX = width / 2;
  let baguetteY = height / 4 - 80; // Position au-dessus des étoiles
  
  // Dessiner la baguette centrée au-dessus des étoiles
  rect(centerX - baguetteWidth / 2, baguetteY, baguetteWidth, baguetteHeight, 10);
  
  // Lignes décoratives sur la baguette
  line(centerX - 60, baguetteY + 10, centerX - 45, baguetteY + 10);
  line(centerX - 30, baguetteY + 10, centerX - 15, baguetteY + 10);
  line(centerX + 15, baguetteY + 10, centerX + 30, baguetteY + 10);
  line(centerX + 45, baguetteY + 10, centerX + 60, baguetteY + 10);
}

// Fonction pour dessiner les étoiles alignées au centre
function drawStars() {
  fill(255, 223, 0);
  let starSize = 30;

  // Aligner les étoiles horizontalement au centre de la partie blanche
  let centerX = width / 2;
  let starY = height / 4; // Position des étoiles en hauteur, en dessous de la baguette

  // Première étoile (à gauche du centre)
  drawStar(centerX - starSize * 1.5, starY, starSize);

  // Deuxième étoile (à droite du centre)
  drawStar(centerX + starSize * 1.5, starY, starSize);
}

// Fonction utilitaire pour dessiner une étoile
function drawStar(x, y, radius) {
  let angle = TWO_PI / 5;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * (radius / 2);
    sy = y + sin(a + halfAngle) * (radius / 2);
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Fonction pour dessiner un ballon simple (juste un rond)
function drawSimpleBall() {
  fill(255);
  stroke(0);
  ellipse(ballX, ballY, ballSize);
}

// Fonction pour dessiner les cages de but agrandies
function drawGoals() {
  stroke(0);
  strokeWeight(3);
  noFill();

  // Cage de gauche (agrandie)
  rect(0, height / 2 - 100, 60, 200); // Agrandir la taille des buts

  // Cage de droite (agrandie)
  rect(width - 60, height / 2 - 100, 60, 200); // Agrandir la taille des buts
}

// Fonction pour dessiner le score
function drawScore() {
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text(scoreLeft, width / 4, 30);
  text(scoreRight, 3 * width / 4, 30);
}

// Réinitialiser la position du ballon après un but
function resetBall() {
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;
}

// Utiliser la souris pour contrôler le ballon
function mousePressed() {
  let dx = mouseX - ballX;
  let dy = mouseY - ballY;
  let distance = dist(mouseX, mouseY, ballX, ballY);

  // Si la souris est assez proche du ballon, on ajuste la vitesse du ballon
  if (distance < ballSize / 2) {
    ballSpeedX = dx * 0.2;
    ballSpeedY = dy * 0.2;
  }
}
