import { useEffect } from 'react';

const TrailForm = ({ newTrail, setNewTrail, onSubmitTrail, editMode }) => {
  useEffect(() => {
    if (editMode) {
      setNewTrail((prevTrail) => ({
        ...prevTrail,
        skillId: prevTrail.skillId || '',  
      }));
    }
  }, [editMode, setNewTrail]);

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...newTrail.videos];
    updatedVideos[index][field] = value;
    setNewTrail({ ...newTrail, videos: updatedVideos });
  };

  const addVideoField = () => {
    setNewTrail({ ...newTrail, videos: [...newTrail.videos, { title: '', url: '' }] });
  };

  const removeVideoField = (index) => {
    const updatedVideos = [...newTrail.videos];
    updatedVideos.splice(index, 1);
    setNewTrail({ ...newTrail, videos: updatedVideos });
  };

  const handleSkillIdChange = (e) => {
    const value = e.target.value;
    const parsedValue = value === '' ? '' : parseInt(value, 10);
    setNewTrail({ ...newTrail, skillId: parsedValue });
  };

  return (
    <div>
      <h3>{editMode ? 'Editar Trilha' : 'Criar Nova Trilha'}</h3>
      <input
        type="text"
        placeholder="Título"
        value={newTrail.title}
        onChange={(e) => setNewTrail({ ...newTrail, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="SkillId"
        value={newTrail.skillId || ''}
        onChange={handleSkillIdChange}
      />
      <h4>Vídeos</h4>
      {newTrail.videos.map((video, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Título"
            value={video.title}
            onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="URL"
            value={video.url}
            onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
          />
          <br />
          <button className="secondary-button" onClick={() => removeVideoField(index)}>
            Remover
          </button>
        </div>
      ))}
      <button onClick={addVideoField}>Adicionar Vídeo</button>
      <br />
      <button onClick={onSubmitTrail}>
        {editMode ? 'Salvar Alterações' : 'Cadastrar Trilha'}
      </button>
    </div>
  );
};

export default TrailForm;
