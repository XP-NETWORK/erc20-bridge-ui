import "./App.css";
import Confirmation from "./components/Confirmation";
import ConnectWallet from "./components/ConnectWallet";
import Report from "./components/Report";
import Transfer from "./components/Transfer";

function App() {
  return (
    <div className="App">
      {/* <ConnectWallet /> */}
      <Transfer/>
      {/* <Confirmation/> */}
      {/* <Report/> */}
    </div>
  );
}

export default App;
