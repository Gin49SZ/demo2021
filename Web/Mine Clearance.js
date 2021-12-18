//取消右键方式
document.oncontextmenu = function(e){
    return false;
}

//改变数字颜色
function changecolor(grid,i,j){
    switch (grid[i][j].count){
        case 1:
            grid[i][j].cellEl.classList.add("one");
            break;
        case 2:
            grid[i][j].cellEl.classList.add("two");
            break;
        case 3:
            grid[i][j].cellEl.classList.add("three");
            break;
        case 4:
            grid[i][j].cellEl.classList.add("four");
            break;
        case 5:
            grid[i][j].cellEl.classList.add("five");
            break;
        case 6:
            grid[i][j].cellEl.classList.add("six");
            break;
        case 7:
            grid[i][j].cellEl.classList.add("seven");
            break;
        case 8:
            grid[i][j].cellEl.classList.add("eight");
            break;


    }
        
    
}

function renderBoard(numRows,numCols,grid){
    let boardEl = document.querySelector("#board");

    for (let i=0; i < numRows; i++){
        let trEl = document.createElement("tr");
        for (let j=0; j < numCols; j++){
            let cellEl = document.createElement("div");
            cellEl.className = "cell";

            grid[i][j].cellEl = cellEl;

            cellEl.addEventListener("click",(e)=> {
                if(gameover.js === false){
                    if (grid[i][j].count === -1){                  
                        exploded(grid,i,j,numRows,numCols);
                        gameover.js = true;
                        alert("You lost");
                        return;
                        
    
                    }else if (grid[i][j].count === 0){
                        searchClearArea(grid,i,j,numRows,numCols);
    
                    }else if (grid[i][j].count > 0){
                        grid[i][j].clear = true;
                        cellEl.classList.add("clear");
                        grid[i][j].cellEl.innerText = grid[i][j].count;
                        changecolor(grid,i,j);
                        
                        
                    }
                    checkAllClear(grid);
    
                    if (checkAllClear(grid) == true){
                        gameover.js = true;
                        alert("You win");
                    }
                }

                

                 
            });
//插旗
            cellEl.addEventListener("mousedown",(e)=>{
                if (e.button == 2 && grid[i][j].clear == false && grid[i][j].flag == false){
                    grid[i][j].cellEl.classList.add("flag");
                    sl.syls -= 1;
                    grid[i][j].flag = true;
                }else if(e.button == 2 && grid[i][j].clear == false){
                    grid[i][j].cellEl.classList.remove("flag");
                    grid[i][j].flag = false;
                    sl.syls += 1;
                }
                if (joke.joke == 0){
                    clock(sl.syls);                        
                }

            })
//双击已被展开的数字会展开附近没有被插旗的块
            cellEl.addEventListener("dblclick",(e)=>{
                if (gameover.js === false){
                    if (grid[i][j].clear == true){
                        for (let [drow,dcol] of directions ){
                            let cellRow = i + drow;
                            let cellCol = j + dcol;
                            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols){
                                continue;
                            }
                            if (grid[cellRow][cellCol].flag == false && grid[cellRow][cellCol].count !=-1 && grid[cellRow][cellCol].count != 0){
                                grid[cellRow][cellCol].clear = true;
                                grid[cellRow][cellCol].cellEl.classList.add("clear")
                                grid[cellRow][cellCol].cellEl.innerText = grid[cellRow][cellCol].count;
                                changecolor(grid,cellRow,cellCol);
                            }else if(grid[cellRow][cellCol].flag == false && grid[cellRow][cellCol].count == 0){
                                searchClearArea(grid,cellRow,cellCol,numRows,numCols);
                            }else if(grid[cellRow][cellCol].flag == false && grid[cellRow][cellCol].count == -1){
                                over.over = true;
                                exploded(grid,cellRow,cellCol,numRows,numCols)
                                gameover.js = true;
                                alert("You lost");
                                return;
                            }
    
                        }
                        checkAllClear(grid)
                        if (checkAllClear(grid) == true && over.over == false){
                            gameover.js = true;
                            alert("You win");       
                        }
    
                    } 
                }
            })

            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl); 
    }

} 

const directions = [
    [-1,-1],[-1,0], [-1,1],
    [0,-1],         [0,1],
    [1,-1], [1,0],  [1,1],
]

function initialize(numRows,numCols,numMines){
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++){
        grid[i] = new Array(numCols);
        for(let j = 0; j < numCols; j++){
            grid[i][j] = {
                clear:false,
                count:0,
                flag:false,
                look:false,
            };
        }
    }
    let mines = []
    for (let k = 0; k < numMines;k++){
        let cellnum = Math.trunc(Math.random()*numRows*numCols);
        let row = Math.trunc(cellnum / numCols);
        let col = cellnum % numCols
        grid[row][col].count = -1;
        mines.push([row,col]);
    }
    //计算有雷的周边为零的周边雷数
    for (let [row,col] of mines){
        for (let [drow,dcol] of directions ){
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols){
                continue;
            }
            if (grid[cellRow][cellCol].count === 0){
                let count = 0;
                for (let [arow,acol] of directions){
                    let bRow = cellRow + arow;
                    let bCol = cellCol + acol;
                    if (bRow < 0 || bRow >= numRows || bCol < 0 || bCol >= numCols){
                        continue;
                    }
                    if (grid[bRow][bCol].count === -1){
                        count += 1;
                    }
                }
                if (count > 0){
                    grid[cellRow][cellCol].count = count;
                }
            }
        }
    }




    return grid;
}

function searchClearArea(grid,row,col,numRows,numCols){
    for (let [drow,dcol] of directions ){
        let cellRow = row + drow;
        let cellCol = col + dcol;
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols){
            continue;
        }


        if ( !grid[cellRow][cellCol].clear){
            grid[cellRow][cellCol].clear = true;
            grid[cellRow][cellCol].cellEl.classList.add("clear")
            changecolor(grid,cellRow,cellCol);
            if (grid[cellRow][cellCol].count === 0){
                searchClearArea(grid,cellRow,cellCol,numRows,numCols);
            }else if (grid[cellRow][cellCol].count > 0){
                grid[cellRow][cellCol].cellEl.innerText = grid[cellRow][cellCol].count;
                
            }
        }
    }
}
function exploded(grid,row,col,numRows,numCols){
    grid[row][col].cellEl.classList.add("exploded")
    for (let cellRow = 0; cellRow < numRows; cellRow++){
        for(let cellCol = 0; cellCol < numCols; cellCol++){
            grid[cellRow][cellCol].clear =true;
            grid[cellRow][cellCol].cellEl.classList.add("clear");


            if (grid[cellRow][cellCol].count === -1){              
                grid[cellRow][cellCol].cellEl.classList.add("landmine");
            }
        }    
    }

}
 
function checkAllClear(grid){
    for (let row = 0;row < grid.length; row++){
        for(let col = 0;col < grid[row].length; col++){
            if (grid[row][col].count !== -1 && !grid[row][col].clear){
                return false;

            }
        }
    }
    for (let row = 0;row < grid.length; row++){
        for(let col = 0;col < grid[row].length; col++){
            if (grid[row][col].count === -1){
                grid[row][col].cellEl.classList.add("landmine") 
            }
            grid[row][col].cellEl.classList.add("success");
            
        }
    }
    
    return true;
}

//实现简单、普通、困难难度
let count = {
    num:0
}
let  easyEl = document.querySelector("#easy");
let El1 = document.createElement("td");
El1.className = "easy";
El1.innerText = "Easy"
El1.addEventListener("click",()=> {
    if (count.num === 0) {
        document.getElementById("board").innerHTML=""
        let grid = initialize(9,9,10);
        renderBoard(9,9,grid);
        count.num+=1;
        sl.syls = 10;
        help(9,9,grid)
    }else{
        gameover.js = false;
        document.getElementById("board").innerHTML=""
        let grid = initialize(9,9,10);
        renderBoard(9,9,grid);
        sl.syls = 10;
        clock(sl.syls)
        help(9,9,grid)
        joke.joke = 0
    }
    titleEl.innerHTML = "Reload";
    titleEl.classList.add("add");
});
easyEl.append(El1)
let  normalEl = document.querySelector("#normal");
let El2 = document.createElement("td");
El2.className = "normal";
El2.innerText = "Normal"
El2.addEventListener("click",()=> {

    if (count.num === 0) {
        document.getElementById("board").innerHTML=""
        let grid = initialize(15,15,40);
        renderBoard(15,15,grid);
        count.num+=1;
        sl.syls = 40;
        help(15,15,grid)
    }else{
        gameover.js = false;
        document.getElementById("board").innerHTML=""
        let grid = initialize(15,15,40);
        renderBoard(15,15,grid);
        sl.syls = 40;
        clock(sl.syls);
        help(15,15,grid);
        joke.joke = 0;
    }
    titleEl.innerHTML = "Reload";  
    titleEl.classList.add("add");
});
normalEl.append(El2)

let  difficultlEl = document.querySelector("#difficult");
let El3 = document.createElement("td");
El3.className = "difficult";
El3.innerText = "Difficult"
El3.addEventListener("click",()=> {
    if (count.num === 0) {
        document.getElementById("board").innerHTML=""
        sl.syls = 99;
        let grid = initialize(15,29,99);
        renderBoard(15,29,grid); 
        count.num+=1;
        help(15,29,grid);
    }else{
        gameover.js = false;
        document.getElementById("board").innerHTML=""
        let grid = initialize(15,29,99);
        renderBoard(15,29,grid);
        sl.syls = 99;
        clock(sl.syls);
        help(15,29,grid);
        joke.joke = 0;
    }
    titleEl.innerHTML = "Reload"; 
    titleEl.classList.add("add") ;  
});
difficultlEl.append(El3)
//给标题添加点击刷新功能
let titleEl = document.querySelector("#Title");
titleEl.className = "title";
titleEl.addEventListener("click",()=>{
    location.reload();
    
});
//用双击的方式结束游戏
let over = {
    over:false
}
//剩余雷数
let sl = {
    syls:0
}
let tips = document.querySelector("#tips") ;
function clock(sysl){
    let sys = sysl;
    if(sys < 0){
        sys = 0;
    }
    let surplus_landmine = document.createElement("div");
    surplus_landmine.innerHTML = "剩余雷数:" + sys;
    tips.innerHTML = ""
    tips.append(surplus_landmine);
}
//总共用时
// function clock_2(){
//     let all_time = document.createElement("div");
//     let sys = 0;
//     setTimeout(() => {
//         alert("1")
//     }, 5000);
//     while(sys < 100){
//         setTimeout(() => {
//             all_time.innerHTML = "总共时间:" + sys;
//         }, 100); 
//         sys+=1;
//     }

// }

//随机点击第一个非零的格子
function help(numRows,numCols,grid){
    let cellnum = Math.trunc(Math.random()*numRows*numCols);
    let row = Math.trunc(cellnum / numCols);
    let col = cellnum % numCols;
    while (grid[row][col].count != 0){
        cellnum = Math.trunc(Math.random()*numRows*numCols);
        row = Math.trunc(cellnum / numCols);
        col = cellnum % numCols;
    };
    console.log(row,col);
    searchClearArea(grid,row,col,numRows,numCols);

}







//画炸弹和旗子的图案
function picture(Rows,Cols){
    let table = new Array(Rows);
    for (let i = 0; i < Rows; i++){
        table[i] = new Array(Cols);
        for(let j = 0; j < Cols; j++){
            table[i][j] = {
                clear:false
            };
        }

        
    }
    return table;
}
let bombtable = picture(8,8);
let bomb = document.querySelector("#bomb");
for (let i = 0;i < 8;i++){
    let bombTr = document.createElement("tr")
    for (let j =0;j < 8;j++){
        let bombEl = document.createElement("div");
        bombEl.className = "bomb_block";
        bombtable[i][j].cellEl = bombEl;
        let bombTd = document.createElement("td");
        bombTd.append(bombEl);
        bombTr.append(bombTd);
    }
    bomb.append(bombTr);
}
for (let i of [1,2]){
    bombtable[2][i].cellEl.classList.add("frist");
    bombtable[3][i].cellEl.classList.add("frist");
}
for (let i of [5,6]){
    bombtable[2][i].cellEl.classList.add("frist");
    bombtable[3][i].cellEl.classList.add("frist");
}
for (i of [3,4]){
    bombtable[4][i].cellEl.classList.add("frist");
}
for (i of [2,3,4,5]){
    bombtable[5][i].cellEl.classList.add("frist");
}
for (i of [2,5]){
    bombtable[6][i].cellEl.classList.add("frist");
}


let flagtable = picture(8,8);
let f = document.querySelector("#flag");
for (let i = 0;i < 8;i++){
    let fTr = document.createElement("tr")
    for (let j =0;j < 8;j++){
        let fEl = document.createElement("div");
        fEl.className = "flag_block";
        flagtable[i][j].cellEl = fEl;
        let fTd = document.createElement("td");
        fTd.append(fEl);
        fTr.append(fTd);
    }
    flag.append(fTr);
}
for  (let i = 0;i < 8;i++){
    flagtable[7][i].cellEl.classList.add("first");
}
for (let i = 0;i < 8;i++){
    flagtable[i][4].cellEl.classList.add("first");
}
flagtable[0][3].cellEl.classList.add("second");

for (i of [2,3]){
    flagtable[1][i].cellEl.classList.add("second");
}
for (i of [1,2,3]){
    flagtable[2][i].cellEl.classList.add("second");
}
for (i of [0,1,2,3]){
    flagtable[3][i].cellEl.classList.add("second");
}


//无聊的彩蛋。。。。。
joke = {
    joke:0
}
let button = document.getElementById("button");
button.addEventListener("click",()=>{
    joke.joke += 1;
    
    if (joke.joke === 3 ){
        ask(
            "Are you serious?",
            ()=>{
                button.classList.add("cheating");
            },
            ()=>{
                alert("OK, Fine.....")
                joke.joke = 0
            }
        );
    }else if(joke.joke < 2){
        alert("Don't touch it!!!");
    }else if(joke.joke < 3){
        alert("Don't touch it!!!!!!!!!!");
    }else{
        document.getElementById("board").innerHTML=""
        alert("Enjoy yourself")
        let grid = initialize(15,29,479);
        renderBoard(15,29,grid); 
        let surplus_landmine = document.createElement("div");
        surplus_landmine.innerHTML = "剩余雷数:???" 
        tips.innerHTML = ""
        tips.append(surplus_landmine);
         count.num = 1;


    }
})
function ask(question,yes,no){
    
    if(confirm(question))yes();
    else no();
}

//结束游戏后禁止函数
let gameover = {
    js:false
}