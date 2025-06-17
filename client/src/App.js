import './App.css';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Login from './components/Login';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const getTodayDayName = () => {
  const now = new Date();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[new Date(now.getTime() - now.getTimezoneOffset() * 60000).getDay()];
};
const getTodayLocal = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
};
function App() {
  const [editingHabit, setEditingHabit] = useState(null);
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  // ✅ useEffect se ejecuta aunque no haya token, pero se detiene internamente
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.log('Error', err));
  }, [token]);

  useEffect(() => {
    const today = getTodayLocal();
    const todayDayName = getTodayDayName();

    const todayHabits = habits.filter(h => h.daysOfWeek.includes(todayDayName));
    const completedToday = todayHabits.filter(h =>
      h.records.some(r => r.date === today && r.completed)
    );

    const percent = todayHabits.length > 0
      ? (completedToday.length / todayHabits.length) * 100
      : 0;

    setCompletionPercent(percent);
  }, [habits, selectedDate]);

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess}/>;
  }

  const sugerirNombre = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/suggestions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setName(data.suggestion);
    } catch (error) {
      console.error("error al sugerir nombre", error);
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => setHabits(habits.filter(h => h._id !== id)))
      .catch(err => console.error('Error al eliminar:', err));
  };

  const startEdit = (habit) => {
    setName(habit.name);
    setSelectedDays(habit.daysOfWeek);
    setEditingHabit(habit._id);
  };

  const marcarCompletado = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}/complete`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(updated => {
        setHabits(prev => prev.map(h => h._id === updated._id ? updated : h));
        setName('');
        setSelectedDays([]);
        setEditingHabit(null);
      })
      .catch(err => console.error('❌ Error al marcar completado:', err));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert('Escribe nombre para hábito');
    if (selectedDays.length === 0) return alert('Selecciona al menos un día');

    const newHabit = { name, daysOfWeek: selectedDays };
    const url = editingHabit
      ? `${process.env.REACT_APP_API_URL}/habits/${editingHabit}`
      : `${process.env.REACT_APP_API_URL}/habits`;

    fetch(url, {
      method: editingHabit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newHabit)
    })
      .then(res => res.json())
      .then(savedHabit => {
        if (editingHabit) {
          setHabits(habits.map(h => h._id === editingHabit ? savedHabit : h));
        } else {
          setHabits([...habits, savedHabit]);
        }
        setName('');
        setSelectedDays([]);
        setEditingHabit(null);
      })
      .catch(err => console.error('Error:', err));
  };
  
  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Seguimiento de Hábitos</h1> 
      <button onClick={() => {
        localStorage.removeItem('token');
        setToken(null);
      }}>Cerrar sesión</button>

      <h3>Progreso del día</h3>
      <progress value={completionPercent} max="100" style={{ width: '100%' }} />
      <p>{Math.round(completionPercent)}% completado hoy</p>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Nombre del Hábito'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: 8, fontSize: 16, width: '300px' }}
        />
        <div style={{ margin: '10px 0' }}>
          {daysOfWeek.map(day => (
            <label key={day} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar hábito</button>
        <button type="button" onClick={sugerirNombre} style={{ marginLeft: 10 }}>
          💡 Sugerir nombre
        </button>
      </form>

      <div className='container'>
        <div>
          <h2>Calendario de hábitos</h2>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileContent={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];

              const todayHabits = habits.filter(h => h.daysOfWeek.includes(dayName));
              const total = todayHabits.length;
              const completados = todayHabits.filter(h => h.records?.find(r => r.date === dateStr && r.completed)).length;

              if (total === 0) return null;
              const percent = (completados / total) * 100;

              return (
                <div style={{ fontSize: 12 }}>
                  {Math.round(percent)}%
                </div>
              );
            }}
            tileClassName={({ date }) => {
              const classes = [];
              const dateStr = date.toISOString().split('T')[0];
              const todayStr = getTodayLocal();

              if (dateStr === todayStr) classes.push('today');
              const dayOfWeek = date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) classes.push('weekend');

              const dayName = daysOfWeek[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
              const todayHabits = habits.filter(h => h.daysOfWeek.includes(dayName));
              const total = todayHabits.length;
              const completados = todayHabits.filter(h => h.records?.find(r => r.date === dateStr && r.completed)).length;

              if (total > 0) {
                const percent = (completados / total) * 100;
                if (percent === 100) classes.push('day-complete');
                else if (percent >= 50) classes.push('day-half');
                else if (percent >= 25) classes.push('day-partial');
                else classes.push('day-incomplete');
              }

              return classes.join(' ');
            }}
          />
        </div>

        <div>
          <hr style={{ margin: '20px 0' }} />
          <h4>Mis Hábitos</h4>
          <ul>
            {habits.map(habit => (
              <li key={habit._id}>
                <strong>{habit.name}</strong> - días: {habit.daysOfWeek.join(', ')}
                <button onClick={() => handleDelete(habit._id)} style={{ marginLeft: 10 }}>🗑</button>
                <button onClick={() => startEdit(habit)} style={{ marginLeft: 10 }}>✏️</button>
                <button onClick={() => marcarCompletado(habit._id)} style={{ marginLeft: 10 }}>✅</button>
                <div>
                  Historial:
                  <ul>
                    {habit.records?.slice(-3).map((r, idx) => (
                      <li key={idx}>
                        {getTodayLocal()}: {r.completed ? '✔️' : '❌'}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
