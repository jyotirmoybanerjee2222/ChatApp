import Navbar from "./components/Navbar"
import {Routes,Route} from "react-router-dom"
const App = () => {
  return (
   <div >
    
     <Navbar/>
     <Routes>
        <Route path= "/"/>
     </Routes>
   </div>
  )
};
export default App;