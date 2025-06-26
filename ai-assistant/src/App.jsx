import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import Dashboard from './components/Dashboard';


// Dashboard Component
const App = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [connectionMode, setConnectionMode] = useState('online');
  const [selectedChat, setSelectedChat] = useState('');

  const [selectedChatHistory, setSelectedChatHistory] = useState([]);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        connectionMode={connectionMode}
        setConnectionMode={setConnectionMode}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setSelectedChatHistory={setSelectedChatHistory}
      />

      {/* Main */}
      <Dashboard 
      selectedModel={selectedModel}
      connectionMode={connectionMode}
      selectedChatHistory={selectedChatHistory}
      />
    </div>
  );
};

export default App;