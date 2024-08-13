import './App.css';
import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import { Spinner } from "@chakra-ui/react";

// Lazy load the ChatsPage
import HomePage from "./Pages/HomePage.jsx";
const ChatsPage = React.lazy(() => import('./Pages/ChatsPage.jsx'));

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/Chats"
          element={
            <Suspense fallback={<Spinner
              size="xl"
              w={20}
              h={20}
              margin="auto"
            />}>
              <ChatsPage />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

