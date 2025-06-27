import { Send, Loader2 } from 'lucide-react';
const Prompt =({handleSubmit,setPrompt, prompt, handleKeyPress, isLoading})=>{
    return(
         <div className="mt-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prompt Input */}
            <div className="relative mb-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt here..."
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#448cac] focus:border-transparent min-h-[100px] max-h-[300px]"
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
    )
}

export default Prompt;