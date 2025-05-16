// src/pages/admin/ManageTrails.js
import { useEffect, useRef, useState } from 'react';
import { TrailAPI } from '../../components/Admin/api';
import TrailForm from '../../components/Admin/TrailForm';
import TrailTable from '../../components/Admin/TrailTable';

const ManageTrails = () => {
  const [trails, setTrails] = useState([]);
  const [newTrail, setNewTrail] = useState({ title: '', videos: [], skillId: 0 });
  const [editMode, setEditMode] = useState(false);
  const trailFormRef = useRef(null);

  const loadTrails = async () => {
    try {
      const data = await TrailAPI.fetchTrails();
      console.log('Fetched trails:', data);
      setTrails(data.content);
    } catch (err) {
      console.error('Erro ao carregar trilhas:', err);
    }
  };

  const handleSubmitTrail = async () => {
  const { title, videos, skillId, id } = newTrail;

  if (!title || !skillId) {
    return alert('Título e Skill ID são obrigatórios.');
  }

  const payload = {
    title: title,
    videos: videos.map(video => ({
      title: video.title,
      url: video.url,
    })),
    skillId: skillId,
  };

  try {
    if (editMode && id) {
      await TrailAPI.updateTrail(id, payload);  
      alert('Trilha atualizada com sucesso!');
    } else {
      await TrailAPI.createTrail(payload);  
      alert('Trilha criada com sucesso!');
    }

    setNewTrail({ title: '', videos: [], skillId: '' });
    setEditMode(false);
    await loadTrails(); 
  } catch (err) {
    console.error(err);
    alert('Erro: '+err.message);
  }
};


  const handleEditTrail = async (trail) => {
    try {
      const fullVideos = await TrailAPI.getTrailVideos(trail.id);
      setNewTrail({
        id: trail.id,
        title: trail.title,
        videos: fullVideos || [],
        skillId: trail.skill?.id || trail.skillId,
      });
      setEditMode(true);
      trailFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Erro ao carregar vídeos da trilha:', err);
    }
  };

  const handleDeleteTrail = async (trailId) => {
    try {
      await TrailAPI.deleteTrail(trailId);
      setTrails(prev => prev.filter(t => t.id !== trailId));
      alert('Trilha removida com sucesso.');
    } catch (err) {
      console.error('Erro ao remover trilha:', err);
      alert('Erro ao remover trilha.');
    }
  };

  useEffect(() => {
    loadTrails();
  }, []);

  return (
    <div>
      <div ref={trailFormRef}>
        <TrailForm
          newTrail={newTrail}
          setNewTrail={setNewTrail}
          onSubmitTrail={handleSubmitTrail}
          editMode={editMode}
        />
      </div>

      <TrailTable
        trails={trails}
        onEditTrail={handleEditTrail}
        onDeleteTrail={handleDeleteTrail}
      />
    </div>
  );
};

export default ManageTrails;
