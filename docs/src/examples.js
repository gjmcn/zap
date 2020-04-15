module.exports = new Map([
[
'',
''
], [
  'html - inputs',
`draw = [
  s = + (colors :0 :value)','(range :value)'%,'(colors :1 :value)')';
  panels :0 $style 'background' (+ 'linear-gradient(to right,'s);
  panels :1 $style 'background' (+ 'radial-gradient('s)];

colors = @ '#ff0000' '#00ff00' $encode 'input'
  $attr 'type' 'color'
  $attr 'value' [a]
  $on 'input' draw;

range = $input
  $attr 'type' 'range'
  $style 'display' 'block'
  $style 'width' '250px'
  $on 'input' draw;

panels = 2 $div  
  $style 'width' '250px'
  $style 'height' '250px';

\\draw;

colors |concat range panels
  $style 'margin' '10px 10px 0 0'
  $into ($fragment);`
], [
  'html - quiz',
`buttonStyle = [a
  $style 'text-align' 'center'
  $style 'margin' '2px'
  $style 'padding' '5px 0'
  $style 'border' '1px solid gray'
  $style 'cursor' 'pointer'];

question isCorrect @= 2 $h1
  $style 'display' 'inline-block'
  $style 'margin-left' '30px';
  
(grid = $div)
  $insert (1 >> 41 10 $encode 'div')
    $style 'display' 'flex'
    $insertEach [
      a >> (a + 9) $encode 'div'
        $text [a]
        $style 'flex' '1 1 0'
        \\buttonStyle
        $on 'click' [
          isCorrect $text (this $text $number == answer ? '😄' '😞')]];

newQuestion = $div
  $text 'New Question'
  \\buttonStyle
  $on 'click' [
    x y @= 1 8 $randomInt 2;
    question $text (+ x' × 'y);
    answer \\= x * y;
    isCorrect $text '😕'];

answer = null;
newQuestion |click;
@ question isCorrect grid newQuestion
  $into ($fragment);`
], [
  'svg - tile map',
`// Median house price by borough (2015, London DataStore)
data = 'https://gist.githubusercontent.com/gjmcn/5b1b472d28d49a1d02f4c80515313967/raw/66547019d51748cfb68118398dcc49fe2141329c/london-2015-tile-data.json'
  \\fetch $await |json $await;

viz = $svg
  $attr 'width' 600 
  $attr 'height' 600
  $attr 'font-size' '0.17px'
  $attr 'font-family' 'sans-serif';
  
g = viz $insert ($g)
  $attr 'transform' 'translate(0,450) scale(75)';  
  
g $insert (data $encodeSVG 'rect')
  $attr 'x' [a :xTile]
  $attr 'y' [a :yTile $neg]
  $attr 'width' 0.97
  $attr 'height' 0.97
  $attr 'fill' 'red'
  $attr 'opacity' [a :HousePrice - 2e5 / 1e6];
  
g $insert (data $encodeSVG 'text')
  $text [a :Borough |slice 0 7]
  $attr 'x' [a :xTile + 0.05] 
  $attr 'y' [a :yTile $neg + 0.2];

viz;`
],  [
  'canvas - bubbles',
`// these can be changed
width   = 400;
height  = 500;
n       = 100;
speed   = ~4;
grow    = 0.4;
burst   = 0.05;
frames  = 400;

// array of bubble objects
bubbles = 0 >>> width n $map [xi -> #
  x xi
  y (height - ($random * height / 10))
  r 1
  color (+ 'rgba('($randomInt 0 200 3 |join)',0.7)')];

// canvas and context
canvas ctx @= # ::width ::height $sketch;
canvas $style 'background' '#eef';

// draw loop
draw = [
  ctx |clearRect 0 0 width height;
  bubbles $each [b ->
    $random < burst ?
      (b :y height :r 1)
      (b +:y speed +:r grow);
    ctx 
      :fillStyle (b :color)
      <|beginPath
      <|arc (b :x) (b :y) (b :r) 0 7
      <|fill];
  (frames -= 1) ? (window |requestAnimationFrame draw)];

\\draw;
canvas;`  
], [
'canvas - snow',
`// based on: https://p5js.org/examples/simulate-snowflakes.html

// these can be changed
width = 400;
height = 600;
minSize = 1;
maxSize = 2;
angularSpeed = 0.004;
n = 500;
frames = 400;

// array for each flake property
y = $random 0 height n;
s = $random minSize maxSize n;            
t = $random 0 (Math :PI * 2) n;          // initial angle
r = $random 0 (width / 2 ^ 2) n $sqrt;   // radius of spiral

// canvas and context
canvas ctx @= # ::width ::height $sketch;
canvas $style 'background' 'black';
ctx :fillStyle '#fff';

// draw loop
draw = [
  ctx |clearRect 0 0 width height;
  y \\= s \`^ 1.1 \`+\` y \`% height;
  y $each [yi i ->
    theta = angularSpeed * frames + (t $at i);
    xi = theta $sin * (r $at i) + (width / 2) % width;
    ctx 
      <|beginPath
      <|arc xi yi (s $at i) 0 7
      <|fill];
  (frames -= 1) ? (window |requestAnimationFrame draw)];

\\draw;
canvas;`
], [
  'data analysis',
  `iris = 'https://raw.githubusercontent.com/vega/vega/master/docs/data/iris.json'
  \\fetch $await |json $await;

// petal length > 6
iris $filter [a :petalLength > 6];

// order by sepal length
iris $order [a :sepalLength - (b :sepalLength)];

// count by species
iris $groupCount [a :species];

// mean petal width by species
iris $group [a :species] [a $mean [a :petalWidth]];

// comment later code to print an earlier result`
], [
  'classification',
`// rerun to resample data; the following can be changed:
nLabeled = 200;
nTest = 100;
k = 3;
dist = [a :x - (b :x) ^ 2 + (a :y - (b :y) ^ 2)];
  
// k-nearest-neighbor classifier
knn = [data testPoint -> data
  $map [a \\dist testPoint]    // distances to test point 
  $orderIndex                 // indices of sorted dists
  |slice 0 k                  // top k
  $map [data $at a 'class']   // corresponding labels
  $groupCount [a]             // frequency count (a map)
  $max [a :1] :0];            // most frequent label

// random data in unit square
labeled = 1 >> nLabeled $map [#
  x ($random)
  y ($random)
    \\[a :class (a :x ^ 3 + 0.2 > (a :y) $number)]];
test = 1 >> nTest $map [#
  x ($random)
  y ($random)
    \\[a :predicted (labeled \\knn a)]];
boundary = 0 >>> 1 100 $map [#
  x a
  y (a ^ 3 + 0.2 <> 1)];

// Vega-Lite plot
vegaEmbed = 'vega-embed@6.5.2' \\require $await;
encode = [#
  x (# field 'x' type 'quantitative')
  y (# field 'y' type 'quantitative')];
$div <\\vegaEmbed (#
  width 400
  height 400
  view (# fill '#e5f2fc' stroke false)
  config (# axis (# grid false domain false))
  layer (@
    (#
      mark 'area'
      data (# values boundary)
      encoding (\\encode :color (# value '#fcf1e5')))
    (#
      mark 'circle'
      data (# values labeled)
      encoding (\\encode :color (# field 'class' type 'nominal')))
    (#
      mark 'point'
      data (# values test)
      encoding (\\encode
        :color (# field 'predicted' type 'nominal')
        :shape (# field 'predicted' type 'nominal')))))
`
], [
  'winner',
`// choose a winner or a loser

list = $ol
  $style 'margin' '20px 0 0 10px';

add = $button
  $text '+'
  $on 'click' [
    list $insert ($li)
      $style 'font' '34px/60px sans-serif'
      $text '😐'];
          
remove = $button
  $text '-'
  $on 'click' [list :children :length > 2 ? (list :lastChild $remove)];
  
winLose = $button
  $text '😄'
  $on 'click' [this $text (this $text == '😄' ? '😭' '😄')];
  
start = $button
  $text 'Start'
  $on 'click' {
    buttons $attr 'disabled' true;
    players = list $pick 'li';
    n = players :length;
    shift = $randomInt 0 n;
    $awaitEach {_ index generator ->
      index ^ 2 + 50 $ms $await;
      players
        $text '😐'
        $style 'opacity' '0.5';
      players :(shift + index % n)
        $text (winLose $text)
        $style 'opacity' '1';
      index == 25 ? (generator |return)};
    players :(shift + 25 % n) $insert ($span $text '◂');
    buttons $removeAttr 'disabled'};
   
buttons = @ add remove winLose start
  $style 'font-size' '18px'
  $style 'padding' '5px 24px'
  $style 'margin' '5px';
  
add <|click <|click <|click;
buttons |concat list $into ($fragment);
`
], [
  'd3',
`// based on: https://observablehq.com/@d3/bar-chart

d3 = 'd3@5.12.0' \\require $await;

data = d3 |csv 
  'https://gist.githubusercontent.com/mbostock/81aa27912ad9b1ed577016797a780b2c/raw/3a807eb0cbb0f5904053ac2f9edf765e2f87a2f5/alphabet.csv'
  [# name (a :letter) value (a :frequency $number)] $await
    |sort [b :value - (a :value)];
    
width = 700;
height = 500;
margin = # top 20 right 0 bottom 30 left 40;    
    
x = d3 |scaleBand
    |domain (data |map [a :name])
    |range (@ (margin :left) (width - (margin :right)))
    |padding 0.1;
    
y = d3 |scaleLinear
    |domain (@ 0 (d3 |max data [a :value])) |nice
    |range (@ (height - (margin :bottom)) (margin :top));
    
xAxis = [a
    |attr 'transform' (+ 'translate(0,'(height - (margin :bottom))')')
    <\\(d3 |axisBottom x |tickSizeOuter 0)];

yAxis = [a
    |attr 'transform' (+ 'translate('(margin :left)',0)')
    <\\(d3 |axisLeft y)
    <\\[a |select '.domain' |remove]];
    
svg = d3 |create 'svg'
    |attr 'viewBox' (@ 0 0 width height);

svg |append 'g'
      |attr 'fill' 'steelblue'
    |selectAll 'rect'
    |data data
    |join 'rect'
      |attr 'x' [a :name \\x]
      |attr 'y' [a :value \\y]
      |attr 'height' [0 \\y - (a :value \\y)]
      |attr 'width' (x |bandwidth);

svg |append 'g'
    \\xAxis;

svg |append 'g'
    \\yAxis;

svg |node;

`
],
]);