const gameTbody=document.getElementsByTagName('tbody')[0];

const colSize = [9, 16, 16];
const rowSize = [9, 16, 30];
const mineSize = [10, 40, 99];

var difficulty = 0;
var gameStarted = false;
var initTarget = [];

// 2차원 배열 생성 및 초기화
var mines = [];
var revealed = [];
var flagged = [];

for(i=0; i < rowSize[difficulty]; i++) {
    var aRow = [];
    for(j=0; j < colSize[difficulty]; j++) {
        aRow.push(false);
    }
    mines.push(aRow);
}
for(i=0; i < rowSize[difficulty]; i++) {
    var aRow = [];
    for(j=0; j < colSize[difficulty]; j++) {
        aRow.push(false);
    }
    revealed.push(aRow);
}
for(i=0; i < rowSize[difficulty]; i++) {
    var aRow = [];
    for(j=0; j < colSize[difficulty]; j++) {
        aRow.push(false);
    }
    flagged.push(aRow);
}

// 브라우저 자체 우클릭 비활성화
window.oncontextmenu=function() {
    return false;
}

// 지뢰 생성
const generateMine = (initCol, initRow) => {
    for(i=0; i < mineSize[difficulty]; i++) {
        const newcol=Math.floor(Math.random() * colSize[difficulty]);
        const newrow=Math.floor(Math.random() * colSize[difficulty]);
        
        if (mines[newcol][newrow] === true)
            i--;
        else if (initCol === newcol && initRow === newrow)
            i--;
        else
            mines[newcol][newrow] = true;
    }

    console.log(mines);
}

// 클릭이벤트
const clickEvendHandler = (target) => {
    
    // 타겟 좌표 추적
    const row = target.target.cellIndex;
    const col = target.target.parentNode.rowIndex;

    if ((target.button === 0) || (target.which === 1)) {
        // 좌클릭

        // 첫 클릭시 지뢰 생성
        if(gameStarted === false) {
            gameStarted = true;
            generateMine(col, row);
            target.target.classList.add('revealed');
        } else {
            reveal(target.target, col, row);
        }
    } else if ((target.button === 2) || (target.which === 3)) {
        // 우클릭
    }
}

// 지뢰 칸 열기
const reveal = (target, col, row) => {
    if (mines[col][row] === true) {
        console.log('game over');
    } else if (revealed[col][row] !== true) {
        target.classList.add('revealed');
    }
}

// 지뢰 칸 깃발
const flag = (col, row) => {

}

// 9*9 버튼(버튼대신 td) 생성
for(i=0; i < rowSize[difficulty]; i++) {
    const tr=document.createElement('tr');
    for(j=0; j < colSize[difficulty]; j++) {
        const td=document.createElement('td');
        td.addEventListener('mousedown', clickEvendHandler)
        tr.appendChild(td);
    }
    gameTbody.appendChild(tr);
}