import './styles/index.scss'
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Main from "./components/main/Main";

function App() {
    return (
        <div className="app">
            <Header text="Трекер рабочего времени"/>
            <Main/>
            <Footer/>
        </div>
    );
}

export default App;
