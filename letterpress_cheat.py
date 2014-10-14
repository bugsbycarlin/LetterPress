"""
This program takes input about a letterpress board, and searches for a winning play.
"""

words = {}
word_file = open("wordlist.txt")
for line in word_file:
  words[line.strip()] = 1

you_safely_own = ""
you_own = ""
uncaptured = ""
they_own = ""
they_safely_own = ""
played_words = ""

test = False

if not test:
  you_safely_own = raw_input("What letters do you safely own? ")

  you_own = raw_input("What letters do you own? ")

  uncaptured = raw_input("What letters are left on the board? ")

  they_own = raw_input("What letters does your opponent own? ")

  they_safely_own = raw_input("What letters does your opponent safely own? ")

  played_words = raw_input("Please give me a comma separated list of already played words: ")

else:

  # this is a hard board
  # you_safely_own = "qid"
  # you_own = "udlra"
  # uncaptured = "mh"
  # they_own = "uhokr"
  # they_safely_own = "gulelffges"
  # played_words = "quellers,refuels,shrieker,leggier,faggier,fragiler,gruffier,gruffer,"
  # played_words += "gaffers,huggier,hurried,huffers,hurlers,shirked,sharked,quarks,quaffers,"
  # played_words += "flurries,furries,fiddlers,fiddles,fuddlers,slurred,rushed,ushered,hours"


  # this should give no wins
  you_safely_own = "esakteneg"
  you_own = "ecs"
  uncaptured = "jxp"
  they_own = "yutyetiwk"
  they_safely_own = "q"
  played_words = ""





played_words = played_words.split(",")
board = you_safely_own + you_own + uncaptured + they_safely_own + they_own

if len(board) != 25:
  print "Sorry, you haven't given me a complete Letterpress board!"
  exit(1)

print "Okay, calculating..."

def check_word(word):
  """Check this word against the board, and return
  [bool: winning?, word, score]
  """
  copy_word = list(word)

  copy_uncaptured = list(uncaptured)
  copy_you_safely_own = list(you_safely_own)
  copy_you_own = list(you_own)
  copy_they_safely_own = list(they_safely_own)
  copy_they_own = list(they_own)


  score = len(copy_you_own) + len(copy_you_safely_own)

  pass_through = False
  while not pass_through:
    pass_through = True
    for letter in copy_word:
      if letter in copy_uncaptured:
        copy_word.remove(letter)
        copy_uncaptured.remove(letter)
        score += 1
        pass_through = False
        break

  if len(copy_uncaptured) > 0:
    return [False, "", ""]
      
  pass_through = False
  while not pass_through:
    pass_through = True
    for letter in copy_word:
      if letter in copy_they_own:
        copy_word.remove(letter)
        copy_they_own.remove(letter)
        score += 1
        pass_through = False
        break

  unscored_letters = copy_you_safely_own + copy_you_own + copy_they_safely_own
  pass_through = False
  while not pass_through:
    pass_through = True
    if word == 'zirconoid':
      print "Pass"
      print unscored_letters
      print copy_word
    for letter in copy_word:
      if letter in unscored_letters:
        copy_word.remove(letter)
        unscored_letters.remove(letter)
        pass_through = False
        break

  if len(copy_word) == 0 and score >= 13:
    return [True, word, str(score) + "-" + str(25 - score)]
  else:
    return [False, word, str(score) + "-" + str(25 - score)]



plays = []
count = 0
for word in words:
  count += 1
  if count % 5000:
    print "On word " + str(count) + " out of " + str(len(words))
  if not word in played_words:
    item = check_word(word)
    if item[0] == True:
      plays.append(item)

if len(plays) > 0:
  print "Winning plays:"
  for play in plays:
    print play
else:
  print "No winning plays."




"""
Algorithm sketch:

for each unplayed word in the dictionary of words, see if that word is playable, calculating 
the score given by choosing the most possible opponent-owned and uncaptured words.

for a best score version: keep the best word,score pair.
for a winning play version: if the board is filled and the score is winning, keep the word/score pair.

Print the word/score pair(s).

Michelle note: it may be possible to optimize this by alphabetizing the board
in some way and then going through that instead.
"""