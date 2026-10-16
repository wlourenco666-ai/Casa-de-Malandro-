import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDcsBXzUC9MtQ7krNyIjxUIrnWoLZ9I8wA",
  authDomain: "casa-de-malandro.firebaseapp.com",
  projectId: "casa-de-malandro",
  storageBucket: "casa-de-malandro.firebasestorage.app",
  messagingSenderId: "884828792946",
  appId: "1:884828792946:web:bbcf27d2a866b8b2333aeb",
  measurementId: "G-D5RS99W0S7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('gira');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Configurações do App
  const [appConfig, setAppConfig] = useState({
    title: 'Templo Escola Casa de Malandro',
    logoUrl: 'https://cdn.discordapp.com/attachments/1352872470058897443/1560444653961220166/1775084903955.png',
    giraBanner: '',
    giraTitle: 'Gira de Malandros e Baianos',
    giraDate: 'Sábado às 19:30',
    pixKey: '00.000.000/0001-00'
  });

  const [usersDb, setUsersDb] = useState([
    { name: 'William Lourenço', phone: '11999999999', password: 'admin', role: 'admin' }
  ]);
  
  const [giraSchedule, setGiraSchedule] = useState([
    { id: '1', time: '19:30', bookedBy: null, phone: null },
    { id: '2', time: '19:45', bookedBy: null, phone: null },
    { id: '3', time: '20:00', bookedBy: null, phone: null },
  ]);

  const [banhos, setBanhos] = useState([
    { id: '1', title: 'Banho de Descarrego', ervas: 'Arruda, Guiné e Sal Grosso', preparo: 'Ferva as ervas, deixe amornar e jogue do pescoço para baixo.' }
  ]);

  const [authMode, setAuthMode] = useState('login'); 
  const [loginName, setLoginName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'register') {
      if (!loginName || !phone || !password) {
        setAuthError('Preencha todos os campos.');
        return;
      }
      const newUser = { name: loginName, phone, password, role: 'user' };
      setUsersDb([...usersDb, newUser]);
      setCurrentUser(newUser);
      setIsAdmin(false);
    } else {
      const user = usersDb.find(u => u.name === loginName && u.password === password);
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin');
      } else {
        setAuthError('Nome ou senha incorretos.');
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setLoginName('');
    setPassword('');
    setShowSettings(false);
  };

  const bookTime = (id) => {
    setGiraSchedule(giraSchedule.map(slot => 
      slot.id === id ? { ...slot, bookedBy: currentUser.name, phone: currentUser.phone } : slot
    ));
    alert('Atendimento marcado com sucesso!');
  };

  const toggleAdminRole = (userName) => {
    setUsersDb(usersDb.map(u => 
      u.name === userName ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
    ));
  };

  const addBanho = () => {
    const title = prompt('Nome do Banho:');
    const ervas = prompt('Ervas utilizadas:');
    const preparo = prompt('Modo de preparo:');
    if (title && ervas && preparo) {
      setBanhos([...banhos, { id: String(Date.now()), title, ervas, preparo }]);
    }
  };

  const removeBanho = (id) => {
    setBanhos(banhos.filter(b => b.id !== id));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Cinzel', serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');`}</style>
        
        <div className="bg-neutral-900 p-8 rounded-lg border border-red-800 w-full max-w-md shadow-[0_0_30px_rgba(185,28,28,0.2)] flex flex-col items-center">
          <div className="w-36 h-36 mb-6 rounded-full overflow-hidden border-2 border-red-800 shadow-[0_0_20px_rgba(185,28,28,0.4)] flex items-center justify-center bg-black">
            <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">{appConfig.title}</h1>
            <p className="text-sm text-gray-400">
              {authMode === 'login' ? 'Acesse para agendar o seu atendimento' : 'Crie a sua conta de acesso'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 w-full">
            <div>
              <label className="block text-sm mb-1 text-gray-300">O seu Nome</label>
              <input 
                type="text" 
                value={loginName} 
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none"
                placeholder="Ex: William Lourenço"
              />
            </div>
            
            {authMode === 'register' && (
              <div>
                <label className="block text-sm mb-1 text-gray-300">WhatsApp</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none"
                  placeholder="11999999999"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm mb-1 text-gray-300">Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none"
                placeholder="Sua senha secreta"
              />
            </div>

            {authError && <p className="text-red-500 text-sm font-semibold text-center">{authError}</p>}

            <button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition border border-red-600 tracking-wider mt-4">
              {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {authMode === 'login' ? (
              <p>Não tem cadastro? <button onClick={() => setAuthMode('register')} className="text-red-500 font-bold hover:underline">Criar conta</button></p>
            ) : (
              <p>Já possui conta? <button onClick={() => setAuthMode('login')} className="text-red-500 font-bold hover:underline">Fazer login</button></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20" style={{ fontFamily: "'Cinzel', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');`}</style>

      <header className="bg-neutral-900 border-b border-red-900 p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-red-800 bg-black flex items-center justify-center">
              <img src={appConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-red-600 tracking-wider">{appConfig.title}</h1>
              <p className="text-xs text-gray-400">Salve, {currentUser.name}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {currentUser.role === 'admin' && (
              <button 
                onClick={() => setIsAdmin(!isAdmin)} 
                className={`text-xs px-3 py-2 rounded font-bold transition border ${isAdmin ? 'bg-red-800 border-red-600 text-white' : 'bg-neutral-800 border-neutral-600 text-gray-300'}`}
              >
                {isAdmin ? 'ADM ON' : 'ADM OFF'}
              </button>
            )}
            <button onClick={logout} className="text-xs text-gray-400 hover:text-white underline">Sair</button>
          </div>
        </div>
      </header>

      {isAdmin && (
        <div className="bg-neutral-800 border-b border-red-700 p-4">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setShowSettings(!showSettings)} className="w-full text-center text-red-400 font-bold mb-2 hover:text-white">
              {showSettings ? '▲ Fechar Painel de Edição ▲' : '▼ Abrir Painel de Textos e Imagens (ADM) ▼'}
            </button>
            
            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm font-sans">
                <div>
                  <label className="block text-gray-400 mb-1">Nome do Terreiro</label>
                  <input type="text" value={appConfig.title} onChange={e => setAppConfig({...appConfig, title: e.target.value})} className="w-full bg-black p-2 rounded text-white border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">URL da Logo</label>
                  <input type="text" value={appConfig.logoUrl} onChange={e => setAppConfig({...appConfig, logoUrl: e.target.value})} className="w-full bg-black p-2 rounded text-white border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Título da Gira</label>
                  <input type="text" value={appConfig.giraTitle} onChange={e => setAppConfig({...appConfig, giraTitle: e.target.value})} className="w-full bg-black p-2 rounded text-white border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Data/Hora da Gira</label>
                  <input type="text" value={appConfig.giraDate} onChange={e => setAppConfig({...appConfig, giraDate: e.target.value})} className="w-full bg-black p-2 rounded text-white border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Chave PIX</label>
                  <input type="text" value={appConfig.pixKey} onChange={e => setAppConfig({...appConfig, pixKey: e.target.value})} className="w-full bg-black p-2 rounded text-white border border-neutral-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="flex justify-start md:justify-center bg-black border-b border-neutral-800 overflow-x-auto whitespace-nowrap">
        {['gira', 'cursos', 'taro', 'banhos', 'doacoes', ...(isAdmin ? ['equipe'] : [])].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-4 font-bold text-sm tracking-wider transition uppercase ${
              activeTab === tab ? 'text-red-500 border-b-2 border-red-700 bg-neutral-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'gira' ? 'Próxima Gira' : tab}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-4xl mx-auto mt-4">
        {activeTab === 'gira' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{appConfig.giraTitle}</h2>
              <p className="text-red-500 font-semibold tracking-widest">{appConfig.giraDate}</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 border-b border-red-900 pb-2 text-gray-200">
                {isAdmin ? 'Gerenciar Horários da Gira' : 'Agendar Atendimento'}
              </h3>
              
              <div className="space-y-3 font-sans">
                {giraSchedule.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center p-3 bg-black rounded border border-neutral-800">
                    <span className="font-bold text-lg text-red-500 font-serif">{slot.time}</span>
                    
                    {slot.bookedBy ? (
                      <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">
                          {isAdmin ? `${slot.bookedBy} (${slot.phone})` : 'Horário Preenchido'}
                        </span>
                        {isAdmin && slot.phone && (
                          <a 
                            href={`https://wa.me/55${slot.phone}?text=Olá ${slot.bookedBy}! O seu agendamento para a gira (${appConfig.giraDate}) às ${slot.time} foi confirmado.`}
                            target="_blank" rel="noreferrer"
                            className="bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded font-bold"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    ) : (
                      !isAdmin && (
                        <button onClick={() => bookTime(slot.id)} className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm transition border border-red-600">
                          Agendar
                        </button>
                      )
                    )}
                    {isAdmin && !slot.bookedBy && <span className="text-green-600 text-sm font-bold tracking-widest">LIVRE</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">Desenvolvimento e Aulas</h2>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 text-center">
              <p className="text-gray-400 mb-6">Aprofunde os seus conhecimentos na doutrina umbandista.</p>
              <button className="bg-red-800 px-6 py-3 rounded text-white font-bold hover:bg-red-700 border border-red-600">Ver Cursos</button>
            </div>
          </div>
        )}

        {activeTab === 'taro' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">Consulta de Tarô</h2>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 text-center">
              <p className="text-gray-300 mb-6">Busque direcionamento espiritual através das cartas.</p>
              <button className="bg-red-800 px-6 py-3 rounded text-white font-bold hover:bg-red-700 border border-red-600">Solicitar Consulta</button>
            </div>
          </div>
        )}

        {activeTab === 'banhos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-600">Receitas de Banhos</h2>
              {isAdmin && (
                <button onClick={addBanho} className="bg-red-800 px-3 py-1 text-sm rounded text-white font-bold font-sans">
                  + Novo Banho
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {banhos.map(banho => (
                <div key={banho.id} className="bg-neutral-900 p-5 rounded-lg border border-neutral-800 relative">
                  {isAdmin && (
                    <button onClick={() => removeBanho(banho.id)} className="absolute top-2 right-2 text-red-600 text-xs font-sans hover:text-red-400">Excluir</button>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{banho.title}</h3>
                  <p className="text-red-400 text-sm mb-2 font-sans font-bold">Ervas: <span className="text-gray-300 font-normal">{banho.ervas}</span></p>
                  <p className="text-gray-400 text-sm font-sans">{banho.preparo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'doacoes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">Apoie a Nossa Casa</h2>
            <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 text-center">
              <p className="text-gray-300 mb-8 font-sans">A sua colaboração mantém o nosso Templo de portas abertas para a caridade.</p>
              <div className="bg-black p-6 rounded-lg inline-block border border-red-900 shadow-[0_0_15px_rgba(185,28,28,0.2)]">
                <p className="text-sm text-gray-500 mb-2 font-sans uppercase tracking-widest">Chave PIX</p>
                <p className="font-mono text-2xl font-bold text-red-500">{appConfig.pixKey}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipe' && isAdmin && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-600">Gerenciar Equipe (ADMs)</h2>
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden font-sans">
              {usersDb.map((u, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b border-neutral-800 bg-black">
                  <div>
                    <p className="font-bold text-white text-lg">{u.name}</p>
                    <p className="text-gray-500 text-sm">WhatsApp: {u.phone}</p>
                  </div>
                  <button 
                    onClick={() => toggleAdminRole(u.name)}
                    className={`px-4 py-2 rounded text-xs font-bold transition border ${
                      u.role === 'admin' ? 'bg-red-800 text-white border-red-600' : 'bg-neutral-800 text-gray-400 border-neutral-600 hover:text-white'
                    }`}
                  >
                    {u.role === 'admin' ? 'Remover ADM' : 'Tornar ADM'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
