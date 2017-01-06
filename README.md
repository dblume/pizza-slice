# Dividing the Last Pizza Slice

Drag left and right on the pizza slice at the [Last Pizza Slice](http://pizza.dlma.com).  Notice how the the straight horizontal cut that evenly divides the pizza moves up and down a little?  That's it. That's all this website does. We're done here.

## Origin

My middle-school-aged son asked me how one would cut such a slice of pizza, given that it was a 14-inch pizza, and it had eight slices, so each slice's angle, &theta;, was 45&deg;.

Want to solve it yourself? Stop reading, spoilers follow:

![shortcut](https://raw.githubusercontent.com/dblume/pizza-slice/master/images/pizzaslice.png)

It took me longer than it should have to figure it out. I knew it'd be possible, but my trigonometry was rusty.

![shortcut](https://raw.githubusercontent.com/dblume/pizza-slice/master/images/pizza-scribbles-small.jpg)

Of course, having eventually solved the simple problem, I began to suspect that the location of the cut would move subtly if you vary the angle of the slice. Obviously, that calls for an open-source website, and here we are.

## Even More Interesting: When &theta; &gt; 1.9 radians

Once &theta; grows to be over 1.9 radians the problem became more interesting [and I had some trouble coming to a solution](https://www.facebook.com/photo.php?fbid=10154042850971561&set=a.10150887996666561.410585.687611560&type=3&theater). The shapes of the two halves require more complicated math.

Being confronted with that challenge was irresistable.

## TODO

1. Add pinch/unpinch support.
2. Add some text and maybe guidelines.
3. Clean up the math and JavaScript.

## Is it any good?

[Yes](https://news.ycombinator.com/item?id=3067434).

## Did you time-travel or hack GitHub?

You mean because you noticed that this README document mentions the fact that the repo made the front page of Reddit days before it actually made the front page of Reddit? Let's just say I didn't hack GitHub.

## License

This software uses the [MIT license](https://github.com/dblume/pizza-slice/blob/master/LICENSE).
