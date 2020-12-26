const currentWindowWidth = +window.innerWidth;
const threshold = currentWindowWidth;
const cloudWidth = 135;
const sunHeightWidth = 100;
const marginSpaceAtEachSideOfSunInPercentage = 25;
const initialLeftForSun = -50;
const initialTopForSun = -50;
let cloudCount = 0;
let perCloudWidth = 0;
let radiusInPercentage = 25;
const radius = (currentWindowWidth * radiusInPercentage) / 100;

const addClouds = (count) => {
    cloudCount = +count <= 5 ? +count : 5;
    perCloudWidth = Math.ceil(currentWindowWidth / cloudCount);
    for (let i = 0; i < count; i++) {
        $('#cloud-container').append(getCloudHTML());
    }
}

const getCloudHTML = () => {
    return `<div class="cloud"><div class="cloud-circle-first"></div>
    <div class="cloud-circle-second"></div></div>`;
}

const startCloudFloating = () => {
    $('.cloud').each(function (index, cloud) {
        leftValue = generateRandomInt(index * perCloudWidth, ((index + 1) * perCloudWidth) - cloudWidth);
        $(this).css('left', `${+leftValue}px`);
    });
    startCloudAnimation();
};

const startCloudAnimation = () => {
    setInterval(function () {
        $('.cloud').each(function () {
            let currentLeft = $(this).css('left');
            let currentLeftInNumber = PXValueToNumber(currentLeft);
            if (currentLeftInNumber > threshold) {
                $(this).css('left', '-350px');
            } else {
                $(this).animate({ 'left': '+=8px' }, 80);
            }
        });
    }, 80);
}



const setMorningScene = () => {
    $('.morning-back').css({ 'opacity': 1 });
    $('.evening-back').css({ 'opacity': 0 });
    $('.afternoon-back').css({ 'opacity': 0 });
    $('#sun').css({ 'left': `calc(100% - ${sunHeightWidth / 2}px)`, 'top': `calc(100% - ${sunHeightWidth / 2}px)` });
}

const setAfternoonScene = () => {
    $('.morning-back').css({ 'opacity': 0 });
    $('.evening-back').css({ 'opacity': 0 });
    $('.afternoon-back').css({ 'opacity': 1 });
    $('#sun').css({ 'left': `calc(50% - ${sunHeightWidth / 2}px)`, 'top': `${getTopValueOfSun(radius + 'px')}px` });
}

const setEveningScene = () => {
    $('.morning-back').css({ 'opacity': 0 });
    $('.evening-back').css({ 'opacity': 1 });
    $('.afternoon-back').css({ 'opacity': 0 });
    $('#sun').css({ 'left': `0`, 'top': `calc(100% - ${sunHeightWidth}px)` });
}

// const applyHeightWidthToSun = () => {
//     $('#sun').css({'height': `${sunHeightWidth}px`,'width': `${sunHeightWidth}px`});
// }

const generateRandomInt = (start, end) => {
    return Math.ceil((Math.random() * (end - start)) + start);
}

const PXValueToNumber = (pxValue) => {
    return +pxValue.split('px')[0];
}


const enableDrag = (element) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let elmnt = element[0];
    element.on('mousedown', onMouseDown);
    function onMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        if (e.clientX <= (currentWindowWidth * (((2 * radiusInPercentage) + marginSpaceAtEachSideOfSunInPercentage) / 100)) && e.clientX >= (currentWindowWidth * (marginSpaceAtEachSideOfSunInPercentage / 100))) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.top = (getTopValueOfSun(elmnt.style.left)) + "px";
            const currentLeft = PXValueToNumber(elmnt.style.left);
            const containerWidth = currentWindowWidth * radiusInPercentage * 2 / 100;
            const eveningPer = 0.10;
            const morningPer = 0.10;
            const noonPer = 0.80;
            if (currentLeft >= (containerWidth * eveningPer) && currentLeft <= (containerWidth * (eveningPer + noonPer))) {
                const per80 = containerWidth * noonPer;
                const currentInnerLeft = currentLeft - (containerWidth * eveningPer);
                let opacity;
                const difference = currentInnerLeft - per80 / 2;
                if (difference > 0) {
                    opacity = 1 - (difference * 2 / per80);
                } else if (difference < 0) {
                    opacity = 1 + (difference * 2 / per80);
                } else {
                    opacity = 1;
                }
                $('.afternoon-back').css({ 'opacity': opacity });
                $('.morning-back').css({ 'opacity': 0 });
                $('.evening-back').css({ 'opacity': 0 });
            } else if (currentLeft >= (containerWidth * (eveningPer + noonPer))) {
                const per20 = containerWidth * morningPer;
                const currentInnerLeft = currentLeft - (containerWidth * (eveningPer + noonPer));
                let opacity;
                const difference = per20 - currentInnerLeft;
                if (difference != 0) {
                    opacity = difference / per20;
                } else {
                    opacity = 0;
                }
                $('.afternoon-back').css({ 'opacity': 0 });
                $('.morning-back').css({ 'opacity': opacity });
                $('.evening-back').css({ 'opacity': 0 });
            } else {
                const per20 = containerWidth * eveningPer;
                const currentInnerLeft = currentLeft;
                let opacity;
                const difference = per20 - currentInnerLeft;
                if (difference != 0) {
                    opacity = difference / per20;
                } else {
                    opacity = 0;
                }
                $('.afternoon-back').css({ 'opacity': 0 });
                $('.morning-back').css({ 'opacity': 0 });
                $('.evening-back').css({ 'opacity': opacity });
            }
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const getTopValueOfSun = (left) => {
    const x = PXValueToNumber(left);
    const y = getYCordinateOfCircle(x);
    return calculateInnerHeightFromY(y);
}

const getYCordinateOfCircle = (x) => {
    // debugger
    const center = getCenterPoint();
    x = x + (sunHeightWidth / 2) + (marginSpaceAtEachSideOfSunInPercentage * currentWindowWidth / 100) - center.x;
    return Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2)) + center.y;
}

const calculateInnerHeightFromY = (y) => {
    const center = getCenterPoint();
    return (2 * center.y) - y + 50;
}

const getCenterPoint = () => {
    return { x: window.innerWidth / 2, y: (window.innerHeight * 0.5) };
}