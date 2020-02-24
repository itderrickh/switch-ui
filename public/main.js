var dropX;
var curXPos;
var curDown = false;
var container = document.getElementsByClassName("scroll-container");
var gameText = document.getElementById("game-cart-text");
var uiLocation = "";
var areaLocation = 0;
var gameLocation = 0;
var maxGame = 12;
var maxArea = 4;


var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};


var tabMap = {
    "profile": { "left": "", "right": "", "up": "", "down": "gameX" },
    "gameX": { "left": "gameX", "right": "gameX", "up": "profile", "down": "areaX" },
    "areaX": { "left": "areaX", "right": "areaX", "up": "gameX", "down": "" },
};

var applyDirectionEffect = function (direction) {
    //Apply effect to uiLocation
    var time = 1001;
    var hoverLast = document.querySelectorAll('.hover')[0];

    if (hoverLast && direction === 'left') {
        hoverLast.classList.add('hover-left');
        setTimeout(function() { hoverLast.classList.remove('hover-left')}, time);
    }

    if (hoverLast && direction === 'right') {
        hoverLast.classList.add('hover-right');
        setTimeout(function() { hoverLast.classList.remove('hover-right')}, time);
    }

    if (hoverLast && direction === 'down') {
        hoverLast.classList.add('hover-down');
        setTimeout(function() { hoverLast.classList.remove('hover-down')}, time);
    }

    if (hoverLast && direction === 'up') {
        hoverLast.classList.add('hover-up');
        setTimeout(function() { hoverLast.classList.remove('hover-up')}, time);
    }
}

var applyGameMovingEffect = function (elem, curPos, dest) {
    var pos = curPos;
    var id = setInterval(frame, 1);

    var dir = 1;
    if (pos > dest) { dir = -1; }
    function frame() {
        if ((dir === 1 && pos >= dest) || (dir === -1 && pos < dest)) {
            clearInterval(id);
        } else {
            pos += (dir * 6);
            elem.style.marginLeft = pos + 'px';
        }
    }
}

var changeHover = function (destination, direction) {
    var element = document.querySelectorAll('[data-tab="' + destination + '"]')[0];
    var hoverLast = document.querySelectorAll('.hover')[0];

    if (!isInViewport(element) && destination.indexOf('game') > -1) {
        var gameScroll = document.getElementById('game-scroll');
        var width = parseInt(gameScroll.clientWidth, 10);
        var curLeft = parseInt(gameScroll.style.marginLeft, 10) || 0;

        var total = curLeft;
        if (direction === 'left') {
            total += 300;
        } else if (direction === 'right') {
            total -= 300;
        }

        if (Math.abs(total) > width - 1000) { total = (total / Math.abs(total)) * (width - 1000); }
        if (total > 0) { total = 0; }

        applyGameMovingEffect(gameScroll, curLeft, total);
    }

    if (element) {
        element.classList.add('hover');
        gameText.textContent = element.dataset.itemName;
    }

    if (hoverLast) {
        hoverLast.classList.remove('hover');
    }
};

var getNav = function (direction) {
    if (uiLocation === '') {
        uiLocation = "profile";
        changeHover(uiLocation, direction);
        return;
    }

    //convert game and area to gameX and areaX
    if (uiLocation.indexOf('game') > -1) { uiLocation = 'gameX'; }
    if (uiLocation.indexOf('area') > -1) { uiLocation = 'areaX'; }

    var dest = tabMap[uiLocation][direction];

    if (dest === '') {
        //Apply move effect in direction
        return applyDirectionEffect(direction);
    }

    if (dest === 'gameX' && direction === 'left') {
        if (gameLocation > 0) {
            gameLocation--;
        } else {
            //Apply moving effect left
            return applyDirectionEffect(direction);
        }
    }

    if (dest === 'gameX' && direction === 'right') {
        if (gameLocation < maxGame) {
            gameLocation++;
        } else {
            //Apply moving effect right
            return applyDirectionEffect(direction);
        }
    }

    if (dest === 'areaX' && direction === 'left') {
        if (areaLocation > 0) {
            areaLocation--;
        } else {
            //Apply moving effect left
            return applyDirectionEffect(direction);
        }
    }

    if (dest === 'areaX' && direction === 'right') {
        if (areaLocation < maxArea) {
            areaLocation++;
        } else {
            //Apply moving effect right
            return applyDirectionEffect(direction);
        }
    }

    if (dest === 'gameX') { uiLocation = 'game' + gameLocation; }
    if (dest === 'areaX') { uiLocation = 'area' + areaLocation; }

    if (dest === 'profile') { uiLocation = 'profile'; }

    changeHover(uiLocation, direction);
}


for (var i = 0; i < container.length; i++) {
    var elements = container[i].getElementsByClassName("items");
    for (var j = 0; j < elements.length; j++) {
        elements[j].addEventListener('mouseover', function (e) {
            gameText.textContent = e.currentTarget.dataset.itemName;
        });

        elements[j].addEventListener('mouseout', function (e) {
            gameText.textContent = "";
        });
    }

    container[i].addEventListener('mousedown', function (e) {
        curDown = true;
        curXPos = e.pageX;
    });

    container[i].addEventListener('mousemove', function (e) {
        if (curDown) {
            var width = parseInt(e.currentTarget.clientWidth, 10);
            if (isNaN(dropX)) { dropX = 0; }

            var total = (dropX + (e.pageX - curXPos));

            if (Math.abs(total) > width - 1000) { total = (total / Math.abs(total)) * (width - 1000); }
            if (total > 0) { total = 0; }

            e.currentTarget.style.marginLeft = total + "px"
        }
    });

    container[i].addEventListener('mouseup', function (e) {
        curDown = false;
        //curXPos = e.pageX;
        dropX = parseInt(e.currentTarget.style.marginLeft, 10);
    });
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) { getNav('left'); }
    if (e.keyCode === 39) { getNav('right'); }
    if (e.keyCode === 38) { getNav('up'); }
    if (e.keyCode === 40) { getNav('down'); }
});