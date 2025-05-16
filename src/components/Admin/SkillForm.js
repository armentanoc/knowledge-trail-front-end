// src/components/Admin/SkillForm.js
const SkillForm = ({ newSkill, setNewSkill, onRegisterSkill, editMode }) => {
  return (
    <div>
      <h3>{editMode ? 'Editar Habilidade' : 'Registrar Nova Habilidade'}</h3>
      <input
        type="text"
        placeholder="Nome"
        value={newSkill.name}
        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={newSkill.description}
        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
      />
      <button onClick={onRegisterSkill}>
        {editMode ? 'Salvar Alterações' : 'Cadastrar'}
      </button>
    </div>
  );
};

export default SkillForm;
