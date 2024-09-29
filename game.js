const gameTbody=document.getElementsByTagName('tbody')[0];

for(i=0; i < 9; i++) {
    gameTbody.insertAdjacentHTML('beforeend', `<tr></tr>`);
    const trs=document.getElementsByTagName('tr');
    const lastTr=trs[trs.length - 1];
    for(j=0; j < 9; j++) {
        lastTr.insertAdjacentHTML('beforeend', `<td></td>`);
    }
}