import './App.css';
import { Route, Routes } from 'react-router-dom';
import ChatsPage from "./Pages/ChatsPage.jsx"
import HomePage from "./Pages/HomePage.jsx"

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
