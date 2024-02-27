import "./App.css";
import MainPage from "./components/MainPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <MainPage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
