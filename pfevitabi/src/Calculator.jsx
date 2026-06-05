import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Calculator.css';
import Footer from './Footer';


const STORAGE_KEY = 'vitabi-programs';
const ACTIVITY_FACTOR = 1.5;

const activityOptions = {
  low: { label: 'Low Activity', factor: 1.35 },
  moderate: { label: 'Moderate Activity', factor: 1.5 },
  high: { label: 'High Activity', factor: 1.7 },
};

const experienceOptions = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const Calculator = () => {
  const { user, token } = useAuth();
  const [gender, setGender] = useState('male');
  const [goal, setGoal] = useState('muscle_gain');
  const [activity, setActivity] = useState('moderate');
  const [experience, setExperience] = useState('beginner');
  const [trainingDays, setTrainingDays] = useState('4');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedProgram, setGeneratedProgram] = useState(null);

  const profileKey = useMemo(
    () => `${gender}-${goal}-${activity}-${experience}-${trainingDays}-${age || 'na'}-${weight || 'na'}-${height || 'na'}`,
    [gender, goal, activity, experience, trainingDays, age, weight, height],
  );

  const program = useMemo(() => {
    const rawPrograms = localStorage.getItem(STORAGE_KEY);
    if (!rawPrograms) return null;
    try {
      const savedPrograms = JSON.parse(rawPrograms);
      return savedPrograms[profileKey] || null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, [profileKey]);

  const displayedProgram =
    generatedProgram && generatedProgram.profileKey === profileKey
      ? generatedProgram.data
      : program;

  const validateInputs = () => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weight);
    const parsedHeight = Number(height);

    if (!parsedAge || !parsedWeight || !parsedHeight) {
      setError('Veuillez remplir tous les champs biométriques.');
      return null;
    }

    if (parsedAge < 12 || parsedAge > 90) {
      setError('L age doit etre comprise entre 12 et 90 ans.');
      return null;
    }

    if (parsedWeight < 30 || parsedWeight > 250) {
      setError('Le poids doit etre compris entre 30 et 250 kg.');
      return null;
    }

    if (parsedHeight < 120 || parsedHeight > 230) {
      setError('La taille doit etre comprise entre 120 et 230 cm.');
      return null;
    }

    const parsedTrainingDays = Number(trainingDays);
    if (parsedTrainingDays < 2 || parsedTrainingDays > 6) {
      setError('Choisissez entre 2 et 6 jours d entrainement par semaine.');
      return null;
    }

    setError('');
    return { parsedAge, parsedWeight, parsedHeight, parsedTrainingDays };
  };

  const buildProgram = ({ parsedAge, parsedWeight, parsedHeight, parsedTrainingDays }) => {
    const bmr =
      gender === 'male'
        ? 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + 5
        : 10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge - 161;

    const activityFactor = activityOptions[activity].factor;
    const baseCalories = bmr * activityFactor;
    const targetCalories =
      goal === 'weight_loss' ? Math.round(baseCalories - 450) : Math.round(baseCalories + 350);

    const protein = Math.round(parsedWeight * (goal === 'weight_loss' ? 2.1 : 2));
    const fat = Math.round(parsedWeight * (goal === 'weight_loss' ? 0.8 : 0.9));
    const carbs = Math.max(80, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
    const hydration = Math.round(parsedWeight * 35);
    const cardioMinutes = goal === 'weight_loss' ? 25 : 12;
    const steps = goal === 'weight_loss' ? 9500 : 7500;

    const trainingAdvice =
      goal === 'weight_loss'
        ? `Cardio + renforcement ${parsedTrainingDays} fois/semaine, avec ${cardioMinutes} min de cardio sur les jours actifs.`
        : `Musculation ${parsedTrainingDays} fois/semaine, focus surcharge progressive et exercices polyarticulaires.`;

    const nutritionAdvice =
      goal === 'weight_loss'
        ? `Deficit controle, ${protein}g de proteines, fibres elevees et glucides places autour de l entrainement.`
        : `Apport riche en proteines (${protein}g/jour), glucides complexes et collation post-training.`;

    const workoutTemplates = {
      muscle_gain: ['Upper Body Strength', 'Lower Body Strength', 'Push Hypertrophy', 'Pull + Core', 'Legs + Glutes', 'Full Body Pump'],
      weight_loss: ['Full Body Circuit', 'Zone 2 Cardio', 'Strength + HIIT', 'Core + Mobility', 'Metabolic Conditioning', 'Active Recovery'],
    };
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyPlan = workoutTemplates[goal].slice(0, parsedTrainingDays).map((title, index) => ({
      day: weekDays[index],
      title,
      duration: goal === 'weight_loss' ? '45-55 min' : '50-70 min',
      focus: index % 2 === 0 ? 'Technique + intensity' : 'Volume + control',
    }));

    const progression =
      experience === 'advanced'
        ? 'Increase load 2-5% when all sets feel controlled; add one intensity technique per week.'
        : experience === 'intermediate'
          ? 'Add 1-2 reps each week, then increase weight when the top rep range feels clean.'
          : 'Master form first; keep 2 reps in reserve and progress slowly every 7-10 days.';

    const nextProgram = {
      profile: {
        age: parsedAge,
        weight: parsedWeight,
        height: parsedHeight,
        gender,
        goal,
        activity,
        experience,
        trainingDays: parsedTrainingDays,
      },
      bmr: Math.round(bmr),
      activityFactor,
      targetCalories,
      macros: {
        protein,
        carbs,
        fat,
      },
      hydration,
      steps,
      cardioMinutes,
      weeklyPlan,
      progression,
      trainingAdvice,
      nutritionAdvice,
      generatedAt: new Date().toISOString(),
    };

    return nextProgram;
  };

  const handleGenerate = () => {
    const validated = validateInputs();
    if (!validated) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      const nextProgram = buildProgram(validated);

      const rawPrograms = localStorage.getItem(STORAGE_KEY);
      let savedPrograms;
      try {
        savedPrograms = rawPrograms ? JSON.parse(rawPrograms) : {};
      } catch {
        savedPrograms = {};
      }
      savedPrograms[profileKey] = nextProgram;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPrograms));
      setGeneratedProgram({ profileKey, data: nextProgram });
      setIsLoading(false);
    }, 700);
  };

  const completion = Math.round(([age, weight, height].filter(Boolean).length + 3) / 6 * 100);
  const goalLabel = goal === 'weight_loss' ? 'Weight Loss' : 'Muscle Gain';
  const isAuthenticated = Boolean(user && token);

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen text-on-surface">
        <main className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
          <section className="calculator-auth-gate">
            <span className="material-symbols-outlined" aria-hidden="true">lock</span>
            <p className="mini-title">Programme personnalise</p>
            <h1>Connectez-vous pour utiliser le calculateur</h1>
            <p>
              Creez un compte ou connectez-vous pour saisir vos informations et generer votre programme VitaBi.
            </p>
            <div className="calculator-auth-actions">
              <Link className="btn btn-primary" to="/register">S'inscrire</Link>
              <Link className="btn" to="/login">Se connecter</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <main className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        {/* Hero Section */}
        <header className="calc-header">
          <span className="step-badge">Step 1 of 2</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginTop: '1.5rem', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Fuel Your <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Vibrancy</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', maxWidth: '42rem', margin: '0 auto' }}>
            Calculate your personalized nutrition and workout roadmap tailored to your unique body and ambitious goals.
          </p>
        </header>

        {/* Progress Tracker */}
        <div className="progress-tracker">
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>Biometric Profile</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--on-surface-variant)' }}>{completion}% Complete</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${completion}%` }}></div>
          </div>
        </div>

        {/* Input Form Bento Grid */}
        <section className="bento-grid-calc">
          {/* Left Panel: Biometrics */}
          <div className="bento-panel-left white-card">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>accessibility_new</span>
              Personal Details
            </h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Age</label>
                <input className="input-pill" placeholder="25" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Gender</label>
                <div className="flex gap-4">
                  <button className={`btn ${gender === 'male' ? 'btn-primary' : ''}`} style={{ flex: 1, padding: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: gender === 'male' ? '' : 'var(--surface-container-high)' }} onClick={() => setGender('male')}>
                    <span className="material-symbols-outlined">male</span> Male
                  </button>
                  <button className={`btn ${gender === 'female' ? 'btn-primary' : ''}`} style={{ flex: 1, padding: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: gender === 'female' ? '' : 'var(--surface-container-high)' }} onClick={() => setGender('female')}>
                    <span className="material-symbols-outlined">female</span> Female
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Weight (kg)</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-pill" placeholder="70" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  <span style={{ position: 'absolute', right: '1.5rem', top: '1rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>kg</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Height (cm)</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-pill" placeholder="175" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  <span style={{ position: 'absolute', right: '1.5rem', top: '1rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>cm</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Activity Level</label>
                <select className="input-pill" value={activity} onChange={(e) => setActivity(e.target.value)}>
                  {Object.entries(activityOptions).map(([key, option]) => (
                    <option key={key} value={key}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Training Days</label>
                <select className="input-pill" value={trainingDays} onChange={(e) => setTrainingDays(e.target.value)}>
                  {[2, 3, 4, 5, 6].map((dayCount) => (
                    <option key={dayCount} value={dayCount}>{dayCount} days / week</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Panel: Goal Selection */}
          <div className="bento-panel-right flex flex-col gap-6">
            <div className="experience-card white-card">
              <p className="mini-title">Training Level</p>
              <div className="experience-options">
                {Object.entries(experienceOptions).map(([key, label]) => (
                  <button
                    key={key}
                    className={`experience-option ${experience === key ? 'active' : ''}`}
                    type="button"
                    onClick={() => setExperience(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="goal-card-new" style={{ backgroundColor: 'var(--secondary-container)', border: goal === 'muscle_gain' ? '2px solid var(--secondary)' : '2px solid transparent', cursor: 'pointer' }} onClick={() => setGoal('muscle_gain')}>
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--secondary)', fontVariationSettings: goal === 'muscle_gain' ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: goal === 'muscle_gain' ? 'var(--secondary)' : 'transparent' }}>
                  {goal === 'muscle_gain' && <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white' }}>check</span>}
                </div>
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-secondary-container)' }}>Muscle Gain</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-secondary-fixed-variant)', marginTop: '0.5rem', lineHeight: 1.5 }}>Focus on protein-rich meals and progressive strength training to build lean mass.</p>
            </div>
            <div className="goal-card-new" style={{ backgroundColor: 'var(--tertiary-container)', border: goal === 'weight_loss' ? '2px solid var(--tertiary)' : '2px solid transparent', cursor: 'pointer' }} onClick={() => setGoal('weight_loss')}>
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--tertiary)', fontVariationSettings: goal === 'weight_loss' ? "'FILL' 1" : "'FILL' 0" }}>eco</span>
                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '2px solid var(--tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: goal === 'weight_loss' ? 'var(--tertiary)' : 'transparent' }}>
                  {goal === 'weight_loss' && <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white' }}>check</span>}
                </div>
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-tertiary-container)' }}>Weight Loss</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-tertiary-fixed-variant)', marginTop: '0.5rem', lineHeight: 1.5 }}>Caloric deficit nutrition plans combined with high-intensity metabolic conditioning.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {error && (
          <p className="calc-error" role="alert">{error}</p>
        )}

        <div className="flex justify-center mb-24">
          <button className="btn btn-primary" style={{ fontSize: '1.25rem', fontWeight: 900, padding: '1.25rem 3rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={handleGenerate}>
            {isLoading ? (
              <>
                <span className="loader" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              <>
                Generate My Program
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>

        {/* Program Preview Section */}
        <div className="pulse-section">
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '200px', fontVariationSettings: "'FILL' 1" }}>monitoring</span>
          </div>
          <div className="relative z-10 pulse-grid">
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '1.5rem' }}>Your Daily Pulse</h2>
              <div className="flex flex-col gap-8">
                {/* Meal Breakdown */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <h5 className="font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>restaurant</span>
                      Daily Calories
                    </h5>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {displayedProgram ? `${displayedProgram.targetCalories} kcal` : '-- kcal'}
                    </span>
                  </div>
                  <div className="flex gap-2" style={{ height: '1rem' }}>
                    <div style={{ flex: 25, backgroundColor: 'var(--primary)', borderRadius: '9999px' }} title="Breakfast - 600kcal"></div>
                    <div style={{ flex: 40, backgroundColor: 'var(--secondary)', borderRadius: '9999px' }} title="Lunch - 1000kcal"></div>
                    <div style={{ flex: 35, backgroundColor: 'var(--tertiary)', borderRadius: '9999px' }} title="Dinner - 850kcal"></div>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)' }}>
                    <span>BMR: {displayedProgram ? `${displayedProgram.bmr}` : '--'}</span>
                    <span>Factor: x{displayedProgram ? displayedProgram.activityFactor : ACTIVITY_FACTOR}</span>
                    <span>{goalLabel}</span>
                  </div>
                </div>
                {displayedProgram && (
                  <div className="macro-grid">
                    <div>
                      <span>Protein</span>
                      <strong>{displayedProgram.macros.protein}g</strong>
                    </div>
                    <div>
                      <span>Carbs</span>
                      <strong>{displayedProgram.macros.carbs}g</strong>
                    </div>
                    <div>
                      <span>Fat</span>
                      <strong>{displayedProgram.macros.fat}g</strong>
                    </div>
                  </div>
                )}
                {/* Workout Suggestion Card */}
                <div className="glass-card-new">
                  <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--primary-fixed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.875rem', fontVariationSettings: "'FILL' 1" }}>timer</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Training Program</p>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {displayedProgram ? goalLabel : 'Generate to unlock'}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                      {displayedProgram ? displayedProgram.trainingAdvice : 'Complete your profile and generate your personalized plan.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Visual Data Visualization */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-8">
                <h4 style={{ fontWeight: 900, fontSize: '1.125rem', fontStyle: 'italic' }}>Nutrition Guide</h4>
                <div className="flex gap-2">
                  <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>
                  <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: '50%' }}></div>
                </div>
              </div>
              <div className="nutrition-tips-card">
                {displayedProgram ? (
                  <>
                    <p className="nutrition-tips-title">Nutrition Tips</p>
                    <p className="nutrition-tips-text">{displayedProgram.nutritionAdvice}</p>
                    <div className="advanced-metrics">
                      <span><strong>{displayedProgram.hydration} ml</strong> water</span>
                      <span><strong>{displayedProgram.steps}</strong> steps</span>
                      <span><strong>{displayedProgram.cardioMinutes} min</strong> cardio</span>
                    </div>
                    <p className="nutrition-tips-meta">
                      Last update: {new Date(displayedProgram.generatedAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="nutrition-tips-title">Nutrition Tips</p>
                    <p className="nutrition-tips-text">
                      Cliquez sur "Generate My Program" pour afficher vos conseils nutrition personnalises.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {displayedProgram && (
            <div className="advanced-program">
              <div className="advanced-panel">
                <div className="advanced-panel-header">
                  <div>
                    <p className="mini-title">Weekly Plan</p>
                    <h3>{displayedProgram.profile.trainingDays} day training roadmap</h3>
                  </div>
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div className="week-plan">
                  {displayedProgram.weeklyPlan.map((day) => (
                    <div className="week-card" key={`${day.day}-${day.title}`}>
                      <span>{day.day}</span>
                      <h4>{day.title}</h4>
                      <p>{day.duration}</p>
                      <small>{day.focus}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="advanced-panel compact">
                <p className="mini-title">Progression Rule</p>
                <h3>{experienceOptions[displayedProgram.profile.experience]}</h3>
                <p>{displayedProgram.progression}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calculator;
