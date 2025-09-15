const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const twoPlayerBtn = document.getElementById("twoPlayer");
const vsCpuBtn = document.getElementById("vsCpu");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");

let board = Array(9).fill(null);
let history = [];
let gameOver = false;
let turn = "X";
let vsCPU = true;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ----- Mode Buttons -----
twoPlayerBtn.addEventListener("click", () => { vsCPU = false; resetGame(); });
vsCpuBtn.addEventListener("click", () => { vsCPU = true; resetGame(); });

// ----- Update Turn Message -----
function updateTurnMessage(){
  if(gameOver) return;
  if(vsCPU) message.textContent = turn==="X" ? "Your turn (X)" : "CPU's turn (O)";
  else message.textContent = `Turn: ${turn}`;
}

// ----- Cell Click -----
cells.forEach((cell,i)=>{
  cell.addEventListener("click", ()=>{
    if(gameOver || board[i]) return;
    makeMove(i, turn);

    if(!vsCPU){
      turn = turn==="X"?"O":"X";
      updateTurnMessage();
    } else if(vsCPU && turn==="O" && !gameOver){
      setTimeout(cpuMove,400);
      updateTurnMessage();
    }
  });
});

// ----- Make Move -----
function makeMove(i, player){
  board[i]=player;
  cells[i].textContent=player;

  // Pop animation
  cells[i].classList.remove("pop");
  void cells[i].offsetWidth;
  cells[i].classList.add("pop");

  history.push(i);

  if(checkWin(player)){
    message.textContent=`${player} wins!`;
    gameOver=true;
    updateScore(player);
    return;
  }

  if(board.every(Boolean)){
    message.textContent="It's a draw!";
    gameOver=true;
    scoreD.textContent=parseInt(scoreD.textContent)+1;
    return;
  }

  if(vsCPU){
    turn = player==="X"?"O":"X";
    updateTurnMessage();
  }
}

// ----- CPU Move -----
function cpuMove(){
  if(gameOver) return;
  let bestScore=-Infinity, move;
  board.forEach((val,i)=>{
    if(!val){
      board[i]="O";
      let score=minimax(board,0,false);
      board[i]=null;
      if(score>bestScore){ bestScore=score; move=i; }
    }
  });
  makeMove(move,"O");
}

// ----- Minimax -----
function minimax(newBoard, depth, isMax){
  if(checkWin("O")) return 10-depth;
  if(checkWin("X")) return depth-10;
  if(newBoard.every(Boolean)) return 0;

  if(isMax){
    let best=-Infinity;
    newBoard.forEach((v,i)=>{
      if(!v){ newBoard[i]="O"; let s=minimax(newBoard,depth+1,false); newBoard[i]=null; best=Math.max(s,best);}
    });
    return best;
  } else {
    let best=Infinity;
    newBoard.forEach((v,i)=>{
      if(!v){ newBoard[i]="X"; let s=minimax(newBoard,depth+1,true); newBoard[i]=null; best=Math.min(s,best);}
    });
    return best;
  }
}

// ----- Check Win -----
function checkWin(player){
  return winCombos.some(combo=>combo.every(i=>board[i]===player));
}

// ----- Update Score -----
function updateScore(player){
  if(player==="X") scoreX.textContent=parseInt(scoreX.textContent)+1;
  if(player==="O") scoreO.textContent=parseInt(scoreO.textContent)+1;
}

// ----- Reset Game -----
function resetGame(){
  board.fill(null);
  cells.forEach(c=>c.textContent="");
  history=[];
  gameOver=false;
  turn="X";
  updateTurnMessage();
}

// ----- Undo Last Move -----
undoBtn.addEventListener("click", ()=>{
  if(history.length<1) return;

  // Undo CPU move first if vsCPU
  if(vsCPU && history.length>=2){
    let cpuIndex = history.pop();
    board[cpuIndex] = null;
    cells[cpuIndex].textContent = "";
  }

  // Undo player's move
  let playerIndex = history.pop();
  board[playerIndex] = null;
  cells[playerIndex].textContent = "";

  gameOver=false;
  turn="X";
  updateTurnMessage();
});

// ----- Reset button listener -----
resetBtn.addEventListener("click", resetGame);

// ----- Initialize -----







