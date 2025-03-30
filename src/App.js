import './styles/index.scss'
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
    return (
        <div className="app">
            <Header text="Счетчик рабочего времени"/>
            <Footer/>
        </div>
    );
}

export default App;
