import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//Try the extra additional problems 
function Square(props){
  return(
    <button className='square' onClick = {props.onClick}  style = {{color:props.color}} >
      {props.value}
    </button>
  )
}
  
  class Board extends React.Component {
    toHighlight(i){
      return this.props.highlight ? this.props.highlight.includes(i) : false
    }
   
    renderSquare(i) {
      return <Square value={this.props.squares[i] }
      onClick={()=>this.props.onClick(i)} color={this.toHighlight(i)? 'yellow':'black'} />;
    }
    renderRow(start) {
      const squares = []
      for(let i=start;i<start+3;i++){
        squares.push(this.renderSquare(i))
      } 

      return (
        <div className = "board-row">
          {squares}
        </div>
      )
    } 
    render() {
      
      //loop three times for the boar-row div
      //
      const board = []
      const numRows = 3 
      for(let i=0;i<7;i+=3){
        board.push(this.renderRow(i))
      }
      return (
        <div>
          {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    //We are maintaining three state variables, the main one being history which allows us to get the values of the current board
    //while also allowing us to save history from past moves which is why it is an array of objects 
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        coordChangeHistory: [0],
        stepNumber: 0,
        isAscending: true,
        xIsNext: true,
      };
    }

    jumpTo(step){
      this.setState({stepNumber: step,
      xIsNext: (step%2)===0});
      
    }

    /**
     * updates the board state and adds it to the histroy 
     * @param {*} i the square that is being changed to either an x or o
     * @returns null
     */
    handleClick(i){
      console.log(`current step number is ${i}`)
      const coords = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]
      //makes a shallow copy of the current history to use for later 
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      //grabs the most recent move from our history 
      const current = history[history.length-1];
      //makes a copy of the most recent move from our history
      const squares = current.squares.slice();
      const historyCoord = this.state.coordChangeHistory.slice(0,this.state.stepNumber+1)
      const currentCoord = coords[i]
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      //changes the square in the board to either x or o
      squares[i] = this.state.xIsNext ? 'X':'O';
      //adds the move to the history list 
      this.setState({history: history.concat([{squares:squares
      }]),
      coordChangeHistory: historyCoord.concat([currentCoord]),
      stepNumber: history.length,
      
      xIsNext: !this.state.xIsNext})
   
    }
  
    render() {
      const history = this.state.history;;
      const current = history[this.state.stepNumber];
      console.log(current)
      const winner = calculateWinner(current.squares);


      const moves = history.map((step,move) =>{
        const desc = move ? `Go to move #${move} placed at ${this.state.coordChangeHistory.length>0 ? this.state.coordChangeHistory[move]: 'no history'}`:' Go to first move';
        return (
          //Changes style to bold if selected
          //We know it is selected if the stepnumber is the same as the current move 
          <li key = {move} style={move===this.state.stepNumber ? {fontWeight:'bold'}:{fontWeight:'normal'}}>
            <button onClick={()=>this.jumpTo(move) } style={move===this.state.stepNumber ? {fontWeight:'bold'}:{fontWeight:'normal'}}>
              {desc}
            </button>
          </li>
        );
      });

      let status;
      if (winner){
        status = `Winner: ${winner[0]}`
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X':'O'}`
      }

      if (winner === null && !current.squares.includes(null)){
        status = `Winner: Draw!`
      }
      //<buttton onClick={console.log('click')}></buttton>
      return (
        <div className="game">
          <div className="game-board">
            <Board squares = {current.squares}
            onClick={(i)=>this.handleClick(i)} highlight = {winner? winner[1] : null}/>
          </div>
          <div className="game-info">
            <button onClick={()=>this.setState({...Board,isAscending:!this.state.isAscending})}>{this.state.isAscending?'Sort By Newest':'Sort By Oldest'}</button>
            <div>{status}</div>
            <ol>{this.state.isAscending?moves:moves.reverse()}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        
        return [squares[a],lines[i]];
      }
    }
    return null;
  }