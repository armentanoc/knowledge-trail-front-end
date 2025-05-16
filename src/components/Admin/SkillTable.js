// src/components/Admin/SkillTable.js
const SkillTable = ({ skills, onDeleteSkill, onEditSkill }) => {
  return (
    <div>
      <h3>Gestão de Habilidades</h3>
      {skills.length === 0 ? (
        <p>Nenhuma habilidade encontrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Trilhas Relacionadas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id}>
                <td>{skill.id}</td>
                <td>{skill.name}</td>
                <td>{skill.description}</td>
                <td>
                  {skill.trails?.length > 0
                    ? skill.trails.map(trail => trail.id).join(', ')
                    : <em>Sem trilhas</em>}
                </td>
                <td>
                  <button className="edit-button" onClick={() => onEditSkill(skill)}>
                    Editar
                  </button>
                  <button className="remove-button" onClick={() => onDeleteSkill(skill.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SkillTable;
