import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Settings, Upload, Edit2, Save } from 'lucide-react';

const AFLGamedayApp = () => {
  const [quarterLength, setQuarterLength] = useState(720); // 12 minutes in seconds
  const [quarterLengthInput, setQuarterLengthInput] = useState('30');
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [myTeamScore, setMyTeamScore] = useState({ goals: 0, behinds: 0 });
  const [oppositionScore, setOppositionScore] = useState({ goals: 0, behinds: 0 });
  const [teamList, setTeamList] = useState(DEFAULT_TEAM_LIST);
  const [activeTab, setActiveTab] = useState('game');
  const [benchTracking, setBenchTracking] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    positions: '',
    playing: true,
    present: false,
    injured: false,
    sentrOff: false
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timeElapsed < quarterLength) {
      interval = setInterval(() => {
        setTimeElapsed(t => (t >= quarterLength ? quarterLength : t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeElapsed, quarterLength]);

  // Initialize bench tracking
  useEffect(() => {
    const tracking = {};
    teamList.forEach(player => {
      if (player.playing) {
        tracking[player.id] = { onBench: false, benchStartTime: null, totalBenchTime: 0, previousBenchPeriods: 0 };
      }
    });
    setBenchTracking(tracking);
  }, [teamList]);

  const timeRemaining = quarterLength - timeElapsed;
  const minutesElapsed = Math.floor(timeElapsed / 60);
  const secondsElapsed = timeElapsed % 60;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  const myTeamTotal = myTeamScore.goals * 6 + myTeamScore.behinds * 1;
  const oppositionTotal = oppositionScore.goals * 6 + oppositionScore.behinds * 1;

  const formatTime = (mins, secs) => `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetQuarter = () => {
    setTimeElapsed(0);
    setIsRunning(false);
  };

  const nextQuarter = () => {
    if (currentQuarter < 4) {
      setCurrentQuarter(currentQuarter + 1);
      resetQuarter();
    }
  };

  const updateScore = (team, type, delta) => {
    if (team === 'my') {
      setMyTeamScore(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] + delta)
      }));
    } else {
      setOppositionScore(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] + delta)
      }));
    }
  };

  const togglePlayerPresence = (id) => {
    setTeamList(teamList.map(player =>
      player.id === id ? { ...player, present: !player.present } : player
    ));
  };

  const togglePlayerStatus = (id, status) => {
    setTeamList(teamList.map(player =>
      player.id === id ? { ...player, [status]: !player[status] } : player
    ));
  };

  const toggleBench = (id) => {
    const player = teamList.find(p => p.id === id);
    if (!player.playing) return;

    setBenchTracking(prev => {
      const updated = { ...prev[id] };
      if (updated.onBench) {
        // Coming off bench
        updated.totalBenchTime += (Date.now() - updated.benchStartTime) / 1000;
        updated.previousBenchPeriods += 1;
        updated.benchStartTime = null;
        updated.onBench = false;
      } else {
        // Going to bench
        updated.benchStartTime = Date.now();
        updated.onBench = true;
      }
      return { ...prev, [id]: updated };
    });
  };

  const getPlayersOnField = () => {
    return teamList.filter(p => p.playing && p.present && !p.injured && !p.sentrOff);
  };

  const getPlayersOnBench = () => {
    return teamList.filter(p => p.playing && p.present && !p.injured && !p.sentrOff).filter(p => 
      benchTracking[p.id] && benchTracking[p.id].onBench
    );
  };

  const updateQuarterLength = () => {
    const minutes = parseInt(quarterLengthInput) || 30;
    const seconds = minutes * 60;
    setQuarterLength(seconds);
  };

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        
        const players = [];
        let maxId = Math.max(...DEFAULT_TEAM_LIST.map(p => p.id), 0);

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx];
          });

          if (row.name) {
            const positionsStr = row.positions || '';
            const positionsArray = positionsStr.split(';').map(p => p.trim()).filter(p => p.length > 0);
            
            players.push({
              id: row.id ? parseInt(row.id) : ++maxId,
              name: row.name,
              positions: positionsArray.length > 0 ? positionsArray : ['Midfielder'],
              playing: row.playing ? row.playing.toLowerCase() === 'true' : true,
              present: row.present ? row.present.toLowerCase() === 'true' : false,
              injured: row.injured ? row.injured.toLowerCase() === 'true' : false,
              sentrOff: row.sentoff ? row.sentoff.toLowerCase() === 'true' : false
            });
          }
        }

        if (players.length > 0) {
          setTeamList(players);
          // Reinitialize bench tracking for new players
          const tracking = {};
          players.forEach(player => {
            if (player.playing) {
              tracking[player.id] = { onBench: false, benchStartTime: null, totalBenchTime: 0, previousBenchPeriods: 0 };
            }
          });
          setBenchTracking(tracking);
        }
      } catch (error) {
        alert('Error parsing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const addNewPlayer = () => {
    if (!newPlayer.name.trim()) {
      alert('Player name is required');
      return;
    }
    
    const maxId = Math.max(...teamList.map(p => p.id), 0);
    const positionsArray = newPlayer.positions
      .split(';')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const player = {
      id: maxId + 1,
      name: newPlayer.name,
      positions: positionsArray.length > 0 ? positionsArray : ['Midfielder'],
      playing: newPlayer.playing,
      present: newPlayer.present,
      injured: newPlayer.injured,
      sentrOff: newPlayer.sentrOff
    };

    setTeamList([...teamList, player]);
    if (player.playing) {
      setBenchTracking(prev => ({
        ...prev,
        [player.id]: { onBench: false, benchStartTime: null, totalBenchTime: 0, previousBenchPeriods: 0 }
      }));
    }
    setNewPlayer({ name: '', positions: '', playing: true, present: false, injured: false, sentrOff: false });
    setShowAddPlayer(false);
  };

  const deletePlayer = (id) => {
    setTeamList(teamList.filter(p => p.id !== id));
    setBenchTracking(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const savePlayerEdit = () => {
    if (!editingPlayer.name.trim()) {
      alert('Player name is required');
      return;
    }
    
    const positionsArray = editingPlayer.positions
      .split(';')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    setTeamList(teamList.map(p => 
      p.id === editingPlayer.id 
        ? { ...editingPlayer, positions: positionsArray.length > 0 ? positionsArray : ['Midfielder'] }
        : p
    ));
    setEditingPlayer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-mono">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-slate-900 border-t-2 border-amber-500 rounded-t-lg p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-amber-400">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quarter Length */}
            <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
              <h3 className="font-bold text-amber-400 mb-3">Quarter Length</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={quarterLengthInput}
                  onChange={(e) => setQuarterLengthInput(e.target.value)}
                  placeholder="Minutes"
                  min="1"
                  max="60"
                  className="flex-1 bg-slate-700 text-white px-3 py-2 rounded font-mono text-center"
                />
                <span className="text-slate-400 self-center">minutes</span>
              </div>
              <button
                onClick={updateQuarterLength}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded transition"
              >
                Update Quarter Length
              </button>
              <div className="text-xs text-slate-400 mt-2">Current: {Math.floor(quarterLength / 60)}m {quarterLength % 60}s</div>
            </div>

            {/* CSV Import */}
            <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
              <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Team List (CSV)
              </h3>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                />
                <div className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded text-center cursor-pointer transition">
                  Choose CSV File
                </div>
              </label>
              <div className="text-xs text-slate-400 mt-3 p-3 bg-slate-700 rounded">
                <strong>CSV Format:</strong><br/>
                ID, NAME, POSITIONS, PLAYING, PRESENT, INJURED, SENTOFF<br/>
                <br/>
                <strong>Example:</strong><br/>
                1, Jack Martin, Forward;Wing, true, false, false, false<br/>
                2, Tom Lynch, Forward, true, false, false, false
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Score */}
      <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b-2 border-amber-500 shadow-xl">
        {/* Timer Bar */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div className="text-center">
              <div className="text-sm font-bold text-amber-900">Q{currentQuarter}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xs text-amber-900 font-bold">ELAPSED</div>
              <div className="text-2xl font-black">{formatTime(minutesElapsed, secondsElapsed)}</div>
            </div>
            <div className="w-px bg-amber-800"></div>
            <div className="text-center">
              <div className="text-xs text-amber-900 font-bold">REMAINING</div>
              <div className="text-2xl font-black">{formatTime(minutesRemaining, secondsRemaining)}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTimer}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-800 rounded font-bold transition"
            >
              {isRunning ? 'PAUSE' : 'START'}
            </button>
            <button
              onClick={resetQuarter}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              ⟲
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-0 px-4 py-4 border-b border-slate-800">
          {/* My Team */}
          <div className="border-r border-slate-800 pr-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">My Team</div>
            <div className="text-4xl font-black text-amber-400 mb-2">{myTeamTotal}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 p-2 rounded text-center">
                <div className="text-xs text-slate-400">Goals</div>
                <div className="text-xl font-bold">{myTeamScore.goals}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <button
                    onClick={() => updateScore('my', 'goals', 1)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateScore('my', 'goals', -1)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 rounded"
                  >
                    −
                  </button>
                </div>
              </div>
              <div className="bg-slate-800 p-2 rounded text-center">
                <div className="text-xs text-slate-400">Behinds</div>
                <div className="text-xl font-bold">{myTeamScore.behinds}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <button
                    onClick={() => updateScore('my', 'behinds', 1)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateScore('my', 'behinds', -1)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 rounded"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opposition */}
          <div className="pl-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Opposition</div>
            <div className="text-4xl font-black text-red-400 mb-2">{oppositionTotal}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 p-2 rounded text-center">
                <div className="text-xs text-slate-400">Goals</div>
                <div className="text-xl font-bold">{oppositionScore.goals}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <button
                    onClick={() => updateScore('opposition', 'goals', 1)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateScore('opposition', 'goals', -1)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 rounded"
                  >
                    −
                  </button>
                </div>
              </div>
              <div className="bg-slate-800 p-2 rounded text-center">
                <div className="text-xs text-slate-400">Behinds</div>
                <div className="text-xl font-bold">{oppositionScore.behinds}</div>
                <div className="flex gap-1 mt-1 justify-center">
                  <button
                    onClick={() => updateScore('opposition', 'behinds', 1)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateScore('opposition', 'behinds', -1)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 rounded"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 px-4 pt-4 border-b border-slate-800 sticky top-[185px] z-40 bg-slate-950/95 backdrop-blur">
        {['game', 'team', 'bench'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold uppercase text-sm transition ${
              activeTab === tab
                ? 'border-b-2 border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'game' && '📊 Game'}
            {tab === 'team' && '👥 Team'}
            {tab === 'bench' && '🔄 Bench'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pb-20">
        {/* Game Tab */}
        {activeTab === 'game' && (
          <div className="px-4 py-6 space-y-4">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-amber-400 mb-3 text-sm">QUARTER {currentQuarter} OF 4</h3>
              <div className="w-full bg-slate-900 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all"
                  style={{ width: `${(timeElapsed / quarterLength) * 100}%` }}
                ></div>
              </div>
              {currentQuarter < 4 && (
                <button
                  onClick={nextQuarter}
                  className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded font-bold text-sm transition"
                >
                  End Quarter {currentQuarter} → Q{currentQuarter + 1}
                </button>
              )}
              {currentQuarter === 4 && (
                <div className="text-center text-amber-400 font-bold">FINAL QUARTER</div>
              )}
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-amber-400 mb-3 text-sm">PLAYING</h3>
              <div className="text-lg font-bold text-slate-200">
                {getPlayersOnField().length} / {teamList.filter(p => p.playing).length} on field
              </div>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-amber-400 mb-3 text-sm">BENCH</h3>
              <div className="text-lg font-bold text-slate-200">
                {getPlayersOnBench().length} players on bench
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => setShowAddPlayer(true)}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-5 h-5" />
              Add Player
            </button>

            {/* Add Player Modal */}
            {showAddPlayer && (
              <div className="bg-slate-800 border-2 border-green-600 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-green-400 mb-3">Add New Player</h3>
                <input
                  type="text"
                  placeholder="Player Name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded mb-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Positions (e.g. Forward; Wing; Midfielder)"
                  value={newPlayer.positions}
                  onChange={(e) => setNewPlayer({...newPlayer, positions: e.target.value})}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded mb-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={newPlayer.playing}
                      onChange={(e) => setNewPlayer({...newPlayer, playing: e.target.checked})}
                      className="w-4 h-4"
                    />
                    Playing
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={newPlayer.present}
                      onChange={(e) => setNewPlayer({...newPlayer, present: e.target.checked})}
                      className="w-4 h-4"
                    />
                    Present
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={newPlayer.injured}
                      onChange={(e) => setNewPlayer({...newPlayer, injured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    Injured
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={newPlayer.sentrOff}
                      onChange={(e) => setNewPlayer({...newPlayer, sentrOff: e.target.checked})}
                      className="w-4 h-4"
                    />
                    Sent Off
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addNewPlayer}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Player List */}
            {teamList.map(player => (
              <div key={player.id}>
                {editingPlayer && editingPlayer.id === player.id ? (
                  // Edit Mode
                  <div className="bg-slate-800 border-2 border-blue-600 rounded-lg p-3 space-y-2">
                    <input
                      type="text"
                      value={editingPlayer.name}
                      onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={editingPlayer.positions.join('; ')}
                      onChange={(e) => setEditingPlayer({...editingPlayer, positions: e.target.value})}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded text-sm"
                      placeholder="Positions (separated by ;)"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingPlayer.playing}
                          onChange={(e) => setEditingPlayer({...editingPlayer, playing: e.target.checked})}
                          className="w-4 h-4"
                        />
                        Playing
                      </label>
                      <label className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingPlayer.present}
                          onChange={(e) => setEditingPlayer({...editingPlayer, present: e.target.checked})}
                          className="w-4 h-4"
                        />
                        Present
                      </label>
                      <label className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingPlayer.injured}
                          onChange={(e) => setEditingPlayer({...editingPlayer, injured: e.target.checked})}
                          className="w-4 h-4"
                        />
                        Injured
                      </label>
                      <label className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingPlayer.sentrOff}
                          onChange={(e) => setEditingPlayer({...editingPlayer, sentrOff: e.target.checked})}
                          className="w-4 h-4"
                        />
                        Sent Off
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={savePlayerEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm transition"
                      >
                        <Save className="w-4 h-4 inline mr-1" /> Save
                      </button>
                      <button
                        onClick={() => setEditingPlayer(null)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div
                    className={`p-3 rounded border-2 transition ${
                      !player.present
                        ? 'bg-slate-800 border-slate-700 opacity-50'
                        : player.injured || player.sentrOff
                        ? 'bg-slate-800 border-red-700 opacity-60'
                        : benchTracking[player.id]?.onBench
                        ? 'bg-slate-800 border-yellow-600'
                        : 'bg-slate-800 border-green-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-bold text-sm">{player.name}</div>
                        <div className="text-xs text-slate-400">{player.positions.join(', ')}</div>
                      </div>
                      <div className="flex gap-1">
                        {player.playing && player.present && !player.injured && !player.sentrOff && (
                          <>
                            <button
                              onClick={() => toggleBench(player.id)}
                              className={`px-2 py-1 text-xs font-bold rounded transition ${
                                benchTracking[player.id]?.onBench
                                  ? 'bg-yellow-600 hover:bg-yellow-500'
                                  : 'bg-green-600 hover:bg-green-500'
                              }`}
                            >
                              {benchTracking[player.id]?.onBench ? 'ON BENCH' : 'FIELD'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => togglePlayerPresence(player.id)}
                          className={`px-2 py-1 text-xs font-bold rounded transition ${
                            player.present
                              ? 'bg-slate-600 hover:bg-slate-500'
                              : 'bg-red-700 hover:bg-red-600'
                          }`}
                        >
                          {player.present ? '✓' : '✗'}
                        </button>
                        {player.playing && (
                          <>
                            <button
                              onClick={() => togglePlayerStatus(player.id, 'injured')}
                              className={`px-2 py-1 text-xs font-bold rounded transition ${
                                player.injured
                                  ? 'bg-red-600 hover:bg-red-500'
                                  : 'bg-slate-600 hover:bg-slate-500'
                              }`}
                              title="Injured"
                            >
                              🤕
                            </button>
                            <button
                              onClick={() => togglePlayerStatus(player.id, 'sentrOff')}
                              className={`px-2 py-1 text-xs font-bold rounded transition ${
                                player.sentrOff
                                  ? 'bg-red-600 hover:bg-red-500'
                                  : 'bg-slate-600 hover:bg-slate-500'
                              }`}
                              title="Sent off"
                            >
                              🚫
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEditingPlayer(player)}
                          className="px-2 py-1 text-xs font-bold rounded bg-blue-600 hover:bg-blue-500 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deletePlayer(player.id)}
                          className="px-2 py-1 text-xs font-bold rounded bg-red-700 hover:bg-red-600 transition"
                          title="Delete"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {benchTracking[player.id]?.onBench && (
                      <div className="text-xs text-yellow-400 mt-2">
                        On bench: {Math.floor((Date.now() - benchTracking[player.id].benchStartTime) / 1000)}s
                      </div>
                    )}
                    {benchTracking[player.id]?.previousBenchPeriods > 0 && (
                      <div className="text-xs text-slate-400 mt-1">
                        Previous bench periods: {benchTracking[player.id].previousBenchPeriods}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bench Tab */}
        {activeTab === 'bench' && (
          <div className="px-4 py-4 space-y-4">
            <div className="bg-slate-800 border-2 border-yellow-600 rounded-lg p-4">
              <h3 className="font-bold text-yellow-400 mb-4 text-sm">PLAYERS ON BENCH</h3>
              {getPlayersOnBench().length === 0 ? (
                <div className="text-slate-400 text-center py-4">No players on bench</div>
              ) : (
                <div className="space-y-3">
                  {getPlayersOnBench().map(player => {
                    const benchTime = Math.floor((Date.now() - benchTracking[player.id].benchStartTime) / 1000);
                    return (
                      <div key={player.id} className="bg-slate-700 rounded p-3">
                        <div className="font-bold mb-2">{player.name}</div>
                        <div className="text-sm text-yellow-400 font-bold mb-2">
                          Bench time: {Math.floor(benchTime / 60)}m {benchTime % 60}s
                        </div>
                        <button
                          onClick={() => toggleBench(player.id)}
                          className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-bold text-sm transition"
                        >
                          Return to Field
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-slate-400 mb-4 text-sm">BENCH HISTORY</h3>
              {teamList.filter(p => benchTracking[p.id]?.previousBenchPeriods > 0).length === 0 ? (
                <div className="text-slate-400 text-center py-4">No bench history yet</div>
              ) : (
                <div className="space-y-2">
                  {teamList
                    .filter(p => benchTracking[p.id]?.previousBenchPeriods > 0)
                    .map(player => (
                      <div key={player.id} className="flex justify-between text-sm">
                        <span>{player.name}</span>
                        <span className="text-slate-400">
                          {benchTracking[player.id].previousBenchPeriods} period(s) •{' '}
                          {Math.floor(benchTracking[player.id].totalBenchTime / 60)}m total
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DEFAULT_TEAM_LIST = [
  { id: 1, name: 'Sully', positions: ['Wing'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 2, name: 'Jake', positions: ['Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 3, name: 'Isaac', positions: ['Midfielder'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 4, name: 'Aiden', positions: ['Ruck', 'Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 5, name: 'Sam G', positions: ['Midfielder', 'Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 6, name: 'Noah H', positions: ['Wing'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 7, name: 'Levi', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 8, name: 'Sebi', positions: ['Midfielder'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 9, name: 'Grayson', positions: ['Forward', 'Ruck'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 10, name: 'Hunter', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 11, name: 'Jarrod', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 12, name: 'Noah Mc', positions: ['Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 13, name: 'Nixon', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 14, name: 'Matt', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 15, name: 'Darcy', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 16, name: 'Aston', positions: ['Defender'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 17, name: 'Rayan', positions: ['Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 18, name: 'Sam T', positions: ['Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 19, name: 'Liam', positions: ['Forward'], playing: true, present: true, injured: false, sentrOff: false },
  { id: 20, name: 'Ned', positions: ['Midfielder'], playing: true, present: true, injured: false, sentrOff: false },
];

export default AFLGamedayApp;
