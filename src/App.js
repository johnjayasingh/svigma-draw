import logo from "./logo.svg";
import "./App.css";
import { useReducer, useState } from "react";

function App() {
  const [background, setBackground] = useState("#FFFFFF");
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const [mouseDown, setMouseDown] = useState(false);

  const [moves, setMoves] = useReducer((state, action) => {
    const {
      type,
      data: { x, y },
    } = action;
    switch (type) {
      case "undo":
        state.pop();
        break;
      case "movestart":
        state.push(`M ${x} ${y} `);
        break;
      case "move":
        state.push(`L ${x} ${y} `);
        break;
      case "moveend":
        state.push(`M ${x} ${y} `);
        break;
      default:
        break;
    }
    return state;
  }, []);

  const getCoordinates = (event) => {
    const board = document.getElementById("board");
    // Position of board from top and left. (includes margin and padding)
    const { left, top } = board.getBoundingClientRect();
    // If touch
    // https://www.w3schools.com/jsref/event_touchstart.asp
    if (event.touches) {
      return {
        // Target first touch position from whole page X and Y - left and Top position offset of target board
        x: parseInt(event.targetTouches[0].pageX) - left,
        y: parseInt(event.targetTouches[0].pageY) - top,
      };
    }
    // https://www.w3schools.com/jsref/event_clientx.asp
    // Else get client click event postions
    return {
      x: parseInt(event.clientX) - left,
      y: parseInt(event.clientY) - top,
    };
  };

  const handleMouseDown = (event) => {
    setMouseDown(true);
    const position = getCoordinates(event);
    setMoves({
      type: "movestart",
      data: position,
    });
  };

  const handleMouseMove = (event) => {
    if (mouseDown) {
      const position = getCoordinates(event);
      setMoves({
        type: "move",
        data: position,
      });
    }
  };

  const handleMouseUp = (event) => {
    setMouseDown(false);
    const position = getCoordinates(event);
    setMoves({
      type: "moveend",
      data: position,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Svigma</h2>
        <img src={logo} className="App-logo" height={50} alt="logo" />
      </header>
      <div id="control">
        <input
          type="number"
          placeholder="Width"
          value={width}
          onChange={(event) => {
            setWidth(event.target.value);
          }}
        ></input>
        <input
          type="number"
          placeholder="Height"
          value={height}
          onChange={(event) => {
            setHeight(event.target.value);
          }}
        ></input>
        <input
          type="color"
          placeholder="Background Color"
          value={background}
          onChange={(event) => {
            setBackground(
              event.target.value.length ? event.target.value : "#FFF"
            );
          }}
        ></input>
      </div>
      <main>
        <svg
          id="board"
          height={height}
          width={width}
          style={{
            backgroundColor: background,
            background: "#FFF",
            border: "2px solid #000000",
            borderColor: "#000",
            margin: 10,
          }}
          viewBox={`0 0 ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {moves.map((move) => {
            const [t, x, y] = move.split(" ");
            return <rect x={x} y={y} height={10} width={10} fill="blue" />;
          })}
          {moves.map((move) => {
            const [t, x, y] = move.split(" ");
            return <circle cx={x} cy={y} r={5} fill="orange" />;
          })}
          <path d={moves.join(" ")} fill="red" />
        </svg>
      </main>
    </div>
  );
}

export default App;
