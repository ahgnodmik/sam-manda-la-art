let diffY = startY - endY;

    // 스와이프 방향 감지
    if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold) {
        const direction = getSwipeDirection(diffX, diffY);
        moveToSection(direction);
    }

    startX = 0;
    startY = 0;
}

function getSwipeDirection(diffX, diffY) {
    if (Math.abs(diffX) > Math.abs(diffY)) {
        return diffX > 0 ? 'left' : 'right';
    } else {
        return diffY > 0 ? 'up' : 'down';
    }
}

function moveToSection(direction) {
    const sections = document.querySelectorAll('.mandal-section');
    let nextSection = currentSection;

    switch(direction) {
        case 'up':
            nextSection = currentSection - 3;
            break;
        case 'down':
            nextSection = currentSection + 3;
            break;
        case 'left':
            nextSection = currentSection + 1;
            break;
        case 'right':
            nextSection = currentSection - 1;
            break;
    }

    // 유효한 섹션 범위 체크
    if (nextSection >= 0 && nextSection < 9) {
        sections.forEach(section => section.style.opacity = '0.5');
        sections[nextSection].style.opacity = '1';
        currentSection = nextSection;
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    createMandalArt();
    displayRandomQuote();
    initSwipeControl();
    
    document.getElementById('saveJpg').addEventListener('click', () => saveAsImage('jpeg'));
    document.getElementById('savePng').addEventListener('click', () => saveAsImage('png'));
    document.getElementById('clearBtn').addEventListener('click', clearAll);
});