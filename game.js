const gameTbody=document.getElementsByTagName('tbody')[0];

const colSize = [9, 16, 16];
const rowSize = [9, 16, 30];
const mineSize = [10, 40, 99];
const fontColor = ['rgba(0, 0, 0, 0)', '#0097ff', '#238700', '#ff3f00', '#52009e', '#9e0063', '#005457', '#4a000e', '#4a4a49']

var difficulty = 0;
var gameStarted = false;
var initTarget = [];
var time = 0;
var remainingMines = mineSize[difficulty];
var remainingCells = colSize[difficulty] * rowSize[difficulty];
var modalbuttons = [];

// 2차원 배열 생성
var mines = [];
var revealed = [];
var flagged = [];

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

// 시작 화면
const init = () => {
    chooseDifficulty();
    gameInit();
}

const gameInit = () => {
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

    // 9*9 버튼(버튼대신 td) 생성
    const appcont = document.getElementsByClassName("appContainer")[0];
    if (difficulty == 0) {
        appcont.style.width = '500px';
        appcont.style.height = '500px';
    } else if (difficulty == 1) {
        appcont.style.width = '770px';
        appcont.style.height = '770px';
    }

    for(i=0; i < rowSize[difficulty]; i++) {
        const tr=document.createElement('tr');
        for(j=0; j < colSize[difficulty]; j++) {
            const td=document.createElement('td');
            td.style.width = `47px`
            td.style.height = `47px`
            td.style.padding = '0px'
            td.addEventListener('click', clickEvendHandler)
            tr.appendChild(td);
        }
        gameTbody.appendChild(tr);
    }
}

const chooseDifficulty = () => {
    const div = document.getElementById('modal');

    const h = document.createElement('h2');
    h.innerText = 'Choose Difficulty';

    const diffContainer = document.createElement('div');
    const easy = document.createElement('button');
    const normal = document.createElement('button');
    const hard = document.createElement('button');

    diffbuttonText = ['easy', 'normal', 'hard'];
    for (let i = 0; i < 3; i++) {
        const diffbutton = document.createElement('button');
        diffbutton.style.marginBottom = '3px';
        diffbutton.innerText = diffbuttonText[i];
        diffbutton.classList.add('sub');
        diffbutton.style.fontWeight = '600';
        diffbutton.style.fontSize = '1.1rem';
        diffbutton.addEventListener('click', function () {diffClickHandler(this)});
        diffContainer.append(diffbutton);
        modalbuttons.push(diffbutton);
    }
    
    diffContainer.style.display = 'flex';
    diffContainer.style.flexDirection = 'column';

    const button = document.createElement('button');
    button.classList.add('main');
    button.innerText = 'Play !';
    button.addEventListener('click', function () {diffClickHandler(this)});

    div.append(h);
    div.append(diffContainer);
    div.append(button);
}

const diffClickHandler = (target) => {
    if (target.innerText === 'easy')
        difficulty = 0;
    else if (target.innerText === 'normal')
        difficulty = 1;
    else if (target.innerText === 'hard')
        difficulty = 2;
    else
        modalClose();

    for (let i of modalbuttons) {
        i.style.backgroundColor = '#eee';
        i.style.color = '#bd9377';
    }
    target.style.backgroundColor = '#bd9377';
    target.style.color = '#eee';
}

const modalClose = () => {
    const modal = document.getElementById('modalBack');
    modal.innerHTML = '';
    modal.id = '';

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
}

// 지뢰 생성
const generateMine = (initCol, initRow) => {
    for(i=0; i < mineSize[difficulty]; i++) {
        let newcol=Math.floor(Math.random() * (colSize[difficulty] - 3));
        let newrow=Math.floor(Math.random() * (rowSize[difficulty] - 3));

        // [initCol - 1, initRow - 1] 혹은 이보다 우하단에 좌표가 생성되면 +3 해주기
        if (newcol >= initCol - 1)
            newcol += 3;
        if (newrow >= initRow - 1)
            newrow += 3;
        
        if (mines[newcol][newrow] === true) // 이미 생성된 좌표 
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
        remainingCells--;

        if (mines[col][row] === true) {
            // 지뢰 칸을 엶
            target.style.backgroundImage = 'url("./src/bomb-solid.svg")'
            target.style.backgroundRepeat = 'no-repeat';
            setRemainingMines(false);
            gameOver(false);
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
    target.classList.toggle('flagged');
    flagged[col][row] ? setRemainingMines(false) : setRemainingMines(true);
}

const setRemainingMines = (TrueisPlus) => {
    remainingMines += TrueisPlus ? 1 : -1;
    document.getElementById('remaining').innerText = remainingMines;
}

// 게임 오버
const gameOver = (clear) => {

    const sect = document.getElementsByTagName('section')[0];

    // 승리
    if (clear) {

    } else { // 패배
        clearInterval(timer);
        setTimeout(() => {
            for(let i = 0; i < colSize[difficulty]; i++) {
                for(let j = 0; j < rowSize[difficulty]; j++) {
                    const target = document.getElementById('tablebody').childNodes[i].childNodes[j];
                    if (!revealed[i][j]) {
                        target.style.transition = 'background-color ease 1s';
                        target.style.backgroundColor = '#ddd';
                    }
                    reveal(target, i, j);
                }
            }
            sect.style.visibility = 'visible';
            sect.style.opacity = '100%';
        }, 1500);
    }
}

