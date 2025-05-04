import { useState, useEffect, useRef } from 'react';
import { IconSend, IconRobot, IconUser, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import { sendAiChatMessage } from '../../utils/services/dashboardService';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/helpers';

/**
 * AI Chatbot page
 */
export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: Date.now() / 1000
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Prepare chat history for API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send message to API
      const response = await sendAiChatMessage(inputValue, history);
      
      if (response.success) {
        const botMessage = {
          id: Date.now().toString(),
          content: response.data.message || "I'm sorry, I couldn't process your request.",
          role: 'assistant',
          timestamp: Date.now() / 1000
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now().toString(),
          content: 'Sorry, I encountered an error processing your request. Please try again later.',
          role: 'assistant',
          error: true,
          timestamp: Date.now() / 1000
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Sorry, there was an error communicating with the server.',
        role: 'assistant',
        error: true,
        timestamp: Date.now() / 1000
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GCP Certification AI Assistant</h1>
            <p className="mt-1 text-sm text-gray-500">Get help with your certification preparation</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<IconTrash size={16} />}
              onClick={handleClearChat}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-medium text-gray-900 mb-4">How to use the AI Assistant</h3>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start">
                <IconInfoCircle size={16} className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                <p>Ask specific questions about GCP services and certification topics</p>
              </div>
              
              <div className="flex items-start">
                <IconInfoCircle size={16} className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                <p>Request explanations for GCP concepts you're struggling with</p>
              </div>
              
              <div className="flex items-start">
                <IconInfoCircle size={16} className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                <p>Get help with practice test questions you're unsure about</p>
              </div>
              
              <div className="flex items-start">
                <IconInfoCircle size={16} className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                <p>Ask for study recommendations tailored to your certification goal</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Example Questions</h4>
              
              <div className="space-y-2">
                <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  "Explain the difference between Cloud Storage and Cloud Filestore"
                </p>
                <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  "What are the key benefits of Google Kubernetes Engine?"
                </p>
                <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  "How should I prepare for the Cloud Engineer certification exam?"
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="lg:col-span-3 flex flex-col h-[calc(100vh-300px)]">
          <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center max-w-md">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <IconRobot size={28} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      GCP Certification AI Assistant
                    </h3>
                    <p className="text-gray-500 mb-6">
                      I'm here to help with your Google Cloud certification preparation.
                      Ask me any questions about GCP services, concepts, or exam preparation!
                    </p>
                  </div>
                </div>
              )}
              
              {/* Chat messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.error
                        ? 'bg-red-50 border border-red-200 text-gray-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-1.5 rounded-full mr-2 ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : message.error
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {message.role === 'user' 
                          ? <IconUser size={14} /> 
                          : <IconRobot size={14} />
                        }
                      </div>
                      <div>
                        <p className={`text-xs font-medium mb-1 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.role === 'user' ? 'You' : 'GCP Assistant'} · {formatDate(message.timestamp * 1000, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3/4 rounded-lg p-4 bg-gray-100 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                        <IconRobot size={14} />
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        GCP Assistant is typing...
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <textarea
                  className="flex-1 resize-none rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message here..."
                  rows={1}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  variant="primary"
                  className="ml-3"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  isLoading={isLoading}
                  rightIcon={<IconSend size={16} />}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Chat.getLayout = getDashboardLayout;