var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z'];

var hint;              // Hint
var word;              // Word
var guess;             // Geuss
var geusses = [];      // Stored geusses
var guessChances = 0;      // Guess chances
var counter = 0;           // Count correct geusses
var slot;               // Number of slots in the word 
var win;
var lose;
var correct = 0;
var live = 0;
var letterGuesses = [];
var score;

// Elements
var lives;
var hintText;
var reset;
var stickman;

var words = ["kick", "head", "ronaldo", "striker", "defender", "goalkepper",
    "messi", "penalty", "freekick", "red"];
var hints = ["How the soccer player make the ball move?", "What part of the body that we use to play ball in the air?",
        "Who the best player of Juventus at he moment?", "How do you call the soccerplayer that play near the opponent;s goal?",
    "Who play at the back of the fiel to protect our goalie?", "The only person can use his/her hand to play soccer",
    "Who is the best player of Barcelona?", "What is the most dangeroues freekick?", "What is the thing you got after the opponent team make a foul",
    "Which card colour will send you off the field?"];

