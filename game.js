const gameTbody=document.getElementsByTagName('tbody')[0];

const colSize = [9, 16, 16];
const rowSize = [9, 16, 30];
const mineSize = [10, 40, 99];
const fontColor = ['rgba(0, 0, 0, 0)', '#0097ff', '#238700', '#ff3f00', '#52009e', '#9e0063', '#005457', '#4a000e', '#4a4a49']

var difficulty = 0;
var gameStarted = false;
var initTarget = [];
var time = 0;

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

// 타이머
const timer = setInterval(() => {
    if (gameStarted) {
        time++;
        document.getElementById('time').innerText = time;
    }
}, 1000);

// 지뢰 생성
const generateMine = (initCol, initRow) => {

    const initArea = [];
    for(i = initCol - 1; i < initCol + 2; i++) {
        for(j = initRow - 1; j < initRow + 2; j++) {
            if (i >= 0 && i < colSize[difficulty]) {
                if (j >= 0 && j < rowSize[difficulty]) {
                    initArea.push([i, j]);
                }
            }
        }
    }

    for(i=0; i < mineSize[difficulty]; i++) {
        const newcol=Math.floor(Math.random() * colSize[difficulty]);
        const newrow=Math.floor(Math.random() * rowSize[difficulty]);
        
        if (mines[newcol][newrow] === true)
            i--;
        else if (initCol === newcol && initRow === newrow)
            i--;
        else {
            mines[newcol][newrow] = true;
        }
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
            timer;
            generateMine(col, row);
        }
        reveal(target.target, col, row);
    } else if ((target.button === 2) || (target.which === 3)) {
        // 우클릭
        flag(target.target, col, row);
    }
}

// 지뢰 칸 열기
const reveal = (target, col, row) => {
    // 이미 열려있지 않고 깃발 꽂히지 않은 칸만 열림
    if (target.classList.contains('revealed') === false && flagged[col][row] === false) {
        target.classList.add('revealed');
        if (mines[col][row] === true) {
            // 지뢰 칸을 엶
            target.style.backgroundImage = 'url("./src/bomb-solid.svg")'
            target.style.backgroundRepeat = 'no-repeat';

        } else if (revealed[col][row] !== true && flagged[col][row] === false) {
            // 정상적으로 열림
            let nearbomb = 0;
            if (col == 0) {                             // 상단 모서리
                if (mines[col + 1][row])                    // 8
                    nearbomb++;
                if (row == 0) {                             // 좌상단 코너 (6, 8, 9)
                    if (mines[col][row + 1])                    // 6
                        nearbomb++;
                    if (mines[col + 1][row + 1])                // 9
                        nearbomb++;
                }
                else if (row == rowSize[difficulty] - 1) {  // 우상단 코너 (4, 7, 8)
                    if (mines[col][row - 1])                    // 4
                        nearbomb++;
                    if (mines[col + 1][row - 1])                // 7
                        nearbomb++;
                }
                else {                                      // 좌측, 우측 끝이 아닌 상단 모서리 (4, 6, 7, 8, 9)
                    if (mines[col][row - 1])                    // 4
                        nearbomb++;
                    if (mines[col][row + 1])                    // 6
                        nearbomb++;
                    if (mines[col + 1][row - 1])                // 7
                        nearbomb++;
                    if (mines[col + 1][row + 1])                // 9
                        nearbomb++;
                }
            }
            else if (col == colSize[difficulty] - 1) {      // 하단 모서리
                if (mines[col - 1][row])                    // 2
                    nearbomb++;
                if (row == 0) {                             // 좌하단 코너 (2, 3, 6)
                    if (mines[col - 1][row + 1])                // 3
                        nearbomb++;
                    if (mines[col][row + 1])                    // 6
                        nearbomb++;
                }
                else if (row == rowSize[difficulty] - 1) {  // 우하단 코너 (1, 2, 4)
                    if (mines[col - 1][row - 1])                // 1
                        nearbomb++;
                    if (mines[col][row - 1])                    // 4
                        nearbomb++;
                }
                else {                                      // 좌측, 우측 끝이 아닌 하단 모서리 (1, 2, 3, 4, 6)
                    if (mines[col - 1][row - 1])                // 1
                        nearbomb++;
                    if (mines[col - 1][row + 1])                // 3
                        nearbomb++;
                    if (mines[col][row - 1])                    // 4
                        nearbomb++;
                    if (mines[col][row + 1])                    // 6
                        nearbomb++;
                }
            }
            else {                                      // 상단 끝도, 하단 끝도 아닌 셀들
                if (mines[col - 1][row])                    // 2
                    nearbomb++;
                if (mines[col + 1][row])                    // 8
                    nearbomb++;
                if (row == 0) {                             // 상단, 하단 끝이 아닌 좌측 모서리 (2, 3, 6, 8, 9)
                    if (mines[col - 1][row + 1])                 // 3
                        nearbomb++;
                    if (mines[col][row + 1])                     // 6
                        nearbomb++;
                    if (mines[col + 1][row + 1])                 // 9
                        nearbomb++;
                } else if (row == rowSize[difficulty] - 1) {// 상단, 하단 끝이 아닌 우측 모서리 (1, 2, 4, 7, 8)
                    if (mines[col - 1][row - 1])                // 1
                        nearbomb++;
                    if (mines[col][row - 1])                    // 4
                        nearbomb++;
                    if (mines[col + 1][row - 1])                // 7
                        nearbomb++;
                } else {                                    // 어느 모서리도 아닌 중간 셀 (1, 2, 3, 4, 6, 7, 8, 9)
                    for (let i = col - 1; i <= col + 1; i++)
                        for (let j = row - 1; j <= row + 1; j += 2)
                            if (!(i === col && j === row) && mines[i][j])
                                nearbomb++;
                }
            }
            
            target.innerText = nearbomb;
            target.style.fontSize = '1.5rem';
            target.style.fontWeight = '900';
            target.style.textAlign = 'center';
            target.style.color = fontColor[nearbomb];

            if (nearbomb === 0) {
                for (let i = col - 1; i <= col + 1; i++) {
                    for (let j = row - 1; j <= row + 1; j++) {
                        if (i < 0 || i >= colSize[difficulty] || j < 0 || j >= rowSize[difficulty])
                            continue;
                        const table = document.getElementById('tablebody').childNodes[i];
                        reveal(table.childNodes[j], i, j);
                    }
                }
            }
        }
    }
}

// 지뢰 칸 깃발
const flag = (target, col, row) => {
    flagged[col][row] = !flagged[col][row];
    target.classList.toggle('flagged')
}

// 9*9 버튼(버튼대신 td) 생성
const appcont = document.getElementsByClassName("appContainer")[0];
if (difficulty == 0)
    appcont.style.width = '500px';
    appcont.style.height = '500px';

for(i=0; i < rowSize[difficulty]; i++) {
    const tr=document.createElement('tr');
    for(j=0; j < colSize[difficulty]; j++) {
        const td=document.createElement('td');
        td.style.width = `47px`
        td.style.height = `47px`
        td.style.padding = '0px'
        td.addEventListener('mousedown', clickEvendHandler)
        tr.appendChild(td);
    }
    gameTbody.appendChild(tr);
}