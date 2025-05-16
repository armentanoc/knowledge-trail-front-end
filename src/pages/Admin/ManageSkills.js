// src/pages/admin/ManageSkills.js
import React, { useEffect, useState, useRef } from 'react';
import { SkillAPI } from '../../components/Admin/api';
import SkillForm from '../../components/Admin/SkillForm';
import SkillTable from '../../components/Admin/SkillTable';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ id: null, name: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const skillFormRef = useRef(null);

  const loadSkills = async () => {
    try {
      const data = await SkillAPI.fetchSkills();
      setSkills(data.content || data);
    } catch (err) {
      console.error('Erro ao carregar habilidades:', err);
      alert('Erro ao carregar habilidades.');
    }
  };

  const handleRegisterSkill = async () => {
    const { name, description, id } = newSkill;

    if (!name.trim()) {
      return alert('Nome da habilidade é obrigatório.');
    }

    try {
      if (editMode && id !== null) {
        await SkillAPI.updateSkill(id, { name, description });
        alert('Habilidade atualizada com sucesso!');
      } else {
        await SkillAPI.createSkill({ name, description });
        alert('Habilidade criada com sucesso!');
      }

      setNewSkill({ id: null, name: '', description: '' });
      setEditMode(false);
      await loadSkills();
    } catch (err) {
      console.error(err);
      alert(editMode ? 'Erro ao atualizar habilidade.' : 'Erro ao criar habilidade.');
    }
  };

  const handleEditSkill = (skill) => {
    setNewSkill({ id: skill.id, name: skill.name, description: skill.description });
    setEditMode(true);
    skillFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await SkillAPI.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.id !== skillId));
      alert('Habilidade removida com sucesso.');
    } catch (err) {
      console.error('Erro ao remover habilidade:', err);
      alert('Erro ao remover habilidade.');
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <div>
      <div ref={skillFormRef}>
        <SkillForm
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          onRegisterSkill={handleRegisterSkill}
          editMode={editMode}
        />
      </div>

      <SkillTable
        skills={skills}
        onDeleteSkill={handleDeleteSkill}
        onEditSkill={handleEditSkill}
      />
    </div>
  );
};

export default ManageSkills;
