import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';

const makeAIRequest = async (question, connectionMode, selectedModel) => {
  try {
    const requestBody = {
      isOnline: connectionMode === 'online' ? 1 : 0,
      question: question.trim(),
      llm: selectedModel
    };

    console.log('API Request:', requestBody);
    const response = await fetch('http://localhost:3000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.answer
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


const Dashboard = ({ selectedModel, connectionMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const result = await makeAIRequest(prompt, connectionMode, selectedModel);
      
      if (result.success) {
        setResponse(result.data.response || result.data.message || JSON.stringify(result.data));
      } else {
        setError(result.error || 'Failed to get AI response');
        setResponse('');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#45c4e9] via-[#54b3a6] to-[#005c97] bg-clip-text text-transparent mb-2 tracking-wider">
  AI Assistant
</h2>


        <p className="text-gray-400">
          Enter your prompt below and let AI help you with your tasks
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Response Area */}
        {response && (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-[#42adc6]" />
              <span className="text-[#42adc6] font-medium">AI Response</span>
            </div>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-6 bg-red-900/20 rounded-lg border border-red-700">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-red-400" />
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <div className="text-red-200">
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Loader2 size={18} className="text-[#42adc6] animate-spin" />
              <span className="text-[#42adc6] font-medium">AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="mt-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prompt Input */}
            <div className="relative mb-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt here..."
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#448cac] focus:border-transparent min-h-[120px] max-h-[300px]"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                {prompt.length}/2000
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setResponse('')}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Clear Response
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-[#448cac] hover:bg-[#42adc6] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Run Prompt
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;