import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import { MainPage, ComicsPage, SingleComicPage} from "../pages";
import ErrorMessage from "../errorMessage/ErrorMessage";

const App  = () => {



    return (
        <Router>
            <div className="app">
            <AppHeader/>
            <main>
            <Routes>
                <Route path="/" element={<MainPage/>} />
                <Route path="/comics" element={<ComicsPage/>} />
                <Route path="/comics/:comicId" element={<SingleComicPage/>} />
                <Route path="*" element={<ErrorMessage />}/>
               
            </Routes>

            </main>
        </div>
        </Router>
        
    )

}

export default App;