import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {

  
  return (
    <div className="App">
      <header className="App-header">
        <Route path="/" component={HomePage} exact/>
        <Route path="/chats" component={ChatPage}/>
      </header>
    </div>
  );
}

export default App;
