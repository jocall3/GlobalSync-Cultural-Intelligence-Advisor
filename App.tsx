
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Globe, 
  LayoutDashboard, 
  BookOpen, 
  Settings as SettingsIcon, 
  User, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History,
  Info,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';

import { 
  IUserCulturalProfile, 
  ICulture, 
  IScenarioTemplate, 
  IActiveScenarioInstance, 
  ISystemSettings,
  CompleteInteractionFeedback
} from './types';
import { CULTURAL_PROFILES, SCENARIO_TEMPLATES, MOCK_USERS } from './constants';
import { processInteraction } from './services/gemini';

// --- Shared Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, onClick, className = "", variant = 'primary', disabled = false, type = 'button' }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50"
  };
  
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Badge: React.FC<{ text: string; severity?: string }> = ({ text, severity = 'Neutral' }) => {
  const colors: Record<string, string> = {
    Positive: 'bg-green-100 text-green-700 border-green-200',
    Negative: 'bg-red-100 text-red-700 border-red-200',
    Critical: 'bg-red-600 text-white border-red-700',
    Advisory: 'bg-amber-100 text-amber-700 border-amber-200',
    Neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[severity] || colors.Neutral}`}>
      {text}
    </span>
  );
};

// --- Views ---

const LoginView: React.FC<{ onLogin: (u: IUserCulturalProfile) => void }> = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md w-full">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Globe className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">GlobalSync</h1>
        <p className="text-slate-500 mt-2">Cultural Intelligence Simulation Platform</p>
      </div>
      <Card className="p-8">
        <h2 className="text-lg font-semibold mb-6 text-slate-800">Select an Identity</h2>
        <div className="space-y-4">
          {MOCK_USERS.map(user => (
            <button
              key={user.userId}
              onClick={() => onLogin(user)}
              className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100">
                <User className="text-slate-500 group-hover:text-blue-600" />
              </div>
              <div className="ml-4 text-left flex-1">
                <div className="font-semibold text-slate-900">{user.username}</div>
                <div className="text-xs text-slate-500">Origin: {user.originCultureId} • Score: {user.overallCompetence}%</div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-400" />
            </button>
          ))}
        </div>
      </Card>
      <p className="text-center text-xs text-slate-400 mt-8">
        All simulated interactions are governed by cultural guidelines.
      </p>
    </div>
  </div>
);

const Dashboard: React.FC<{ user: IUserCulturalProfile }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.username}</h2>
          <p className="text-slate-500">Your current global cultural competence is improving.</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{user.overallCompetence}%</div>
            <div className="text-xs text-slate-500 font-medium">Global Competence Index</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            Recent Cultural Scores
          </h3>
          <div className="space-y-4">
            {Object.entries(user.culturalCompetenceScore).map(([culture, score]) => (
              <div key={culture} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{culture}</span>
                  <span className="text-slate-500 font-medium">{score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Scenarios Completed</div>
                <div className="text-lg font-bold text-slate-900">12</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Learning Path</div>
                <div className="text-lg font-bold text-slate-900">4 / 10</div>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="w-full mt-8">View Reports</Button>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Recommended Simulations</h3>
          <Link to="/scenarios" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIO_TEMPLATES.slice(0, 3).map(template => (
            <Card key={template.id} className="p-5 flex flex-col group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <Badge text={template.difficulty} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{template.category}</span>
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{template.title}</h4>
              <p className="text-sm text-slate-500 mt-2 mb-6 line-clamp-2">{template.description}</p>
              <div className="mt-auto">
                <Link to={`/scenarios/${template.id}`}>
                  <Button className="w-full">Start Simulation <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const ScenarioSelection: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Simulations</h2>
        <p className="text-slate-500">Pick a scenario and target culture to begin your training session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {SCENARIO_TEMPLATES.map(template => (
            <Card key={template.id} className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge text={template.difficulty} />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{template.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{template.title}</h3>
                  <p className="text-slate-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.objectives.map(obj => (
                      <span key={obj} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" /> {obj}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="sm:w-64 border-l border-slate-100 sm:pl-6 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Select Target Culture</div>
                  <div className="grid grid-cols-1 gap-2">
                    {CULTURAL_PROFILES.map(culture => (
                      <Link 
                        key={culture.id} 
                        to={`/runner/${template.id}/${culture.id}`}
                        className="p-2 text-sm font-medium border border-slate-200 rounded-lg text-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                      >
                        {culture.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="p-6 bg-blue-600 text-white border-none">
            <h4 className="text-lg font-bold mb-2">Why Practice?</h4>
            <p className="text-blue-100 text-sm mb-4">
              90% of cross-border business failures are attributed to cultural misunderstandings rather than technical shortcomings.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Terminal className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Learn non-verbal cues</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Terminal className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Master negotiation nuances</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Terminal className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Avoid critical social faux pas</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ScenarioRunner: React.FC<{ 
  user: IUserCulturalProfile; 
  templateId: string; 
  cultureId: string;
  onUpdateCompetence: (impact: number, cultureId: string) => void;
}> = ({ user, templateId, cultureId, onUpdateCompetence }) => {
  const navigate = useNavigate();
  const template = useMemo(() => SCENARIO_TEMPLATES.find(t => t.id === templateId), [templateId]);
  const culture = useMemo(() => CULTURAL_PROFILES.find(c => c.id === cultureId), [cultureId]);
  
  const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string; feedback?: CompleteInteractionFeedback }[]>([]);
  const [userAction, setUserAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<CompleteInteractionFeedback | null>(null);

  useEffect(() => {
    if (!template || !culture) {
      navigate('/scenarios');
      return;
    }
    // Initial turn
    setHistory([{ role: 'model', content: template.initialSituation }]);
  }, [template, culture, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAction.trim() || isProcessing || !template || !culture) return;

    const actionText = userAction.trim();
    setUserAction('');
    setIsProcessing(true);

    try {
      const chatHistory = history.map(h => ({ role: h.role, content: h.content }));
      const result = await processInteraction(
        actionText, 
        chatHistory, 
        culture, 
        template, 
        user, 
        { darkMode: false, aiPersona: 'formal_advisor', feedbackVerbosity: 'detailed' }
      );

      setHistory(prev => [
        ...prev, 
        { role: 'user', content: actionText }, 
        { role: 'model', content: result.aiResponse, feedback: result }
      ]);
      setLastFeedback(result);
      onUpdateCompetence(result.competenceImpact, cultureId);

      if (history.length > 8) { // End session after a few turns
        setSessionCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!template || !culture) return null;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{template.title}</h2>
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <span className="text-lg text-blue-600 font-semibold">{culture.name}</span>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl">{template.description}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => navigate('/scenarios')}>Quit Simulation</Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <Card className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}>
                  <div className="text-sm font-medium opacity-70 mb-1">
                    {msg.role === 'user' ? user.username : 'Simulation Host'}
                  </div>
                  <div className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-slate-500 font-medium">Processing cultural context...</span>
                </div>
              </div>
            )}
            {sessionCompleted && (
              <div className="text-center py-10">
                <div className="inline-block bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-200">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                  <h4 className="text-lg font-bold">Scenario Completed!</h4>
                  <p className="text-sm opacity-80">You've successfully completed this training session.</p>
                  <Button onClick={() => navigate('/')} className="mt-4 bg-green-600 hover:bg-green-700 border-none">Return to Dashboard</Button>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={userAction}
                onChange={e => setUserAction(e.target.value)}
                placeholder="What do you do or say?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                rows={2}
                disabled={isProcessing || sessionCompleted}
              />
              <button 
                type="submit"
                disabled={!userAction.trim() || isProcessing || sessionCompleted}
                className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </Card>

        <div className="md:w-96 flex flex-col gap-6 overflow-y-auto">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Latest Feedback</h3>
            {lastFeedback ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge text={lastFeedback.severity} severity={lastFeedback.severity} />
                  <span className={`text-sm font-bold ${lastFeedback.competenceImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lastFeedback.competenceImpact > 0 ? '+' : ''}{lastFeedback.competenceImpact} XP
                  </span>
                </div>
                <p className="text-sm text-slate-700 italic border-l-4 border-slate-200 pl-3">
                  "{lastFeedback.feedbackSummary}"
                </p>
                <div className="space-y-4">
                  {lastFeedback.detailedFeedback.map((dim, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-600">{dim.dimension}</span>
                        <Badge text={`${dim.score > 0 ? '+' : ''}${dim.score}`} severity={dim.severity} />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{dim.explanation}</p>
                      {dim.recommendations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Advice</div>
                          <ul className="space-y-1">
                            {dim.recommendations.map((rec, rIdx) => (
                              <li key={rIdx} className="text-[11px] text-blue-700 flex items-start gap-1">
                                <ArrowRight className="w-2.5 h-2.5 mt-0.5 shrink-0" /> {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Info className="w-10 h-10 text-slate-200 mx-auto" />
                <p className="text-sm text-slate-400">Perform an action to receive cultural feedback.</p>
              </div>
            )}
          </Card>

          <Card className="p-5">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cultural Quick Ref</h3>
             <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Communication Style</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${culture.communicationStyle.directness}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">Direct</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Common Values</div>
                  <div className="flex flex-wrap gap-1">
                    {culture.values.map(v => (
                      <span key={v} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-600 font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Cultural Atlas</h2>
        <p className="text-slate-500">Explore in-depth cultural intelligence profiles for our supported regions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CULTURAL_PROFILES.map(culture => (
          <Card key={culture.id} className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                {culture.name === 'Japan' ? '🇯🇵' : culture.name === 'Germany' ? '🇩🇪' : culture.name === 'USA' ? '🇺🇸' : culture.name === 'India' ? '🇮🇳' : '🇧🇷'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{culture.name}</h3>
                <span className="text-xs text-slate-500">{culture.continent} • {culture.language}</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Essential Phrases</div>
                <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                  <span className="text-slate-500">Hello:</span>
                  <span className="font-semibold text-slate-800">{culture.helloPhrase}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500">Goodbye:</span>
                  <span className="font-semibold text-slate-800">{culture.goodbyePhrase}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Etiquette</div>
                <div className="space-y-2">
                   {culture.etiquetteRules.map(rule => (
                     <div key={rule.id} className="text-xs p-2 bg-slate-50 rounded border border-slate-100">
                       <div className="font-bold text-slate-700">{rule.rule}</div>
                       <p className="text-slate-500 mt-1">{rule.description}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full">View Detailed Dossier</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Settings: React.FC = () => (
  <div className="max-w-2xl mx-auto space-y-8">
    <h2 className="text-3xl font-bold text-slate-900">Platform Settings</h2>
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          General Preferences
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-700">Dark Mode</div>
              <div className="text-sm text-slate-500">Adjust the visual theme of the advisor.</div>
            </div>
            <input type="checkbox" className="w-10 h-5 bg-slate-200 rounded-full cursor-pointer appearance-none checked:bg-blue-600 transition-all" />
          </div>
          <div className="border-t border-slate-100 pt-6">
            <label className="block font-semibold text-slate-700 mb-2">AI Agent Persona</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Formal Advisor (Default)</option>
              <option>Challenging Master</option>
              <option>Supportive Coach</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-slate-400" />
          Feedback Configuration
        </h3>
        <div className="space-y-4">
           <div>
              <label className="block font-semibold text-slate-700 mb-2">Verbosity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Concise', 'Detailed', 'Pedagogical'].map(level => (
                  <button 
                    key={level} 
                    className={`p-2 text-xs font-bold rounded-lg border transition-all ${level === 'Detailed' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </Card>
    </div>
  </div>
);

// --- Layout & Main Wrapper ---

const Layout: React.FC<{ 
  user: IUserCulturalProfile; 
  onLogout: () => void;
  children: React.ReactNode; 
}> = ({ user, onLogout, children }) => {
  const location = useLocation();
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Simulations', icon: Terminal, path: '/scenarios' },
    { label: 'Atlas', icon: Globe, path: '/atlas' },
    { label: 'Learning', icon: BookOpen, path: '/learning' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-400 flex flex-col shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-inner">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">GlobalSync</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
              <User className="text-slate-400 w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{user.username}</div>
              <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase truncate">{user.originCultureId} Origin</div>
            </div>
          </div>
          <Button variant="danger" className="w-full" onClick={onLogout}>Logout</Button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUserCulturalProfile | null>(null);

  const handleLogin = (user: IUserCulturalProfile) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);
  
  const updateCompetence = (impact: number, cultureId: string) => {
    if (!currentUser) return;
    
    setCurrentUser(prev => {
      if (!prev) return null;
      const currentScores = { ...prev.culturalCompetenceScore };
      const newScore = Math.max(0, Math.min(100, (currentScores[cultureId] || 0) + impact));
      currentScores[cultureId] = newScore;
      
      const scores = Object.values(currentScores);
      // Fixed arithmetic operation error by providing explicit types to the reduce function's arguments.
      const overall = scores.length > 0 ? Math.round((scores as number[]).reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      
      return { ...prev, culturalCompetenceScore: currentScores, overallCompetence: overall };
    });
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={currentUser} />} />
          <Route path="/scenarios" element={<ScenarioSelection />} />
          <Route path="/scenarios/:id" element={<ScenarioSelection />} /> {/* Placeholder to select culture */}
          <Route path="/runner/:templateId/:cultureId" element={
            <ScenarioRunnerWrapper user={currentUser} onUpdateCompetence={updateCompetence} />
          } />
          <Route path="/atlas" element={<KnowledgeBase />} />
          <Route path="/learning" element={<div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 space-y-4">
            <BookOpen className="w-16 h-16" />
            <h3 className="text-xl font-bold">Learning Hub Coming Soon</h3>
          </div>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

// Helper for ScenarioRunner to extract params
const ScenarioRunnerWrapper: React.FC<{ 
  user: IUserCulturalProfile; 
  onUpdateCompetence: (i: number, c: string) => void 
}> = ({ user, onUpdateCompetence }) => {
  // Fixed 'require' error by using the standard useParams hook from react-router-dom.
  const { templateId, cultureId } = useParams<{ templateId: string; cultureId: string }>();
  return <ScenarioRunner 
    user={user} 
    templateId={templateId || ''} 
    cultureId={cultureId || ''} 
    onUpdateCompetence={onUpdateCompetence}
  />;
};

export default App;
