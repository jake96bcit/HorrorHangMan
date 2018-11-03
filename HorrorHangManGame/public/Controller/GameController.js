$.getScript("Model/Model.js", function () {

    // Get elements
    lives = document.getElementById("live");
    hint = document.getElementById("hint");
    hintText = document.getElementById("hintText");
    reset = document.getElementById("reset");
    stickman = document.getElementById("stickman");

    function alphabetGenerator() {
        myBtns = document.getElementById('btns');
        letters = document.createElement('ul');

        for (var i = 0; i < alphabet.length; i++) {
            letters.id = 'alphabet';
            list = document.createElement('button');
            list.id = 'letter';
            list.innerHTML = alphabet[i];
            btnListener();
            list.setAttribute('class', 'btn btn-primary btn-lg')
            myBtns.appendChild(letters);
            letters.appendChild(list);
        }
    }


    // Alphabet btn clicking listener
    function btnListener() {
        myScore = document.getElementById("score");
        list.onclick = function () {
            guess = this.innerHTML;
            this.setAttribute("class", "active");
            this.onclick = null;
            for (var i = 0; i < word.length; i++) {
                if (word[i] === guess) {
                    geusses[i].innerHTML = guess;
                    counter++;
                }
            }

            var j = word.indexOf(guess);
            if (j === -1) {
                lives--;
                score--;
                myScore.innerHTML = "Score: " + score;
                comments();
                drawDead();
            } else {
                comments();
                score++;
                myScore.innerHTML = "Score: " + score;
            }
        }
    }

    function drawStickman() {
        for (var i = 0; i < lives; i++) {
            $('#stickman').prepend("<img id='stickman" + i
                + "' src='../img/stickman.png' style='width=60px; height:120px'/>")
        }
    }

    function drawDead() {
        console.log(lives);
        //$('#stickman' + lives).attr('id','deadman' + lives); 
        $('#stickman' + lives).attr('src', '../img/deadman.png');

    }

    // Create Guess ul
    function result() {
        wordHolder = document.getElementById('hold');
        correct = document.createElement('ul');

        for (var i = 0; i < word.length; i++) {
            correct.setAttribute('id', 'myWord');
            guess = document.createElement('li');
            guess.setAttribute('class', 'guess');
            guess.innerHTML = " _ ";

            geusses.push(guess);
            wordHolder.appendChild(correct);
            correct.appendChild(guess);
            if (i === 0) {
                guess.setAttribute('style', 'display: inline-block; font-size: 3em;')

            } else {
                guess.setAttribute('style', 'display: inline-block; margin-left: 1em; font-size: 3em;')
            }
        }
    }

    // Show lives
    function comments() {
        if (lives < 1 && counter != word.length) {
            alert("Game Over");
        } else if (lives > 0 && counter === word.length) {
            alert("You Win");
        }
    }

    // Game Board generator
    var gameBoard = function () {
        word = words[Math.floor((Math.random() * words.length))];
        word = word.replace(/\s/g, "-");
        console.log(word);
        guesses = [];
        lives = 7;
        counter = 0;
        score = 0;
        result();
        comments();
        drawStickman();
        alphabetGenerator();
    }

    gameBoard();

    hint.onclick = function () {
        var hintIndex = words.indexOf(word);
        var hintText = document.getElementById("hintText");
        hintText.innerHTML = hints[hintIndex];
    }

    reset.onclick = function () {
        location.reload();
    }
})