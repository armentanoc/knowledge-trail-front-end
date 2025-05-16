// src/components/Admin/TrailTable.js
const TrailTable = ({ trails = [], onEditTrail, onDeleteTrail }) => {
  const trailList = Array.isArray(trails) ? trails : [];

  return (
    <div>
      <h3>Gestão de Trilhas</h3>
      {trailList.length === 0 ? (
        <p>Nenhuma trilha cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Videos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {trailList.map((trail) => (
              <tr key={trail.id}>
                <td>{trail.id}</td>
                <td>{trail.title}</td>
                <td>
                  <ul>
                    {trail.videos.map((video) => (
                      <li key={video.id}>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          {video.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button className="edit-button" onClick={() => onEditTrail(trail)}>
                    Editar
                  </button>
                  <button className="remove-button" onClick={() => onDeleteTrail(trail.id)}>
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


export default TrailTable;
