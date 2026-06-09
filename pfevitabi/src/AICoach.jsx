import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { sendMessageToAI, buildSystemPrompt, saveChatHistory, getChatHistory, clearChatHistory } from './services/aiCoachService';
import './AICoach.css';

const AICoach = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! 👋 Je suis votre coach VitaBi AI. Prêt à transformer votre journée ? Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Charger l'historique au démarrage
  useEffect(() => {
    const savedHistory = getChatHistory();
    if (savedHistory.length > 0) {
      setMessages(savedHistory);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Sauvegarder l'historique quand les messages changent
  useEffect(() => {
    if (messages.length > 1) {
      saveChatHistory(messages);
    }
  }, [messages]);

  useEffect(() => {
    const openCoach = () => setIsOpen(true);
    window.addEventListener('vitabi:open-ai-coach', openCoach);
    return () => window.removeEventListener('vitabi:open-ai-coach', openCoach);
  }, []);

  // Construire le contexte utilisateur
  const getUserContext = () => {
    if (!user) return null;
    
    // Essayer de récupérer le programme généré
    const programData = localStorage.getItem('vitabi-programs');
    let program = null;
    if (programData) {
      try {
        const programs = JSON.parse(programData);
        program = programs[programs.length - 1];
      } catch (e) {
        console.log('Impossible de charger le programme');
      }
    }

    return {
      name: user?.name || 'Utilisateur',
      goal: program?.profile?.goal || null,
      weight: program?.profile?.weight || null,
      height: program?.profile?.height || null,
      age: program?.profile?.age || null,
      experience: program?.profile?.experience || null,
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setError('');
    setIsLoading(true);

    try {
      // Préparer les messages pour l'API
      const messagesForAPI = newMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const userContext = getUserContext();
      
      // Appeler l'API AI
      const response = await sendMessageToAI(messagesForAPI, userContext);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    } catch (err) {
      setIsTyping(false);
      setError('Erreur de connexion avec le coach. Vérifiez votre connexion.');
      console.error('Erreur AI:', err);
      
      // Message de fallback
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Je rencontre une petite difficulté. Essayez de reformuler votre question ou contactez le support.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (window.confirm('Êtes-vous sûr ? Cela supprimera l\'historique du chat.')) {
      clearChatHistory();
      setMessages([
        { role: 'assistant', content: 'Bonjour ! 👋 Je suis votre coach VitaBi AI. Prêt à transformer votre journée ? Comment puis-je vous aider aujourd\'hui ?' }
      ]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                <h3>VitaBi Coach AI</h3>
                <p><span className="status-dot"></span> En ligne</p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button 
                className="chat-menu-btn"
                title="Nouveau chat"
                onClick={handleNewChat}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <button 
                className="chat-menu-btn"
                title="Fermer"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="chat-error">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble assistant typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="Posez votre question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              title={isLoading ? 'Attente de la réponse...' : 'Envoyer'}
            >
              {isLoading ? (
                <span className="material-symbols-outlined">schedule</span>
              ) : (
                <span className="material-symbols-outlined">send</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AICoach;
