var width, height, header, canvas, ctx, triangles, target, animateHeader = true;
var colors = ['231, 76, 60', '82, 179, 217', '135, 211, 124', '249, 191, 59', '189, 195, 199'];

function init() {
    width = $(window).width();
    height = $(window).height();

    target = {x: 0, y: height};

    header = $('#header-two');
    header.height(height + '%');

    canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');

    triangles = [];
    for(var x = 0; x < 480; x++) {
        addTriangle(x*10);
    }
}

//Triangle object
function Triangle() {
    var _this = this;

    // constructor
    _this.coords = [{},{},{}];
    _this.pos = {};
    init();

    function init() {
        _this.pos.x = width*0.5;
        _this.pos.y = height*0.5-20;
        _this.coords[0].x = -10+Math.random()*40;
        _this.coords[0].y = -10+Math.random()*40;
        _this.coords[1].x = -10+Math.random()*40;
        _this.coords[1].y = -10+Math.random()*40;
        _this.coords[2].x = -10+Math.random()*40;
        _this.coords[2].y = -10+Math.random()*40;
        _this.scale = 0.1+Math.random()*0.3;
        _this.color = colors[Math.floor(Math.random()*colors.length)];
        setTimeout(function() { _this.alpha = 0.8; }, 10);
    }

    this.draw = function() {
        if(_this.alpha >= 0.005) _this.alpha -= 0.005;
        else _this.alpha = 0;
        ctx.beginPath();
        ctx.moveTo(_this.coords[0].x+_this.pos.x, _this.coords[0].y+_this.pos.y);
        ctx.lineTo(_this.coords[1].x+_this.pos.x, _this.coords[1].y+_this.pos.y);
        ctx.lineTo(_this.coords[2].x+_this.pos.x, _this.coords[2].y+_this.pos.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba('+_this.color+','+ _this.alpha+')';
        ctx.fill();
    };

    this.init = init;
}

function addTriangle(delay) {
    setTimeout(function() {
        var t = new Triangle();
        triangles.push(t);
        tweenTriangle(t);
    }, delay);
}

function tweenTriangle(tri) {
    var t = Math.random()*(2*Math.PI);
    var x = (200+Math.random()*100)*Math.cos(t) + width*0.5;
    var y = (200+Math.random()*100)*Math.sin(t) + height*0.5-20;
    var time = 4+3*Math.random();

    TweenLite.to(tri.pos, time, {x: x,
        y: y, ease:Circ.easeOut,
        onComplete: function() {
            tri.init();
            tweenTriangle(tri);
        }});
}

function addListeners() {
    $(window).scroll(scrollCheck);
    $(window).resize(resize);
}

function scrollCheck() {
    if($('body').scrollTop > height)
        animateHeader = false;
    else animateHeader = true;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    header.height(height+'px');
    canvas.width = width;
    canvas.height = height;
}

function animate() {
    if(animateHeader) {
        ctx.clearRect(0,0,width,height);
        for(var i in triangles) {
            triangles[i].draw();
        }
    }
    requestAnimationFrame(animate);
}

$(function() {
    init();
    addListeners();
    animate();
});