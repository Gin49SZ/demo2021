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

                // if (grid[i][j].count === -1){
                //     cellEl.innerText ="*";
                // }else{
                //     cellEl.innerText = grid[i][j].count;
                // }           
            




            cellEl.addEventListener("click",(e)=> {


                
                if (grid[i][j].count === -1){                  
                    exploded(grid,i,j,numRows,numCols);
                    alert("You lost")
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
                    alert("You win");
                }
                 
            });
//插旗
            cellEl.addEventListener("mousedown",(e)=>{
                if (e.button == 2 && grid[i][j].clear == false && grid[i][j].flag == false){
                    grid[i][j].cellEl.classList.add("flag");
                    grid[i][j].flag = true;
                }else{
                    grid[i][j].cellEl.classList.remove("flag");
                    grid[i][j].flag = false;
                }
                    
            })
//双击已被展开的数字会展开附近没有被插旗的块
            cellEl.addEventListener("dblclick",(e)=>{
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
                            alert("You lost");
                            console.log(over.over)
                            return;
                        }

                    }
                    checkAllClear(grid)
                    if (checkAllClear(grid) == true && over.over == false){
                        alert("You win");       
                    }

                }     
            })
            //未完成品
            // cellEl.addEventListener("mousedown",(e)=>{
            //     if (grid[i][j].clear == true && e.button == 2){
            //         for (let [drow,dcol] of directions ){
            //             let cellRow = i + drow;
            //             let cellCol = j + dcol;
            //             if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols){
            //                 continue;
            //             }else if(grid[cellRow][cellCol].look = false){
            //                 grid[cellRow][cellCol].cellEl.classList.add("look");
            //                 grid[cellRow][cellCol].look = true;
            //                 continue;
            //             }else if(grid[cellRow][cellCol].look = true){
            //                 grid[cellRow][cellCol].cellEl.classList.remove("look");
            //                 grid[cellRow][cellCol].look = false;
            //                 continue;
            //             }
            //         }
            //     }
            // });

            
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

function tips(grid,numRows,numCols){
    for (let cellRow = 0; cellRow < numRows; cellRow++){
        for(let cellCol = 0; cellCol < numCols; cellCol++){
            if (grid[cellRow][cellCol].count === -1){              
                grid[cellRow][cellCol].cellEl.classList.add("landmine");
            }
        }    
    }

}





count = {
    num:0
}
function easy(){
    let grid = initialize(9,9,7);
    renderBoard(9,9,grid);
    
}
let  easyEl = document.querySelector("#easy");
let El1 = document.createElement("td");
El1.className = "easy";
El1.innerText = "Easy"
El1.addEventListener("click",()=> {
    if (count.num === 0) {
        easy();
        count.num+=1;
    }else{
        location.reload();
    }
    titleEl.innerHTML = "Reload";
    titleEl.classList.add("add");
});
easyEl.append(El1)



function normal(){
    let grid = initialize(10,15,15);
    renderBoard(10,15,grid);
    
}
let  normalEl = document.querySelector("#normal");
let El2 = document.createElement("td");
El2.className = "normal";
El2.innerText = "Normal"
El2.addEventListener("click",()=> {
    if (count.num === 0) {
        normal();
        count.num+=1;
    }else{
        location.reload();
    }
    titleEl.innerHTML = "Reload";  
    titleEl.classList.add("add");
});
normalEl.append(El2)

function difficult(){
    let grid = initialize(15,20,22);
    renderBoard(15,20,grid);
    
}
let  difficultlEl = document.querySelector("#difficult");
let El3 = document.createElement("td");
El3.className = "difficult";
El3.innerText = "Difficult"
El3.addEventListener("click",()=> {
    if (count.num === 0) {
        difficult();
        count.num+=1;
    }else{
        location.reload();
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

let over = {
    over:false
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
let bombtable = picture(7,8);
let bomb = document.querySelector("#bomb");
for (let i = 0;i < 7;i++){
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
    bombtable[1][i].cellEl.classList.add("frist");
    bombtable[2][i].cellEl.classList.add("frist");
}
for (let i of [5,6]){
    bombtable[1][i].cellEl.classList.add("frist");
    bombtable[2][i].cellEl.classList.add("frist");
}
for (i of [3,4]){
    bombtable[3][i].cellEl.classList.add("frist");
}
for (i of [2,3,4,5]){
    bombtable[4][i].cellEl.classList.add("frist");
}
for (i of [2,5]){
    bombtable[5][i].cellEl.classList.add("frist");
}


let flagtable = picture(7,8);
let f = document.querySelector("#flag");
for (let i = 0;i < 7;i++){
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
    flagtable[6][i].cellEl.classList.add("first");
}
for (let i = 0;i < 7;i++){
    flagtable[i][3].cellEl.classList.add("first");
}
flagtable[0][4].cellEl.classList.add("second");

for (i of [4,5]){
    flagtable[1][i].cellEl.classList.add("second");
}
for (i of [4,5,6]){
    flagtable[2][i].cellEl.classList.add("second");
}
for (i of [4,5,6,7]){
    flagtable[3][i].cellEl.classList.add("second");
}
