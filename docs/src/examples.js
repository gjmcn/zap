module.exports = new Map([
[
'',
''
], [
'data analysis',
`iris = 'data/iris.json' \\fetch await ~json await

// iris with max petal length
iris max 'petalLength'

// petal length > 6
iris filter [a,petalLength > 6]

// order by sepal length
iris order 'asc' 'sepalLength'

// count by species
iris groupCount 'species'

// mean petal width by species
iris group 'species' [a mean 'petalWidth']

// petal length, petal width correlation
iris correlation 'petalLength' 'petalWidth'

// petal length, petal width correlation by species
iris group 'species' [a correlation 'petalLength' 'petalWidth']

// comment later code to print an earlier result`
], [
'vega-lite plot',
`vegaEmbed = \\require 'vega-embed@6.14' await
  
$div <\\vegaEmbed
    #
    | repeat
        @ 
        | 'Horsepower'
        | 'Miles_per_Gallon'
        | 'Acceleration'
        | 'Displacement'
    | columns 2
    | spec
        #
        | data (# url 'data/cars.json')
        | mark 'bar'
        | encoding
            # 
            | x
                #
                | field (# repeat 'repeat')
                | 'bin' true
                | type 'quantitative'
            | y
                #
                | aggregate 'count'
                | type 'quantitative'
            | color
                #
                | field 'Origin'
                | type 'nominal'`  
],[
'svg - tile map',
`// Median house price by borough (2015, London DataStore)
data = 'data/london-2015.json'
| \\fetch await ~json await

viz = $svg
| attr 'width' 600 
| attr 'height' 600
| attr 'font-size' '0.17px'
| attr 'font-family' 'sans-serif'
  
g = viz insert ($g)
| attr 'transform' 'translate(0,450) scale(75)'  
  
g insert (data encodeSVG 'rect')
| attr 'x' [a,xTile]
| attr 'y' [a,yTile -]
| attr 'width' 0.97
| attr 'height' 0.97
| attr 'fill' 'red'
| attr 'opacity' [a,HousePrice - 2e5 / 1e6]
  
g insert (data encodeSVG 'text')
| text [a,Borough ~slice 0 7]
| attr 'x' [a,xTile + 0.05] 
| attr 'y' [a,yTile - + 0.2]

viz`
], [
'classification',
`// rerun to resample data; the following can be changed:
nTrain = 200
nTest = 100
k = 3
dist = [a,x - b,x ^ 2 + (a,y - b,y ^ 2)]

// k-nearest-neighbor classifier
knn = fun data testPoint
    data
    | map d (d \\dist testPoint)  // distances to test point 
    | orderIndex                 // indices of sorted dists
    | ~slice 0 k                 // top k
    | map i (data;i,label)       // corresponding labels
    | groupCount                 // frequency count (a map)
    | max 1 : 0                  // most frequent label

// training data
training = 1 to nTrain map
    #
    | x (random)
    | y (random) 
    | as pt (pt chg 'label' (pt,x ^ 3 + 0.2 > pt,y number))

// test data
test = 1 to nTest map
    #
    | x (random)
    | y (random)
    | as pt (pt chg 'predicted' (training \\knn pt))

// decision boundary
boundary = 0 1 linSpace 100 map x
    #
    | x x
    | y (x ^ 3 + 0.2 <> 1)

// Vega-Lite plot
vegaEmbed = 'vega-embed@6.14' \\require await
enc = fun
    #
    | x (# field 'x' type 'quantitative')
    | y (# field 'y' type 'quantitative')
$div <\\vegaEmbed
    #
    | width 400
    | height 400
    | view (# fill '#e5f2fc' stroke false)
    | config (# axis (# grid false domain false))
    | layer
        @
            #
            | mark 'area'
            | data (# values boundary)
            | encoding (\\enc chg 'color' (# value '#fcf1e5'))
        |
            #
            | mark 'circle'
            | data (# values training)
            | encoding (\\enc chg 'color' (# field 'label' type 'nominal'))
        |
            #
            | mark 'point'
            | data (# values test)
            | encoding
                \\enc
                | chg 'color' (# field 'predicted' type 'nominal')
                | chg 'shape' (# field 'predicted' type 'nominal')
`
], [
'html - quiz',
`answer = null

question isCorrect @= 2 $h2
| style 'display' 'inline-block'
| style 'padding-left' '40px'

newQuestion = $button
| text 'New question'
| on 'click'
    fun
        x y @= 1 11 randomInt 2
        question text (+ x' × 'y)
        answer \\= x * y
        isCorrect text '😕'

grid = $div
| style 'display' 'grid'
| style 'grid-template-columns' 'repeat(10, 1fr)'
| style 'gap' '3px'

grid
| insert (1 to 100 encode 'button')
| text [a]
| style 'padding' '5px 0'
| on 'click' [isCorrect text (this text number == answer ? '😄' '😞')]

newQuestion ~click
@ newQuestion question isCorrect grid into (fragment)`
], [
'html - lucky dip',
`// fill in choices (optional), choose a winner or loser

list = $div
| style 'margin' '20px 0 0 10px'

addPlayer = $button
| text '+'
| on 'click'
    fun
        list insert ($div)
        | html
            + "<span style='font: 34px/60px serif; padding: 10px'>😐</span>
               <input type='text' style='width: 200px; font-size: 24px'
                        placeholder='"list,children,length"'>"
            
removePlayer = $button
| text '-'
| on 'click' [list,children,length > 2 ? (list,lastChild remove)]

winLose = $button
| text '😄'
| on 'click' [this text (this text == '😄' ? '😭' '😄')]

start = $button
| text 'Start'
| on 'click'
    asyncFun
        buttons attr 'disabled' true
        players = list selectAll 'span'
        n = players,length
        shift = randomInt 0 n
        26 asyncDo i
            i ^ 2 + 50 period await
            players
            | text '😐'
            | style 'opacity' '0.5'
            players : (i + shift % n)
            | text (winLose text)
            | style 'opacity' '1'
        | await
        players : (25 + shift % n) text (winLose text + '▸')
        buttons removeAttr 'disabled'
    
buttons = @ addPlayer removePlayer winLose start
| style 'font-size' '18px'
| style 'padding' '5px 24px'
| style 'margin' '5px'

addPlayer <~click <~click
array buttons list into (fragment)
`
],[
'canvas - snow',
`// based on: https://p5js.org/examples/simulate-snowflakes.html
    
// these can be changed
width = 400
height = 600
minSize = 1
maxSize = 2
angularSpeed = 0.004
n = 500
frames = 400

// array for each flake property
y = random 0 height n
s = random minSize maxSize n            
t = random 0 (Math,PI * 2) n         // initial angle
r = random 0 (width / 2 ^ 2) n sqrt  // radius of spiral

// canvas and context
canvas ctx @= # attach width height sketch
canvas style 'background' 'black'
ctx,fillStyle = '#fff'

// draw loop
draw = fun
    ctx ~clearRect 0 0 width height
    y \\= s \`^ 1.1 \`+\` y \`% height
    y each yi i
        theta = angularSpeed * frames + t;i
        xi = theta sin * r;i + (width / 2) % width
        ctx ~beginPath
        ctx ~arc xi yi s;i 0 7
        ctx ~fill
    if (frames -= 1)
        window ~requestAnimationFrame draw

\\draw
canvas`
],[
'canvas - bubbles',
`// these can be changed
width   = 400
height  = 500
n       = 100
speed   = -4
grow    = 0.4
burst   = 0.05
frames  = 400

// array of bubble objects
bubbles = 0 width linSpace n map xi
    #
    | x xi
    | y (height - (random * height / 10))
    | r 1
    | color (+ 'rgba('(randomInt 0 200 3 ~join)',0.7)')

// canvas and context
canvas ctx @= # attach width height sketch
canvas style 'border' '1px solid gray'

// draw loop
draw = fun
    ctx ~clearRect 0 0 width height
    bubbles each b
        if (random < burst)
            b,y = height
            b,r = 1
        | else
            b,y += speed
            b,r += grow
        ctx,fillStyle = b,color
        ctx ~beginPath
        ctx ~arc b,x b,y b,r 0 7
        ctx ~fill
    if (frames -= 1)
        window ~requestAnimationFrame draw

\\draw
canvas`  
], [
'p5 - kaleidoscope',
`// draw on the canvas
// (based on: https://p5js.org/examples/interaction-kaleidoscope.html)

// ==============================================================
// For now, reload the playground when finished with each drawing
// to terminate the draw loop
// ==============================================================

// this can be changed
symmetry = 6

f = fun p

    p,setup = fun
        p ~createCanvas 600 600
        p ~angleMode 'degrees'
        p ~background 230

    p,draw = fun
        mouseX mouseY pmouseX pmouseY width height #= p
        p ~translate (width / 2) (height / 2)
        if ((mouseX > 0) && (mouseX < width) &&
        |   (mouseY > 0) && (mouseY < height))
            mx = mouseX - (width / 2)
            my = mouseY - (height / 2)
            pmx = pmouseX - (width / 2)
            pmy = pmouseY - (height / 2)
            if p,mouseIsPressed
                symmetry do
                    p ~rotate (360 / symmetry)
                    p ~strokeWeight 3
                    p ~line mx my pmx pmy
                    p ~push
                    p ~scale 1 (-1)
                    p ~line mx my pmx pmy
                    p ~pop

// use p5 in instance mode     
'p5@1.1.9' \\require await new f : 'canvas'`
],
]);