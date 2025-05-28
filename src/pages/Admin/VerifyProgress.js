// src/pages/admin/VerifyProgress.js
import React, { useState } from 'react';
import { VerifyProgressAPI } from '../../components/Admin/api';

const VerifyProgress = () => {
    const [skillId, setSkillId] = useState('');
    const [userId, setUserId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchEmployeesBySkill = async () => {
        if (!skillId.trim()) {
            alert('Informe o ID da habilidade.');
            return;
        }

        try {
            setLoading(true);
            const data = await VerifyProgressAPI.fetchEmployeesBySkill(skillId.trim());
            setEmployees(data || []);
        } catch (err) {
            console.error('Erro ao buscar funcionários por skillId:', err);
            alert('Erro ao buscar funcionários.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchSkillsByUser = async () => {
        if (!userId.trim()) {
            alert('Informe o ID do usuário.');
            return;
        }

        try {
            setLoading(true);
            const data = await VerifyProgressAPI.fetchSkillsByUser(userId.trim());
            setSkills(data || []);
        } catch (err) {
            console.error('Erro ao buscar habilidades por userId:', err);
            alert('Erro ao buscar habilidades.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Verificar Progresso</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold">Funcionários com habilidade validada</h3>
                <input
                    type="text"
                    placeholder="Skill ID"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                    className="border rounded px-3 py-2 mr-2"
                />
                <button
                    onClick={handleFetchEmployeesBySkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Buscar
                </button>

                {loading && <p>Carregando...</p>}

                {employees.length > 0 && (
                    <ul className="mt-4 list-disc list-inside">
                        {employees.map((emp) => (
                            <li key={emp.id}>{emp.name || emp.email || `ID ${emp.id}`}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold">Habilidades validadas por usuário</h3>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border rounded px-3 py-2 mr-2"
                />
                <button
                    onClick={handleFetchSkillsByUser}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Buscar
                </button>

                {loading && <p>Carregando...</p>}

                {skills.length > 0 && (
                    <ul className="mt-4 list-disc list-inside">
                        {skills.map((skill) => (
                            <li key={skill.id}>{skill.name}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default VerifyProgress;
