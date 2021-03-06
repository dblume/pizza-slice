var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');

var width = parseInt(canvas.getAttribute("width"), 10);
var height = parseInt(canvas.getAttribute("height"), 10);
var radius = height;
var cx = width / 2;
var cy = height;

var pizza_angle = Math.PI / 4;


function toRadians(deg) {
    return deg * Math.PI / 180;
}


function getAngle (x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.atan2(dx,dy);
}


function drawSlice(angle) {
    la = -(Math.PI / 2) - (angle / 2);
    ra = la + angle;
    // Crust
    len = cy;
    ctx.moveTo(cx, cy);
    ctx.beginPath();
    ctx.arc(cx, cy, len, la, ra);
    len = cy * 91 / 100;
    ctx.arc(cx, cy, len, ra, la, true);
    ctx.closePath();

    var radgrad = ctx.createRadialGradient(cx,cy,radius - 60,cx,cy,radius);
    radgrad.addColorStop(0, '#D5A81B');
    radgrad.addColorStop(0.90, '#D5A81B');
    radgrad.addColorStop(1, '#B0821D');
    ctx.fillStyle = radgrad;
    ctx.fill();

    // Sauce
    ctx.moveTo(cx, cy);
    ctx.beginPath();
    ctx.arc(cx, cy, len, la, ra);
    len = cy * 9 / 10;
    ctx.arc(cx, cy, len, ra, la, true);
    ctx.closePath();
    ctx.fillStyle = '#BB0B04';
    ctx.fill();

    // Cheese
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, len, la, ra);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = '#F3D255';
    ctx.fill();
//    document.write("Pizza angle is " + (angle * (180/Math.PI)).toFixed(2) + ".<br \>");

    var area_of_half_slice = radius * radius * angle / 4.0;
    var l = 0;
    if (angle < 1.9024) {
        // We happen to know that the cut will intersect the straight edge of the slice.
        //            w
        //   \-----|-----/
        //    \    |90  /
        //     \  l|   /
        //      \  |  / h
        //       \ |a/
        //        \|/
        //         v
        var a = angle / 2.0;
	if (a !== 0) {
            var h = Math.sqrt(area_of_half_slice/(Math.cos(a)*Math.sin(a)));
            l = h * Math.cos(a);
	}
    } else {
        // We happen to know that the cut will intersect the crust.
	l = halve_slice_big_angle(angle, radius);

    }
    ctx.beginPath();
    ctx.moveTo(0, height - l);
    ctx.lineTo(600, height - l);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFF2DF';
    ctx.stroke();
}


function calc_area_for_big_angle(angle, fraction_in_triangles, radius) {
    /* Calculate the area for wide slices where fraction_in_triangles of angle
    is used in the triangles.
           ________________________
          /\           |           /\
         /   \         |90       /   \
        |      \      l|       /      |
        |      r \     |     / r      |
         ---.__    \   |a  /    __.---
            rx --.__ \ | /b__.-- ry     "angle" is angle from line segments rx to ry.
                    --.v.--

    If theta is minimum, 1.8956, then fraction_in_triangles will be around 0.9999655 for a good match
    If theta is maximum, pi, then fraction_in_trangles will be around 0.7352581 for a good match
    */
    var angle_in_rect = angle * fraction_in_triangles;
    var a = angle_in_rect / 2.0  // angle in each triangle part;
    var area_of_rectangle_part = Math.cos(a) * Math.sin(a) * radius * radius;
    var angle_in_sector = angle - angle_in_rect;
    var area_of_sector_parts = radius * radius * angle_in_sector / 2.0;
    return area_of_rectangle_part + area_of_sector_parts;
}


function halve_slice_big_angle(angle, radius) {
    // angle must be > 1.8956 (where length is 0.5835 * radius) and < 3.1416
    var area_of_half_slice = radius * radius * angle / 4.0;

    // if angle = 1.8956, fraction_in_triangles = 0.9999655
    // if angle = 3.1416, fraction_in_trangles = 0.7352581

    var count = 0;
    var min_angle = 1.8956;
    var min_angle_trifract = 0.9999655;
    var max_angle = Math.PI;
    var max_angle_trifract = 0.7352581;
    var fraction_in_triangles = min_angle_trifract - ((angle - min_angle) / (max_angle - min_angle) * (min_angle_trifract - max_angle_trifract));
    var done = false;

    while (!done) {
        var area = calc_area_for_big_angle(angle, fraction_in_triangles, radius);
        diff_pct = (area_of_half_slice - area) / area_of_half_slice;
        // console.log("Loop " + count + ": angle " + angle.toFixed(3) + ", tried fraction " + fraction_in_triangles.toFixed(3) + " and got difference of " + area_of_half_slice.toFixed(4) + " - " + area.toFixed(4) + " = " + (diff_pct * 100).toFixed(2) + "%");
        height_of_line = Math.cos((angle * fraction_in_triangles) / 2) * radius;  //  l
        if (Math.abs(diff_pct) < 0.001) {
            done = true;
            break;
        }
        if (area_of_half_slice > area) {
            // Need to increase area. So decrease the percentage that goes to triangles.
            // Drive fraction_in_triangles closer to the low value in max_angle_trifract.
            min_angle_trifract = fraction_in_triangles;
        } else {
            // Need to decrease the area. So increase the percentage that goes to triangles.
            // Drive fraction_in_triangles closer to the high value in min_angle_trifract.
            max_angle_trifract = fraction_in_triangles;
        }
        fraction_in_triangles = min_angle_trifract - ( min_angle_trifract - max_angle_trifract ) * 0.5;
        // Set fraction_in_triangles proportionally to where angle
        // sits between last_angle_min an
        count += 1;
        if (count > 10) {
            console.log("Ran too many loops. Exiting.");
            break;
        }
    }
    return height_of_line;
}


function redrawCanvas(angle) {
    ctx.clearRect(0, 0, width, height);
    drawSlice(angle);
}


function tryToChangeAngle(angle) {
    if (angle < 0) {
        angle = 0;
    } else if (angle > Math.PI) {
        angle = Math.PI;
    }

    pizza_angle = angle;
    // console.log("Change angle to " + pizza_angle + ".");
    redrawCanvas(pizza_angle);
}


canvas.addEventListener("wheel", function(e) {
    var evt = e || event;
    if (!evt.shiftKey && !evt.ctrlKey && !evt.metaKey && !evt.altKey) {
        tryToChangeAngle(pizza_angle + (evt.deltaY / 20 * Math.PI / 180));
        e.preventDefault();
    }
  });


// Also see http://photos.dlma.com/swipe.js
var touches = {x1:0, y1:0, x2:0, y2:0, distance:0};
var isTouching = false;
var everMultiTouch = false;

canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchmove', onTouchMove);
canvas.addEventListener('touchend', onTouchEnd);

var lastMouseX;
var isMouseDown = false;

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mouseleave', onMouseLeave);
canvas.addEventListener('mousemove', onMouseMove);


function onTouchStart(event) {
    event.preventDefault();
    if (event.targetTouches.length === 1) {
        everMultiTouch = false;
    } else {
        everMultiTouch = true;
        touches.x2 = event.touches[1].clientX;
        touches.y2 = event.touches[1].clientY;
    }
    isTouching = true;
    touches.x1 = event.touches[0].clientX;
    touches.y1 = event.touches[0].clientY;
    if (event.targetTouches.length > 1) {
        touches.distance = Math.sqrt((touches.x2 - touches.x1) * (touches.x2 - touches.x1) + (touches.y2 - touches.y1) * (touches.y2 - touches.y1));
    }
}


function onTouchEnd(event) {
    event.preventDefault();
    isTouching = false;
}


function onTouchMove(event) {
    var touchX1 = event.touches[0].clientX;
    if (event.targetTouches.length > 1) {
        if (!everMultiTouch) {
            touches.x2 = event.touches[1].clientX;
            touches.y2 = event.touches[1].clientY;
            touches.distance = Math.sqrt((touches.x2 - touches.x1) * (touches.x2 - touches.x1) + (touches.y2 - touches.y1) * (touches.y2 - touches.y1));
            everMultiTouch = true;
        }
    }
    if (isTouching) {
        if (!everMultiTouch) {
            var dx = touchX1 - touches.x1;
            // console.log("Change angle by " + dx + " to " + pizza_angle + ".");
            tryToChangeAngle(pizza_angle + (dx / 2 * Math.PI / 180));
            touches.x1 = touchX1;
            touches.y1 = event.touches[0].clientY;
        } else if (event.targetTouches.length > 1) {
            var touchY1 = event.touches[0].clientY;
            var touchX2 = event.touches[1].clientX;
            var touchY2 = event.touches[1].clientY;
            var distance = Math.sqrt((touchX2 - touchX1) * (touchX2 - touchX1) + (touchX2 - touchY1) * (touchY2 - touchY1));
            tryToChangeAngle(pizza_angle + ((distance - touches.distance) / 2 * Math.PI / 180));
            touches.x1 = touchX1;
            touches.y1 = touchY1;
            touches.x2 = touchX2;
            touches.y2 = touchY2;
            touches.distance = distance;
            
        }
        event.preventDefault();
    }
}


function onMouseDown(event) {
    // event.preventDefault();
    lastMouseX = event.clientX;
    isMouseDown = true;
}


function onMouseUp(event) {
    // event.preventDefault();
    isMouseDown = false;
}


function onMouseLeave(event) {
    if (event.clientY < canvas.offsetTop || event.clientY > canvas.offsetTop + cy) {
        // event.preventDefault();
        isMouseDown = false;
    }
}


function onMouseMove(event) {
    event.preventDefault();
    if (isMouseDown) {
        var dx = event.clientX - lastMouseX;
        // console.log("Change angle by " + dx + " to " + pizza_angle + ".");
        tryToChangeAngle(pizza_angle + (dx / 2 * Math.PI / 180));
        lastMouseX = event.clientX;
        event.preventDefault();
    }
}


drawSlice(pizza_angle);


/*
var offscreenCanvas = document.createElement('canvas');
var offscreenContext = offscreenCanvas.getContext('2d');

function draw_something(ctx) {
    ctx.save();
    ctx.fillText(ctx, ...);
    ctx.restore();
}

function repaint() {
    context.drawImage(offscreenCanvas, 0, 0);
    redrawPos(context);
}
    
function redraw() {
    redrawCanvas(offscreenContext);
    repaint();
}
*/
