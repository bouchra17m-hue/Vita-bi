import { useState, useEffect, useRef } from 'react';
import './AICoach.css';

const AICoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre coach VitaBi AI. Prête à transformer votre journée ? Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const openCoach = () => setIsOpen(true);
    window.addEventListener('vitabi:open-ai-coach', openCoach);
    return () => window.removeEventListener('vitabi:open-ai-coach', openCoach);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let response = "C'est une excellente question ! En tant que coach VitaBi, je vous recommande de vous concentrer sur une hydratation optimale et un apport équilibré en protéines pour soutenir vos objectifs.";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('faim') || lowerInput.includes('manger') || lowerInput.includes('recette')) {
        response = "Pour une collation saine, je vous suggère un Pudding de Chia aux baies ou une Omelette Avocat & Épinards. C'est parfait pour l'énergie !";
      } else if (lowerInput.includes('sport') || lowerInput.includes('exercice') || lowerInput.includes('entrainement')) {
        response = "Une séance de 20 minutes de HIIT est idéale pour booster votre métabolisme. N'oubliez pas de bien vous étirer après !";
      } else if (lowerInput.includes('calcul') || lowerInput.includes('imc') || lowerInput.includes('calories')) {
        response = "Utilisez notre Calculateur Intelligent dans l'onglet 'Calculator' pour obtenir vos besoins précis. Je peux ensuite vous aider à planifier vos repas !";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`ai-coach-wrapper ${isOpen ? 'is-open' : ''}`}>
      {/* Floating Button */}
      <button 
        className="ai-coach-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        title="Parler au Coach AI"
      >
        <div className="trigger-icon">
          {isOpen ? (
            <span className="material-symbols-outlined">close</span>
          ) : (
            <span className="material-symbols-outlined">smart_toy</span>
          )}
        </div>
        {!isOpen && <div className="trigger-pulse"></div>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
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
          </div>

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

          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="Posez votre question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
