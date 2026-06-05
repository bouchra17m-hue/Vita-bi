import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../useCart';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, totalAmount }) => {
  const { user, token } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');

  // UI/Flow states
  const [focusedField, setFocusedField] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'failed'
  const [errors, setErrors] = useState({});
  const [failureReason, setFailureReason] = useState('');

  // Auto-fill user name if logged in
  useEffect(() => {
    if (user && user.name) {
      setCardName(user.name.toUpperCase());
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && (!user || !token)) {
      alert('Veuillez vous inscrire ou vous connecter pour passer une commande.');
      onClose();
      navigate('/login');
    }
  }, [isOpen, navigate, onClose, token, user]);

  if (!isOpen) return null;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month < 1 || month > 12) {
        setErrors(prev => ({ ...prev, expiry: 'Mois invalide' }));
      } else {
        setErrors(prev => ({ ...prev, expiry: '' }));
      }
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  // Format CVV (max 3 digits)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
  };

  // Get Card Type based on first digit
  const getCardType = () => {
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (cleanNum.startsWith('5')) return 'mastercard';
    if (cleanNum.startsWith('3')) return 'amex';
    return 'default';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cardName.trim()) newErrors.cardName = 'Nom requis';
    if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)';
    
    const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryPattern.test(expiry)) newErrors.expiry = 'Format MM/YY requis';
    
    if (cvv.length !== 3) newErrors.cvv = 'CVV requis (3 chiffres)';
    if (!address.trim()) newErrors.address = 'Adresse requise';
    if (!city.trim()) newErrors.city = 'Ville requise';
    if (!zipCode.trim()) newErrors.zipCode = 'Code postal requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      alert('Veuillez vous inscrire ou vous connecter pour passer une commande.');
      onClose();
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    // Step 1: Show Premium Processing animation
    setPaymentStep('processing');

    // Simulate 2 seconds of bank secure processing
    setTimeout(async () => {
      try {
        const data = await createOrder(token, {
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity || 1,
            price: item.price
          })),
          address,
          city,
          zip_code: zipCode,
          phone,
          card_name: cardName,
          card_number: cardNumber.replace(/\s/g, ''),
          expiry: expiry
        });

        setPaymentStep('success');
        clearCart();
        setTimeout(() => {
          onClose();
          navigate('/profile');
        }, 2500);
      } catch (err) {
        setFailureReason(err.message || 'Erreur lors du traitement du paiement');
        setPaymentStep('failed');
      }
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay">
      <div className={`payment-modal-content ${paymentStep === 'success' ? 'success-theme' : ''}`}>
        
        {paymentStep !== 'success' && (
          <button className="payment-modal-close" onClick={onClose} aria-label="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}

        {paymentStep === 'form' && (
          <>
            <div className="payment-modal-header">
              <span className="secure-badge">
                <span className="material-symbols-outlined">lock</span>
                Paiement Sécurisé SSL
              </span>
              <h2>Confirmer la Commande</h2>
              <p>Complétez vos détails de livraison et de paiement pour finaliser votre commande de <strong>{totalAmount}€</strong>.</p>
            </div>

            <div className="payment-modal-body">
              {/* Left Column: Virtual Credit Card Visualization */}
              <div className="card-viz-container">
                <div className={`virtual-card ${getCardType()} ${focusedField === 'cvv' ? 'flipped' : ''}`}>
                  <div className="virtual-card-front">
                    <div className="card-chip"></div>
                    <div className="card-logo-slot">
                      {getCardType() === 'visa' && <span className="card-brand visa-logo">VISA</span>}
                      {getCardType() === 'mastercard' && <span className="card-brand mastercard-logo">Mastercard</span>}
                      {getCardType() === 'amex' && <span className="card-brand amex-logo">AMEX</span>}
                      {getCardType() === 'default' && <span className="card-brand default-logo">VitaBi Pay</span>}
                    </div>
                    <div className="card-number-display">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-info-row">
                      <div className="card-holder-display">
                        <span className="label">Titulaire</span>
                        <span className="value">{cardName.toUpperCase() || 'VOTRE NOM'}</span>
                      </div>
                      <div className="card-expiry-display">
                        <span className="label">Expire</span>
                        <span className="value">{expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="virtual-card-back">
                    <div className="card-magnetic-strip"></div>
                    <div className="card-signature-area">
                      <span className="cvv-value">{cvv || '•••'}</span>
                    </div>
                    <div className="card-back-branding">VitaBi Security</div>
                  </div>
                </div>

                <div className="order-summary-box">
                  <h3>Résumé de la commande</h3>
                  <div className="summary-items">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="summary-item">
                        <span>{item.name}</span>
                        <span className="price">{item.price}€</span>
                      </div>
                    ))}
                  </div>
                  <div className="summary-total">
                    <span>Total à payer</span>
                    <span className="total-price">{totalAmount}€</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Form */}
              <form className="payment-form" onSubmit={handleSubmit}>
                <h3 className="section-title">Adresse de Livraison</h3>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Adresse de livraison</label>
                    <input 
                      type="text" 
                      className={`form-input ${errors.address ? 'has-error' : ''}`}
                      placeholder="123 Rue de la Musculation"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); if(errors.address) setErrors(prev => ({...prev, address: ''})); }}
                      required
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>Ville</label>
                    <input 
                      type="text" 
                      className={`form-input ${errors.city ? 'has-error' : ''}`}
                      placeholder="Paris"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); if(errors.city) setErrors(prev => ({...prev, city: ''})); }}
                      required
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>Code Postal</label>
                    <input 
                      type="text" 
                      className={`form-input ${errors.zipCode ? 'has-error' : ''}`}
                      placeholder="75001"
                      value={zipCode}
                      onChange={(e) => { setZipCode(e.target.value); if(errors.zipCode) setErrors(prev => ({...prev, zipCode: ''})); }}
                      required
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>

                  <div className="form-group span-2">
                    <label>Numéro de téléphone</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <h3 className="section-title" style={{ marginTop: '1.5rem' }}>Informations de Paiement</h3>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Nom sur la carte</label>
                    <input 
                      type="text" 
                      className={`form-input uppercase-input ${errors.cardName ? 'has-error' : ''}`}
                      placeholder="JEAN DUPONT"
                      value={cardName}
                      onChange={(e) => { setCardName(e.target.value.toUpperCase()); if(errors.cardName) setErrors(prev => ({...prev, cardName: ''})); }}
                      onFocus={() => setFocusedField('cardName')}
                      onBlur={() => setFocusedField('')}
                      required
                    />
                    {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                  </div>

                  <div className="form-group span-2">
                    <label>Numéro de carte</label>
                    <div className="input-with-icon">
                      <input 
                        type="text" 
                        className={`form-input ${errors.cardNumber ? 'has-error' : ''}`}
                        placeholder="4532 7182 9381 2309"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onFocus={() => setFocusedField('cardNumber')}
                        onBlur={() => setFocusedField('')}
                        required
                      />
                      <span className="material-symbols-outlined input-icon">credit_card</span>
                    </div>
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Date d'expiration</label>
                    <input 
                      type="text" 
                      className={`form-input ${errors.expiry ? 'has-error' : ''}`}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocusedField('expiry')}
                      onBlur={() => setFocusedField('')}
                      required
                    />
                    {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV (Code secret)</label>
                    <input 
                      type="password" 
                      className={`form-input ${errors.cvv ? 'has-error' : ''}`}
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      onFocus={() => setFocusedField('cvv')}
                      onBlur={() => setFocusedField('')}
                      required
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary payment-submit-btn">
                  <span className="material-symbols-outlined">shield_with_heart</span>
                  Payer {totalAmount}€ & Confirmer
                </button>

                <p className="payment-disclaimer">
                  En cliquant sur confirmer, vous acceptez d'autoriser la transaction sécurisée de test simulée sur VitaBi.
                </p>
              </form>
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="payment-processing-screen">
            <div className="spinner-container">
              <div className="premium-spinner"></div>
              <span className="material-symbols-outlined spinner-lock">lock</span>
            </div>
            <h2>Sécurisation de la transaction</h2>
            <p>Nous contactons votre établissement bancaire pour valider le paiement. Veuillez ne pas fermer cette fenêtre...</p>
            <div className="security-labels">
              <span><span className="material-symbols-outlined">verified_user</span> 3D Secure 2.0</span>
              <span><span className="material-symbols-outlined">gpp_good</span> Certifié PCI-DSS</span>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="payment-success-screen">
            <div className="success-checkmark-container">
              <div className="success-checkmark-ring"></div>
              <span className="material-symbols-outlined success-check-icon">check_circle</span>
            </div>
            <h2 className="animate-fade-up">Paiement Réussi !</h2>
            <p className="animate-fade-up">Votre transaction a été approuvée avec succès. Votre commande a été enregistrée.</p>
            <div className="success-details animate-fade-up">
              <div className="detail-row">
                <span>Montant payé</span>
                <strong>{totalAmount}€</strong>
              </div>
              <div className="detail-row">
                <span>Statut de la commande</span>
                <span className="badge-completed">Complétée</span>
              </div>
            </div>
            <p className="redirect-hint animate-fade-up">Redirection vers votre profil dans quelques instants...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
