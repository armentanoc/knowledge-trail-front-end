import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterUser = ( {onUserAdded} ) => {
  const { register } = useAuth(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE'); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      username,
      password,
      role
    };

    try {
      const { success, message } = await register(userData);
      console.log("Success: " + success);
      console.log("Message: " + message);
      onUserAdded();
      alert(message); 

    } catch (error) {
      console.error('Error during registration:', error); 
      alert('Ocorreu um erro durante o registro.'); 
    }

    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRole('EMPLOYEE');
  };

  return (
    <div>
      <h2>Registrar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="EMPLOYEE">Funcionário</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterUser;
