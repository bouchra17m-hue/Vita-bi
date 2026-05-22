const WaitlistModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Join the Waitlist</span>
        </div>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--on-background)', lineHeight: 1.1 }}>
          Be the first to experience VitaBi & get 14 days free trial
        </h2>

        <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Sign up for our waitlist to get early access to VitaBi, the all-in-one health management system that streamlines your wellness journey and enhances your daily performance. Join now and be among the first to revolutionize your lifestyle with VitaBi!
        </p>

        <form style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            style={{ 
              flex: 1, 
              minWidth: '200px', 
              padding: '1rem 1.5rem', 
              borderRadius: '9999px', 
              border: '2px solid var(--outline-variant)', 
              outline: 'none' 
            }} 
          />
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem 2.5rem', borderRadius: '9999px', fontWeight: 900 }}
            onClick={onClose}
          >
            Join Waitlist
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaitlistModal;
