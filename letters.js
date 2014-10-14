
function initialize()
{
  $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
  canvas = document.getElementById('canvas');

  document.addEventListener("mouseup", click_event, false);
  document.addEventListener("touchstart", touch_event, false);
  
  canvas.width = 1024;
  canvas.height = 768;
  var pos = findPos(canvas);
  canvas.left = pos[0];
  canvas.top = pos[1];

  gameover = false;

  makeBoard();

  calculate_ownership();

  drawBoard();

  canvas.style.visibility = 'visible';
  var loadingdiv = document.getElementById('loadingdiv');
  loadingdiv.style.visibility = 'hidden'; 
}

letters = ["a", "b", "c", "d", "e", "f",
           "g", "h", "i", "j", "k", "l",
           "m", "n", "o", "p", "q", "r",
           "s", "t", "u", "v", "w", "x",
           "y", "z"];

board = [];

gameover = false;

turn = "Blue";

LetterSprite = [];
for(var i = 0; i < 26; i++)
{
  LetterSprite[letters[i]] = new Image();
  LetterSprite[letters[i]].src = letters[i].toUpperCase() + ".png";
}

NumberSprite = [];
for(var i = 0; i < 10; i++)
{
  NumberSprite[i] = new Image();
  NumberSprite[i].src = i + ".png";
}

Blue = new Image();
Blue.src = "Blue.png";
LightBlue = new Image();
LightBlue.src = "LightBlue.png";
Pink = new Image();
Pink.src = "Pink.png";
Red = new Image();
Red.src = "Red.png";
White = new Image();
White.src = "White.png";
Gray = new Image();
Gray.src = "Gray.png";
stateColors = [Blue, LightBlue, White, Pink, Red];

Play = new Image();
Play.src = "Play.png";
Nope = new Image();
Nope.src = "Nope.png";
Repeat = new Image();
Repeat.src = "Repeat.png";
badplay = false;
repeat = false;
repeatWord = "";

RedPlayer = new Image();
RedPlayer.src = "RedPlayer.png";
RedPlayerBacking = new Image();
RedPlayerBacking.src = "RedPlayerBacking.png";
RedPlayerBacking2 = new Image();
RedPlayerBacking2.src = "RedPlayerBacking2.png";
RedWins = new Image();
RedWins.src = "RedWins.png";
BluePlayer = new Image();
BluePlayer.src = "BluePlayer.png";
BluePlayerBacking = new Image();
BluePlayerBacking.src = "BluePlayerBacking.png";
BluePlayerBacking2 = new Image();
BluePlayerBacking2.src = "BluePlayerBacking2.png";
BlueWins = new Image();
BlueWins.src = "BlueWins.png";

boardLeft = 312;
boardTop = 124;

gambit = [];
old_words = [];

gambitTop = 24;
gambitLeft = 512;

playLeft = 452;
playTop = 564;
playWidth = 120;
playHeight = 60;

oldWordsLeft = 100;
oldWordsTop = 620;

lastX = 0;
lastY = 0;

function makeBoard()
{
  vowels = 0;
  decent_letters = 0;

  for(var i = 0; i < 5; i++)
  {
    board[i] = [];
    for(var j = 0; j < 5; j++)
    {
      letter_num = Math.floor(Math.random() * 26);
      if(letter_num == 0 || letter_num == 4 || letter_num == 8 || letter_num == 14 || letter_num == 20 || letter_num == 24)
      {
        vowels += 1;
      }
      if(letter_num == 4 || letter_num == 3 || letter_num == 18 || letter_num == 17)
      {
        decent_letters += 1;
      }
      board[i][j] = [letters[letter_num], 2, 0];
    }
  }

  if(vowels < 5 || decent_letters < 3) makeBoard();
}

function drawBoard()
{
  // clear the screen
  var context = canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the main board
  for(var i = 0; i < 5; i++)
  {
    for(var j = 0; j < 5; j++)
    {
      element = board[i][j];
      letter = element[0];
      state = element[1];
      in_use = element[2];

      if(in_use % 2 == 0)
      {
        context.drawImage(stateColors[state], boardLeft + 80 * i, boardTop + 80 * j);
        context.drawImage(LetterSprite[letter], boardLeft + 80 * i, boardTop + 80 * j);
      }
      else
      {
        //context.drawImage(White, boardLeft + 80 * i, boardTop + 80 * j);
      }
    }
  }

  // draw the gambit (ie, the played letters)
  gambitLeft = 512 - (40 - gambit.length) * gambit.length;
  gambitWidth = 80 - 2 * gambit.length;
  for(var i = 0; i < gambit.length; i++)
  {
    element = gambit[i];
    context.drawImage(stateColors[element[1]], gambitLeft + gambitWidth * i, gambitTop);
    context.drawImage(LetterSprite[element[0]], gambitLeft + gambitWidth * i - gambit.length, gambitTop);
  }
  context.drawImage(Gray, gambitLeft + gambitWidth * gambit.length, gambitTop);

  // draw the play button
  if(gambit.length > 0 && !gameover)
  {
    if(badplay)
    {
      context.drawImage(Nope, playLeft, playTop);
    }
    else if(repeat)
    {
      context.drawImage(Repeat, playLeft, playTop);
    }
    else
    {
      context.drawImage(Play, playLeft, playTop);
    }
  }
  else if(gameover)
  {
    if(red_score > blue_score) context.drawImage(RedWins, playLeft - 20, playTop);
    else if(blue_score > red_score) context.drawImage(BlueWins, playLeft - 20, playTop);
  }

  // draw the players and their scores
  scoreboardTop = boardTop + 40;
  if(turn == "Blue") context.drawImage(BluePlayerBacking, boardLeft - 200, scoreboardTop);
  context.drawImage(BluePlayer, boardLeft - 200, scoreboardTop);
  ones = blue_score % 10;
  tens = (blue_score - ones) / 10;
  context.drawImage(Blue, boardLeft - 220, scoreboardTop + 160);
  context.drawImage(Blue, boardLeft - 140, scoreboardTop + 160);
  context.drawImage(NumberSprite[tens], boardLeft - 220, scoreboardTop + 160);
  context.drawImage(NumberSprite[ones], boardLeft - 140, scoreboardTop + 160);

  if(turn == "Red") context.drawImage(RedPlayerBacking, boardLeft + 480, scoreboardTop);
  context.drawImage(RedPlayer, boardLeft + 480, scoreboardTop);
  ones = red_score % 10;
  tens = (red_score - ones) / 10;
  context.drawImage(Red, boardLeft + 460, scoreboardTop + 160);
  context.drawImage(Red, boardLeft + 540, scoreboardTop + 160);
  context.drawImage(NumberSprite[tens], boardLeft + 460, scoreboardTop + 160);
  context.drawImage(NumberSprite[ones], boardLeft + 540, scoreboardTop + 160);

  // draw the old words
  owl = oldWordsLeft;
  owt = oldWordsTop;
  for(var i = 0; i < old_words.length; i++)
  {
    word = old_words[i];
    if(owl + 15 * word.length + 30 > 1000)
    {
      owl = oldWordsLeft;
      owt += 20;
    }
    for(var j = 0; j < word.length; j++)
    {
      character = word[j];
      if(word == repeatWord)
      {
        context.drawImage(Red, owl, owt, 20, 20);
        console.log("This word is repeat! " + word);
      }
      context.drawImage(LetterSprite[character], owl, owt, 20, 20);
      owl += 15;
    }
    owl += 30;
  }


  // draw last x,y click
  // ones = lastX % 10;
  // tens = Math.floor(lastX / 10.0) % 10;
  // hundreds = Math.floor(lastX / 100.0) % 10;
  // thousands = Math.floor(lastX / 1000.0) % 10;
  // context.drawImage(NumberSprite[thousands], 0, 0, 20, 20);
  // context.drawImage(NumberSprite[hundreds], 15, 0, 20, 20);
  // context.drawImage(NumberSprite[tens], 30, 0, 20, 20);
  // context.drawImage(NumberSprite[ones], 45, 0, 20, 20);
  // ones = lastY % 10;
  // tens = Math.floor(lastY / 10.0) % 10;
  // hundreds = Math.floor(lastY / 100.0) % 10;
  // thousands = Math.floor(lastY / 1000.0) % 10;
  // context.drawImage(NumberSprite[thousands], 75, 0, 20, 20);
  // context.drawImage(NumberSprite[hundreds], 90, 0, 20, 20);
  // context.drawImage(NumberSprite[tens], 105, 0, 20, 20);
  // context.drawImage(NumberSprite[ones], 120, 0, 20, 20);
}

function findPos(element)
{
  var curLeft = 0;
  var curTop = 0;
  if(element.offsetParent)
  {
    do{
      curLeft += element.offsetLeft;
      curTop += element.offsetTop;
    } while(element = element.offsetParent);
  }
  
  return [curLeft, curTop];
}

function word_is_repeat(word)
{
  for(var i = 0; i < old_words.length; i++)
  {
    old_word = old_words[i];
    if(old_word.indexOf(word) == 0)
    {
      return [true, old_word];
    }
  }

  return [false, ""];
}

function calculate_ownership()
{
  for(var i = 0; i < 5; i++)
  {
    for(var j = 0; j < 5; j++)
    {
      item = board[i][j];
      if(item[1] == 0) item[1] = 1;
      if(item[1] == 4) item[1] = 3;
    }
  }

  for(var i = 0; i < 5; i++)
  {
    for(var j = 0; j < 5; j++)
    {
      item = board[i][j];
      item_ownership = item[1];

      safe = true;
      for(var k = i - 1; k <= i + 1; k++)
      {
        for(var l = j - 1; l <= j + 1; l++)
        {
          if(k < 0 || k > 4 || l < 0 || l > 4 || ((k - i) - (l - j)) % 2 == 0)
          {
            continue;
          }
          else
          {
            item2 = board[k][l];
            item2_ownership = item2[1];
            if(((item_ownership == 0 || item_ownership == 1) && item2_ownership != 0 && item2_ownership != 1)
              || ((item_ownership == 3 || item_ownership == 4) && item2_ownership != 3 && item2_ownership != 4))
            {
              safe = false;
            }
          }
        }
      }

      if(safe)
      {
        if(item[1] == 1) item[1] = 0;
        if(item[1] == 3) item[1] = 4;
      }
    }
  }

  blue_score = 0;
  red_score = 0;
  gameover = true;
  for(var i = 0; i < 5; i++)
  {
    for(var j = 0; j < 5; j++)
    {
      item = board[i][j];
      if(item[1] == 0 || item[1] == 1) blue_score += 1;
      if(item[1] == 4 || item[1] == 3) red_score += 1;
      if(item[1] == 2) gameover = false;
    }
  } 
}

function click_event(ev)
{
  ev.preventDefault();

  var x = ev.pageX - canvas.left;
  var y = ev.pageY - canvas.top;

  do_click(x,y);
}

function touch_event(ev)
{
  console.log(ev);
  var touch = ev.touches[0];
  var x = touch.pageX - canvas.left;
  var y = touch.pageY - canvas.top;
  do_click(x,y);
}

function do_click(x,y)
{
  lastX = x;
  lastY = y;

  badplay = false;
  repeat = false;
  repeatWord = "";


  if(gameover)
  {
    return;
  }

  gambitLeft = 512 - (40 - gambit.length) * gambit.length;
  gambitWidth = 80 - 2 * gambit.length;

  if(x >= boardLeft && x <= boardLeft + 400 && y >= boardTop && y <= boardTop + 400)
  {
    row = Math.floor((x - boardLeft) / 80.0);
    col = Math.floor((y - boardTop) / 80.0);

    element = board[row][col];

    if(element[2] == 0)
    {
      element[2] += 1;
      gambit.push([element[0],element[1], row, col]);
    }
  }
  else if(x >= playLeft && x <= playLeft + playWidth && y >= playTop && y <= playTop + playHeight && gambit.length > 0)
  {
    word = "";
    for(var i = 0; i < gambit.length; i++)
    {
      element = gambit[i];
      word += element[0];
    }

    if(!(word in words))
    {
      badplay = true;
    }
    else if(word_is_repeat(word)[0])
    {
      repeat = true;
      repeatWord = word_is_repeat(word)[1];
    }
    else
    {
      for(var i = 0; i < gambit.length; i++)
      {
        item = gambit[i];
        row = item[2];
        col = item[3];
        board_item = board[row][col];
        if(turn == "Red" && board_item[1] != 0)
        {
          board_item[1] = 3;
        }
        else if(turn == "Blue" && board_item[1] != 4)
        {
          board_item[1] = 1;
        }
        board_item[2] = 0;
      }

      calculate_ownership();

      if(turn == "Blue")
      {
        turn = "Red";
      }
      else
      {
        turn = "Blue";
      }

      old_words.push(word);

      gambit = [];
    }
  }
  else if(y >= gambitTop && y <= gambitTop + 80 && x >= gambitLeft && x <= gambitLeft + gambitWidth * gambit.length)
  {
    gambit_num = Math.floor((x - gambitLeft) / gambitWidth);
    if(gambit_num < 0) gambit_num = 0;
    if(gambit_num >= gambit.length) gambit_num = gambit.length -1;

    item = gambit[gambit_num];
    row = item[2]
    col = item[3];
    board[row][col][2] = 0;

    new_gambit = [];
    for(var i = 0; i < gambit.length; i++)
    {
      if(i != gambit_num) new_gambit.push(gambit[i]);
    }
    gambit = new_gambit;
  }

  drawBoard();
}


