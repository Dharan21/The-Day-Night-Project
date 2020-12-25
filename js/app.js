const currentWindowWidth = +window.innerWidth;
const threshold = currentWindowWidth;
const cloudWidth = 135;
let cloudCount = 0;
let perCloudWidth = 0;

const addClouds = (count) => {
    cloudCount = +count <= 5 ? +count : 5;
    perCloudWidth = Math.ceil(currentWindowWidth / cloudCount);
    for(let i = 0; i< count; i++) {
        $('#cloud-container').append(getCloudHTML());
    }
}

const getCloudHTML = () => {
    return `<div class="cloud"><div class="cloud-circle-first"></div>
    <div class="cloud-circle-second"></div></div>`;
}

const startCloudFloating = () => {
    $('.cloud').each(function (index, cloud) {
        leftValue = generateRandomIntBetween(index * perCloudWidth, ((index + 1) * perCloudWidth) - cloudWidth);
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

const generateRandomIntBetween = (start, end) => {
    return Math.ceil((Math.random() * (end - start)) + start);
}

const PXValueToNumber = (pxValue) => {
    return +pxValue.split('px')[0];
}
