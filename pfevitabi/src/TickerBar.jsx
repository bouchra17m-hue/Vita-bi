const TickerBar = () => {
  const items = [
    { icon: 'bolt', text: 'SYSTÈME ACTIF' },
    { icon: 'trending_up', text: '+12% PERFORMANCE' },
    { icon: 'favorite', text: '72 BPM MOYEN' },
    { icon: 'electric_bolt', text: '2.4K KCAL BRÛLÉES' },
    { icon: 'bolt', text: 'SYSTÈME ACTIF' },
    { icon: 'trending_up', text: '+12% PERFORMANCE' },
    { icon: 'favorite', text: '72 BPM MOYEN' },
    { icon: 'electric_bolt', text: '2.4K KCAL BRÛLÉES' },
  ];

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items.concat(items).map((item, index) => (
          <div key={index} className="ticker-item">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
