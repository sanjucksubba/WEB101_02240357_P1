import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>📝 Todo List with Zustand</h1>
      <TodoInput />
      <TodoList />
    </div>
  );
}

export default App;