import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  "How do I book an appointment?",
  "What are the OPD timings?",
  "How can I check my queue position?",
  "Which doctor should I see for fever?",
  "How to download my prescription?",
  "What departments are available?",
];

const AIChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! I'm MediQueue AI Assistant 👋\n\nI can help you with:\n• Booking appointments\n• Checking queue status\n• Understanding your prescriptions\n• Finding the right department\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Build conversation history for context
    const conversationHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const response = await axios.post('/ai/chat', {
        message: messageText,
        conversationHistory,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.data.reply || response.data.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch (error) {
      // Graceful fallback if not logged in or API fails
      const fallbackResponses = {
        appointment: "To book an appointment, go to 'Book Appointment' in your patient dashboard. You can select department, doctor, date, and available time slots!",
        queue: "You can check your live queue position in the 'My Queue' section of your dashboard. It updates in real-time!",
        prescription: "Your prescriptions are available in 'Medical History' → 'Prescriptions' tab. You can view all details there.",
        doctor: "We have specialists in Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, ENT, Ophthalmology, Gynecology, and Psychiatry.",
        default: "I'm here to help! Please log in to access all features. You can book appointments, check your queue, view prescriptions, and much more.",
      };

      const lowerText = messageText.toLowerCase();
      let fallback = fallbackResponses.default;
      if (lowerText.includes('appointment') || lowerText.includes('book')) fallback = fallbackResponses.appointment;
      else if (lowerText.includes('queue') || lowerText.includes('token')) fallback = fallbackResponses.queue;
      else if (lowerText.includes('prescription') || lowerText.includes('medicine')) fallback = fallbackResponses.prescription;
      else if (lowerText.includes('doctor') || lowerText.includes('specialist')) fallback = fallbackResponses.doctor;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: fallback,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={styles.floatingBtn}
            title="Chat with AI Assistant"
          >
            {/* Pulse ring */}
            <span style={styles.pulseRing} />
            <span style={styles.pulseRing2} />

            <MessageCircle size={26} color="white" />

            {hasNewMessage && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={styles.notificationDot}
              />
            )}

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              style={styles.tooltip}
            >
              <Sparkles size={12} />
              Ask AI
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={styles.chatWindow}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.avatarContainer}>
                  <Bot size={20} color="white" />
                  <span style={styles.onlineDot} />
                </div>
                <div>
                  <p style={styles.headerTitle}>MediQueue AI</p>
                  <p style={styles.headerSubtitle}>
                    <span style={styles.onlineDotSmall} /> Online · Powered by Gemini
                  </p>
                </div>
              </div>
              <div style={styles.headerActions}>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={styles.iconBtn}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={styles.iconBtn}
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={styles.chatBody}
                >
                  {/* Messages */}
                  <div style={styles.messagesContainer}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        {msg.role === 'assistant' && (
                          <div style={styles.botAvatar}>
                            <Bot size={14} color="white" />
                          </div>
                        )}

                        <div style={{ maxWidth: '78%' }}>
                          <div
                            style={
                              msg.role === 'user'
                                ? styles.userBubble
                                : styles.botBubble
                            }
                          >
                            <p style={styles.messageText}>{formatText(msg.text)}</p>
                          </div>
                          <p
                            style={{
                              ...styles.timestamp,
                              textAlign: msg.role === 'user' ? 'right' : 'left',
                            }}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>

                        {msg.role === 'user' && (
                          <div style={styles.userAvatar}>
                            <User size={14} color="white" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.messageWrapper}
                      >
                        <div style={styles.botAvatar}>
                          <Bot size={14} color="white" />
                        </div>
                        <div style={styles.typingBubble}>
                          <span style={styles.typingDot} />
                          <span style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                          <span style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Prompts */}
                  {messages.length <= 1 && (
                    <div style={styles.quickPromptsContainer}>
                      <p style={styles.quickPromptsLabel}>Quick questions:</p>
                      <div style={styles.quickPrompts}>
                        {QUICK_PROMPTS.slice(0, 4).map((prompt, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => sendMessage(prompt)}
                            style={styles.quickPromptBtn}
                          >
                            {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div style={styles.inputArea}>
                    <div style={styles.inputWrapper}>
                      <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your health..."
                        style={styles.textarea}
                        rows={1}
                        disabled={isLoading}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage()}
                        disabled={!inputText.trim() || isLoading}
                        style={{
                          ...styles.sendBtn,
                          opacity: !inputText.trim() || isLoading ? 0.5 : 1,
                        }}
                      >
                        {isLoading ? (
                          <Loader size={18} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Send size={18} color="white" />
                        )}
                      </motion.button>
                    </div>
                    <p style={styles.poweredBy}>
                      <Sparkles size={10} /> Powered by Google Gemini AI
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </>
  );
};

const styles = {
  floatingBtn: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
    zIndex: 9999,
    position: 'fixed',
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.4)',
    animation: 'pulseRing 2s infinite',
  },
  pulseRing2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.2)',
    animation: 'pulseRing 2s infinite 0.5s',
  },
  notificationDot: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#ef4444',
    border: '2px solid #0f172a',
  },
  tooltip: {
    position: 'absolute',
    right: '70px',
    background: 'rgba(30,41,59,0.95)',
    color: '#f1f5f9',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: 'none',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '28px',
    width: '360px',
    maxHeight: 'calc(100vh - 130px)',   /* never goes above screen top */
    background: 'rgba(15, 23, 42, 0.97)',
    borderRadius: '20px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
    backdropFilter: 'blur(20px)',
    zIndex: 9998,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '1px',
    right: '1px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#10b981',
    border: '2px solid #6366f1',
  },
  headerTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: '15px',
    margin: 0,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '11px',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  onlineDotSmall: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
  },
  headerActions: {
    display: 'flex',
    gap: '4px',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  chatBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: 'calc(100vh - 320px)',  /* dynamic — fits any screen */
    minHeight: '120px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#334155 transparent',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  botAvatar: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botBubble: {
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '16px 16px 16px 4px',
    padding: '10px 14px',
  },
  userBubble: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(6,182,212,0.6))',
    borderRadius: '16px 16px 4px 16px',
    padding: '10px 14px',
  },
  messageText: {
    color: '#f1f5f9',
    fontSize: '13.5px',
    lineHeight: '1.5',
    margin: 0,
  },
  timestamp: {
    color: '#64748b',
    fontSize: '10px',
    marginTop: '4px',
  },
  typingBubble: {
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '16px 16px 16px 4px',
    padding: '12px 16px',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  typingDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#6366f1',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
  quickPromptsContainer: {
    padding: '0 16px 12px',
    borderTop: '1px solid rgba(51,65,85,0.5)',
    paddingTop: '12px',
  },
  quickPromptsLabel: {
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  quickPrompts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  quickPromptBtn: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: '#a5b4fc',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '11.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(51,65,85,0.5)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    background: 'rgba(30,41,59,0.8)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px',
    padding: '8px 8px 8px 14px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '13.5px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.5',
    maxHeight: '80px',
    overflowY: 'auto',
  },
  sendBtn: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    transition: 'opacity 0.2s',
  },
  poweredBy: {
    color: '#475569',
    fontSize: '10px',
    textAlign: 'center',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
};

export default AIChatAgent;
