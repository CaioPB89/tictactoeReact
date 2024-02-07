import { useState } from "react";

// Um componente que pode receber um prop
function Square({ value, onSquareClick }) {
  // Ao se clicar, chame a função
  // Ao se clicar, chama o Square com os props, que são passados pela função onSquare que chama handleClick. Dai ele atualiza a array dos squares e
  // retorna o valor da posição squares[x].
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente React, que é exportado e é o principal da file
function Board({xIsNext, squares, onPlay, cMove}) {
  


  // squares é uma array de 9 espaços vazia. Agora o Board que segura como o tabuleiro está

  // styles está fazendo a quebra das divs com classname board-row
  // Os botões agora são componentes
  function handleClick(i) {
    


    // Se essa posição já existir com um valor (not null), retorne cedo
    if (squares[i] || calculateWinner(squares)) {
      // Se já existe um valor OU calculate retornou um valor não nulo
      return;
    }

    // Cria uma copia da array (avoid data mutation) (Not splice)
    const nextSquares = squares.slice();
    if (xIsNext) {
      // Se X for true, ele está jogando, em oposto, O está jogando
      // Muda seu valor i para X
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    // O save das posições e a inversão do jogador estão sendo feitas aqui agora.
    onPlay(nextSquares);

    // Desse jeito, o board chama o Square com o resultado da função handleClick, que então faz o componente Square retornar o botão com o valor novo ao clicar
  }

  const winner = calculateWinner(squares);
  let status;


  // Ja que currentMove mantem um contador de qual a jogada, ele pode ser usado para empates
  if (winner){
    // Se vencedor !==Null, alguem venceu
    status = `Vencedor: ${winner}`
  } else if (cMove !== 9){ // se o contador não valer 9 (ultima jogada aconteceu)
    // Proximo jogador é quem vai jogar no momento, então se x for o que vai jogar (true), retorne a letra X
    status = `Proximo jogador: ${xIsNext?"X":"O"}`
  } else {
    // Se vencedor for false e contador === 9
    status = "Empate!";
  }

  // Clica -> onClick do Square com o valor do prop função -> chama o handleClick pelo board ( o valor do onSquareClick é a função) ->
  // o handleClick usa i para copiar o estado, fazer uma mudança e colocar a nova array como o estado.

  // O handleClick altera o estado primeiro, dai o Square recebe a posição alterada da Array pela propriedade value.
  return (
    // Cada botão tem seu valor igual a um elemento correspondente da array
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />{" "}
        {/* Desse jeito, a função só é chamado quando deveria. */}
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Vendo vencedor
function calculateWinner(squares) {
  const lines = [
    // São as possiveis posições para check de vitoria
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0;i<lines.length;i++){
    const [a,b,c] = lines[i]; // quebra as arrays nestadas em 3 valores
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      // Se square[0] (true se !== null) e squares[0] === squares[1](XX?) e squares[0] === squares[2](X?X)
      return squares[a]; // Retorna x, o ou null, dependendo de quem venceu
    }
  }
  return null;
}

// Game é o principal agora. O index.js vai usar ele
export default function Game() {
  // Game manipula o Board
  
  const [history,setHistory] = useState([Array(9).fill(null)]); //uma array de array de 9 posições e vazias
  const [currentMove, setCurrentMove] = useState(0); // checagem de estado de tabuleiro
  const currentSquares = history[currentMove]; // igual a ultima posição da array history
  const xIsNext = currentMove % 2 === 0; // CurrentMove é usado para check de quem está jogando, já que toda jogada de X vai ser par
  // Toda vez que o tabuleiro é alterado, o seu valor é salvo em history como um elemento array. currentMove começa em 0 e aumenta toda jogada

  function handlePlays(nextSquares){
    // Toda jogada, o Board chama essa função, então o estado é sempre salvo

    // NextHistory é igual a o historico do primeiro movimento até o mais recente mais os movimentos do momento
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares] // esse +1 é para slice cortar do 0 até (incluindo) a jogada mais recente
    setHistory(nextHistory); // Historico vira novo historico
    setCurrentMove(nextHistory.length - 1) // tabuleiro = ultima array do historico
  }
  function jumpTo(nextMove){
    // Ao se clicar, coloca o valor de currentMove a chave que é o index da jogada(elemento tabuleiro dentro de history)
    setCurrentMove(nextMove);
  }
  // Quando uma lista em React é re-renderizada, o React checa a chave de cada item com as chaves da lista antiga. Essas chaves são para identificações entre mudanças.
  //  Se a nova chave não existia antes, React cria um novo componente. Se uma chave que existia não existe mais, React destroi o elemento. Se a chave dá match, o elemento é movido.
  
  const moves = history.map((squares,move)=>{
    // square = valor move = index do square
    let description;
    if (move > 0){
      description = `Vá para movimento ${move}`
    } else {
      description =  `Voltar ao inicio do jogo`
    }
    // A descrição é o texto do botão, que chama uma função para pular para outro estado do tabuleiro

    // Chave do elemento = valor move(o index)
    return (
      <li key={move}>
        <button onClick={()=> jumpTo(move)}>{description}</button>
      </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlays} cMove={currentMove}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// BOTÃO DE VOLTAR
// Toda jogada, é criado uma opção de voltar rodada. Ao se clicar em uma, se chama a função jumpTo, que coloca o tabuleiro no elemento do array history 
// com o index sendo o numero da jogada (jogada 1 = tabuleiro no index 1....)
// O nextHistory faz um slice da array historia até o ponto que se voltou, então se o jogador fizer uma jogada nova, ele continua de nextHistory.
// Historico toma set para o novo historico e dai o tabuleiro recebe o elemento mais recente do historico.

// O JOGO
// Game chama Board que chama Square.
// Board recebe varios props, um deles a função de salvar historico que existe no Game. Tambem recebe se é jogador X, o estado do tabuleiro e qual o valor numero da jogada.


