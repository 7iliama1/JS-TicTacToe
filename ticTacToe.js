// Привязки событий

// Привязать клавишу Esc к закрытию модального диалога
document.onkeypress = function (evt) {
  // eslint-disable-next-line no-param-reassign
  evt = evt || window.event;
  const modal = document.getElementsByClassName('modal')[0];
  if (evt.keyCode === 27) {
    modal.style.display = 'none';
  }
};

// Когда пользователь щелкает в любом месте за пределами модального диалогового окна, закройте его.
window.onclick = function (evt) {
  const modal = document.getElementsByClassName('modal')[0];
  if (evt.target === modal) {
    modal.style.display = 'none';
  }
};

// Вспомогательные функции

function sumArray(array) {
  let sum = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function isInArray(element, array) {
  if (array.indexOf(element) > -1) {
    return true;
  }
  return false;
}

function shuffleArray(array) {
  let counter = array.length;
  let temp;
  let index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    // eslint-disable-next-line no-plusplus
    counter--;
    temp = array[counter];
    // eslint-disable-next-line no-param-reassign
    array[counter] = array[index];
    // eslint-disable-next-line no-param-reassign
    array[index] = temp;
  }
  return array;
}

function intRandom(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// Глобальные переменные
let moves = 0;
let winner = 0;
const x = 1;
const o = 3;
let player = x;
let computer = o;
let whoseTurn = x;
let gameOver = false;
const score = {
  ties: 0,
  player: 0,
  computer: 0,
};
const xText = '<span class="x">&times;</class>';
const oText = '<span class="o">o</class>';
let playerText = xText;
let computerText = oText;
let difficulty = 1;
let myGrid = null;

// Сеточный объект

// Конструктор сетки
function Grid() {
  this.cells = new Array(9);
}

Grid.prototype.getFreeCellIndices = function () {
  let i = 0;
  const resultArray = [];
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }
  return resultArray;
};

// Получить строку (принимает 0, 1 или 2 в качестве аргумента).
// Возвращает значения элементов.
Grid.prototype.getRowValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error('Wrong arg for getRowValues!');
    return undefined;
  }
  const i = index * 3;
  return this.cells.slice(i, i + 3);
};

// Получить строку (принимает 0, 1 или 2 в качестве аргумента).
// Возвращает массив с индексами, а не их значениями.
Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error('Wrong arg for getRowIndices!');
    return undefined;
  }
  const row = [];
  // eslint-disable-next-line no-param-reassign
  index *= 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
};

// получить столбец (значения)
Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error('Wrong arg for getColumnValues!');
    return undefined;
  }
  let i; const
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }
  return column;
};

// получить столбец (индексы)
Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error('Wrong arg for getColumnIndices!');
    return undefined;
  }
  let i; const
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }
  return column;
};

// получить диагональные клетки
// аргумент 0: сверху слева
// аргумент 1: сверху справа
// eslint-disable-next-line func-names
Grid.prototype.getDiagValues = function (arg) {
  const cells = [];
  if (arg !== 1 && arg !== 0) {
    console.error('Wrong arg for getDiagValues!');
    return undefined;
  } if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }
  return cells;
};

// получить диагональные клетки
// аргумент 0: сверху слева
// аргумент 1: сверху справа
// eslint-disable-next-line func-names
Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error('Wrong arg for getDiagIndices!');
    return undefined;
  } if (arg === 0) {
    return [0, 4, 8];
  }
  return [2, 4, 6];
};

// Получить первый индекс с двумя подряд (принимает компьютер или плеер в качестве аргумента)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
  if (agent !== computer && agent !== player) {
    console.error('Function getFirstWithTwoInARow accepts only player or computer as argument.');
    return undefined;
  }
  const sum = agent * 2;
  const freeCells = shuffleArray(this.getFreeCellIndices());
  for (let i = 0; i < freeCells.length; i++) {
    for (let j = 0; j < 3; j++) {
      const rowV = this.getRowValues(j);
      const rowI = this.getRowIndices(j);
      const colV = this.getColumnValues(j);
      const colI = this.getColumnIndices(j);
      if (sumArray(rowV) === sum && isInArray(freeCells[i], rowI)) {
        return freeCells[i];
      } if (sumArray(colV) === sum && isInArray(freeCells[i], colI)) {
        return freeCells[i];
      }
    }
    // eslint-disable-next-line block-scoped-var
    for (let j = 0; j < 2; j++) {
      const diagV = this.getDiagValues(j);
      const diagI = this.getDiagIndices(j);
      if (sumArray(diagV) === sum && isInArray(freeCells[i], diagI)) {
        return freeCells[i];
      }
    }
  }
  return false;
};

Grid.prototype.reset = function () {
  for (let i = 0; i < this.cells.length; i++) {
    this.cells[i] = 0;
  }
  return true;
};

// Главные функции

// выполняется при загрузке страницы
// eslint-disable-next-line no-unused-vars
function initialize() {
  myGrid = new Grid();
  moves = 0;
  winner = 0;
  gameOver = false;
  whoseTurn = player;
  for (let i = 0; i <= myGrid.cells.length - 1; i++) {
    myGrid.cells[i] = 0;
  }
  // eslint-disable-next-line no-use-before-define
  setTimeout(showOptions, 500);
}

// Спросите игрока, хотят ли они играть за X или O. X ходит первым.
// eslint-disable-next-line no-unused-vars
function assignRoles() {
  // eslint-disable-next-line no-use-before-define
  askUser('Do you want to go first?');
  document.getElementById('yesBtn').addEventListener('click', makePlayerX);
  document.getElementById('noBtn').addEventListener('click', makePlayerO);
}

function makePlayerX() {
  player = x;
  computer = o;
  whoseTurn = player;
  playerText = xText;
  computerText = oText;
  document.getElementById('userFeedback').style.display = 'none';
  document.getElementById('yesBtn').removeEventListener('click', makePlayerX);
  document.getElementById('noBtn').removeEventListener('click', makePlayerO);
}

function makePlayerO() {
  player = o;
  computer = x;
  whoseTurn = computer;
  playerText = oText;
  computerText = xText;
  // eslint-disable-next-line no-use-before-define
  setTimeout(makeComputerMove, 400);
  document.getElementById('userFeedback').style.display = 'none';
  document.getElementById('yesBtn').removeEventListener('click', makePlayerX);
  document.getElementById('noBtn').removeEventListener('click', makePlayerO);
}

// выполняется, когда игрок щелкает одну из ячеек таблицы
// eslint-disable-next-line no-unused-vars
function cellClicked(id) {
  const idName = id.toString();
  const cell = parseInt(idName[idName.length - 1], 10);
  if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
    return false;
  }
  moves += 1;
  document.getElementById(id).innerHTML = playerText;
  const rand = Math.random();
  if (rand < 0.3) {
    document.getElementById(id).style.transform = 'rotate(180deg)';
  } else if (rand > 0.6) {
    document.getElementById(id).style.transform = 'rotate(90deg)';
  }
  document.getElementById(id).style.cursor = 'default';
  myGrid.cells[cell] = player;
  if (moves >= 5) {
    // eslint-disable-next-line no-use-before-define
    winner = checkWin();
  }
  if (winner === 0) {
    whoseTurn = computer;
    // eslint-disable-next-line no-use-before-define
    makeComputerMove();
  }
  return true;
}

// Выполняется, когда игрок нажимает кнопку перезагрузки.
// "ask" должно быть true, если мы должны спрашивать пользователей, хотят ли они играть за X или O
function restartGame(ask) {
  if (moves > 0) {
    // eslint-disable-next-line no-restricted-globals
    const response = confirm('Are you sure you want to start over?');
    if (response === false) {
      return;
    }
  }
  gameOver = false;
  moves = 0;
  winner = 0;
  whoseTurn = x;
  myGrid.reset();
  for (let i = 0; i <= 8; i++) {
    const id = `cell${i.toString()}`;
    document.getElementById(id).innerHTML = '';
    document.getElementById(id).style.cursor = 'pointer';
    document.getElementById(id).classList.remove('win-color');
  }
  if (ask === true) {
    setTimeout(showOptions, 200);
  } else if (whoseTurn === computer) {
    setTimeout(makeComputerMove, 800);
  }
}

// Основная логика игрового ИИ:
function makeComputerMove() {
  if (gameOver) {
    return false;
  }
  let cell = -1;
  let myArr = [];
  const corners = [0, 2, 6, 8];
  if (moves >= 3) {
    cell = myGrid.getFirstWithTwoInARow(computer);
    if (cell === false) {
      cell = myGrid.getFirstWithTwoInARow(player);
    }
    if (cell === false) {
      if (myGrid.cells[4] === 0 && difficulty === 1) {
        cell = 4;
      } else {
        myArr = myGrid.getFreeCellIndices();
        cell = myArr[intRandom(0, myArr.length - 1)];
      }
    }
    // Избегайте ситуации «уловка-22»:
    if (moves === 3 && myGrid.cells[4] === computer && player === x && difficulty === 1) {
      if (myGrid.cells[7] === player && (myGrid.cells[0] === player || myGrid.cells[2] === player)) {
        myArr = [6, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[5] === player && (myGrid.cells[0] === player || myGrid.cells[6] === player)) {
        myArr = [2, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[3] === player && (myGrid.cells[2] === player || myGrid.cells[8] === player)) {
        myArr = [0, 6];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[1] == player && (myGrid.cells[6] == player || myGrid.cells[8] == player)) {
        myArr = [0, 2];
        cell = myArr[intRandom(0, 1)];
      }
    } else if (moves === 3 && myGrid.cells[4] === player && player === x && difficulty === 1) {
      if (myGrid.cells[2] === player && myGrid.cells[6] === computer) {
        cell = 8;
      } else if (myGrid.cells[0] === player && myGrid.cells[8] === computer) {
        cell = 6;
      } else if (myGrid.cells[8] === player && myGrid.cells[0] === computer) {
        cell = 2;
      } else if (myGrid.cells[6] === player && myGrid.cells[2] === computer) {
        cell = 0;
      }
    }
  } else if (moves === 1 && myGrid.cells[4] === player && difficulty === 1) {
    cell = corners[intRandom(0, 3)];
  } else if (moves === 2 && myGrid.cells[4] === player && computer === x && difficulty === 1) {
    if (myGrid.cells[0] === computer) {
      cell = 8;
    } else if (myGrid.cells[2] === computer) {
      cell = 6;
    } else if (myGrid.cells[6] === computer) {
      cell = 2;
    } else if (myGrid.cells[8] === computer) {
      cell = 0;
    }
  } else if (moves === 0 && intRandom(1, 10) < 8) {
    cell = corners[intRandom(0, 3)];
  } else if (myGrid.cells[4] === 0 && difficulty === 1) {
    cell = 4;
  } else {
    myArr = myGrid.getFreeCellIndices();
    cell = myArr[intRandom(0, myArr.length - 1)];
  }
  const id = `cell${cell.toString()}`;
  document.getElementById(id).innerHTML = computerText;
  document.getElementById(id).style.cursor = 'default';
  const rand = Math.random();
  if (rand < 0.3) {
    document.getElementById(id).style.transform = 'rotate(180deg)';
  } else if (rand > 0.6) {
    document.getElementById(id).style.transform = 'rotate(90deg)';
  }
  myGrid.cells[cell] = computer;
  moves += 1;
  if (moves >= 5) {
    winner = checkWin();
  }
  if (winner === 0 && !gameOver) {
    whoseTurn = player;
  }
}

// Проверьте, закончилась ли игра, и определите победителя
function checkWin() {
  winner = 0;

  // ряды
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= 2; i++) {
    const row = myGrid.getRowValues(i);
    if (row[0] > 0 && row[0] === row[1] && row[0] === row[2]) {
      if (row[0] === computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      // Дайте победной строке/столбцу/диагонали другой цвет заднего фона
      const tmpAr = myGrid.getRowIndices(i);
      for (let j = 0; j < tmpAr.length; j++) {
        const str = `cell${tmpAr[j]}`;
        document.getElementById(str).classList.add('win-color');
      }
      setTimeout(endGame, 1000, winner);
      return winner;
    }
  }

  // столбцы
  for (let i = 0; i <= 2; i++) {
    const col = myGrid.getColumnValues(i);
    if (col[0] > 0 && col[0] === col[1] && col[0] === col[2]) {
      if (col[0] === computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      const tmpAr = myGrid.getColumnIndices(i);
      for (let j = 0; j < tmpAr.length; j++) {
        const str = `cell${tmpAr[j]}`;
        document.getElementById(str).classList.add('win-color');
      }
      // eslint-disable-next-line no-use-before-define
      setTimeout(endGame, 1000, winner);
      return winner;
    }
  }

  // Диагонали
  for (let i = 0; i <= 1; i++) {
    const diagonal = myGrid.getDiagValues(i);
    if (diagonal[0] > 0 && diagonal[0] === diagonal[1] && diagonal[0] === diagonal[2]) {
      if (diagonal[0] === computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      const tmpAr = myGrid.getDiagIndices(i);
      for (let j = 0; j < tmpAr.length; j++) {
        const str = `cell${tmpAr[j]}`;
        document.getElementById(str).classList.add('win-color');
      }
      setTimeout(endGame, 1000, winner);
      return winner;
    }
  }

  // Если мы еще не объявили победителя, если доска заполнена, это ничья
  const myArr = myGrid.getFreeCellIndices();
  if (myArr.length === 0) {
    winner = 10;
    score.ties++;
    endGame(winner);
    return winner;
  }

  return winner;
}

function announceWinner(text) {
  document.getElementById('winText').innerHTML = text;
  document.getElementById('winAnnounce').style.display = 'block';
  // eslint-disable-next-line no-use-before-define
  setTimeout(closeModal, 1400, 'winAnnounce');
}

function askUser(text) {
  document.getElementById('questionText').innerHTML = text;
  document.getElementById('userFeedback').style.display = 'block';
}

function showOptions() {
  if (player === o) {
    document.getElementById('rx').checked = false;
    document.getElementById('ro').checked = true;
  } else if (player === x) {
    document.getElementById('rx').checked = true;
    document.getElementById('ro').checked = false;
  }
  if (difficulty === 0) {
    document.getElementById('r0').checked = true;
    document.getElementById('r1').checked = false;
  } else {
    document.getElementById('r0').checked = false;
    document.getElementById('r1').checked = true;
  }
  document.getElementById('optionsDlg').style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function getOptions() {
  const diffs = document.getElementsByName('difficulty');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < diffs.length; i++) {
    if (diffs[i].checked) {
      difficulty = parseInt(diffs[i].value, 10);
      break;
    }
  }
  if (document.getElementById('rx').checked === true) {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
  } else {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 400);
  }
  document.getElementById('optionsDlg').style.display = 'none';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function endGame(who) {
  if (who === player) {
    announceWinner('Congratulations, you won!');
  } else if (who === computer) {
    announceWinner('Computer wins!');
  } else {
    announceWinner("It's a tie!");
  }
  gameOver = true;
  whoseTurn = 0;
  moves = 0;
  winner = 0;
  document.getElementById('computer_score').innerHTML = score.computer;
  document.getElementById('tie_score').innerHTML = score.ties;
  document.getElementById('player_score').innerHTML = score.player;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= 8; i++) {
    const id = `cell${i.toString()}`;
    document.getElementById(id).style.cursor = 'default';
  }
  setTimeout(restartGame, 800);
}
