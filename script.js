// 스와이프 처리를 위한 변수들
let startX = 0;
let startY = 0;
let currentSection = 4; // 중앙 섹션
const threshold = 50; // 스와이프 감지 임계값

function createMandalArt() {
    const container = document.getElementById('mandalContainer');
    
    for (let i = 0; i < 9; i++) {
        const section = document.createElement('div');
        section.className = 'mandal-section';
        if (i === 4) section.classList.add('center-section');
        
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'mandal-cell';
            
            const span = document.createElement('span');
            span.className = 'text-container';
            span.contentEditable = true;
            span.spellcheck = false;
            
            // 중앙 섹션의 각 셀에 인덱스 설정
            if (i === 4) {
                span.dataset.centerIndex = j.toString();
                span.addEventListener('input', function() {
                    const targetSpan = document.querySelector(`span[data-section-index="${j}"]`);
                    if (targetSpan) {
                        targetSpan.textContent = this.textContent;
                        adjustFontSize(targetSpan);
                    }
                    adjustFontSize(this);
                });
            }

            // 각 섹션의 중앙 셀에 인덱스 설정
            if (j === 4 && i !== 4) {
                span.dataset.sectionIndex = i.toString();
                span.contentEditable = false;
            }
            
            // 입력 제한 처리
            span.addEventListener('input', function(e) {
                if (this.innerText.length > 20) {
                    this.innerText = this.innerText.slice(0, 20);
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(this);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                adjustFontSize(this);
            });

            // 엔터 키 방지
            span.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });

            // 붙여넣기 처리
            span.addEventListener('paste', function(e) {
                e.preventDefault();
                let text = (e.clipboardData || window.clipboardData).getData('text');
                text = text.slice(0, 20);
                text = text.replace(/\n/g, '');
                document.execCommand('insertText', false, text);
                adjustFontSize(this);
            });

            cell.appendChild(span);
            section.appendChild(cell);
        }
        
        container.appendChild(section);
    }
}

function adjustFontSize(element) {
    const cell = element.parentElement;
    const maxSize = 16;
    const minSize = 8;
    
    element.style.fontSize = maxSize + 'px';
    
    while (
        (element.scrollHeight > cell.clientHeight ||
        element.scrollWidth > cell.clientWidth) &&
        parseInt(element.style.fontSize) > minSize
    ) {
        const currentSize = parseInt(element.style.fontSize);
        element.style.fontSize = (currentSize - 1) + 'px';
    }
}

function displayRandomQuote() {
    const quotes = [
        { text: "모든 성취의 시작점은 갈망이다.", author: "나폴레온 힐" },
        { text: "작은 습관이 큰 변화를 만든다.", author: "로버트 콜리어" },
        { text: "미래는 지금 준비하는 사람의 것이다.", author: "말콤 X" },
        { text: "목표를 높게 세워라.", author: "보그 밀러" },
        { text: "행동이 변화의 시작이다.", author: "마하트마 간디" }
    ];
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    const quoteContainer = document.querySelector('.quote-container');
    quoteContainer.innerHTML = `<span class="quote-text">${quote.text}</span> <span class="quote-author">- ${quote.author}</span>`;
}

async function saveAsImage(format) {
    try {
        const captureArea = document.getElementById('capture-area');
        const canvas = await html2canvas(captureArea, {
            backgroundColor: 'white',
            scale: 2,
            useCORS: true,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `mandal-art.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
        link.click();
    } catch (error) {
        console.error('Error saving image:', error);
        alert('이미지 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
}

function clearAll() {
    if (confirm('Are you sure you want to clear all entries?')) {
        const spans = document.querySelectorAll('.text-container');
        spans.forEach(span => {
            span.textContent = '';
            span.style.fontSize = '16px';
        });
        displayRandomQuote();
    }
}

// 모바일 스와이프 기능
function initSwipeControl() {
    const container = document.querySelector('.mandal-container');
    
    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, false);
    container.addEventListener('touchend', handleTouchEnd, false);
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!startX || !startY) return;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!startX || !startY) return;

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    let diffX = startX - endX;
    let diffY = startY - endY;

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