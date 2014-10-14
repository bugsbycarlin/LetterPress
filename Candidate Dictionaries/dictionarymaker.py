
file = open("sowpods.txt")
words = {}
for line in file:
  word = line.strip()
  words[word] = 1
wordlist = words.keys()
output = open("dict2.js","w")
output.write("var words = new Object();\n")
for word in wordlist:
  output.write("words[\"" + word + "\"] = 1;\n")
output.close()
