import { useEffect, useState } from "react"
import Slider from "react-slick"
import { SkillAPI, TrailProgressAPI } from "./api"
import { useAuth } from "../../context/AuthContext"

const getEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:\/watch\?v=|youtu\.be\/)([^\&\?\/]+)/)
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url
}


export default function MyTrails() {

  const { user } = useAuth()
  const [skillsWithTrails, setSkillsWithTrails] = useState([])
  const [loading, setLoading] = useState(true)
  const [watchedMap, setWatchedMap] = useState({});
  const toggleWatchStatus = async (trailId, videoId) => {
    const watched = watchedMap[trailId]?.includes(videoId);

    try {
      const success = watched
        ? await TrailProgressAPI.unwatchVideo(user.id, trailId, videoId)
        : await TrailProgressAPI.watchVideo(user.id, trailId, videoId);

      if (success) {
        setWatchedMap((prev) => {
          const currentList = prev[trailId] || [];
          const updatedList = watched
            ? currentList.filter((id) => id !== videoId)
            : [...currentList, videoId];

          return { ...prev, [trailId]: updatedList };
        });
      }
    } catch (err) {
      console.error('Failed to toggle video status', err);
    }
  };

  useEffect(() => {
    const fetchTrailsAndProgress = async () => {
      if (!user?.id) return;

      try {
        const skills = await SkillAPI.getUserSkillTrails(user.id);
        setSkillsWithTrails(skills);
        const watchedMap = {};
        const allTrails = skills.flatMap((skill) => skill.trails || []);
        await Promise.all(
          allTrails.map(async (trail) => {
            try {
              const watched = await TrailProgressAPI.getWatchedVideos(user.id, trail.id);
              watchedMap[trail.id] = watched;
            } catch (err) {
              console.error(`Failed to fetch watched videos for trail ${trail.id}`, err);
            }
          })
        );

        setWatchedMap(watchedMap);
      } catch (err) {
        console.error("Failed to load skill trails", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailsAndProgress();
  }, [user?.id]);


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    centerMode: false,
    centerPadding: "0px",
    arrows: true,
  }

  if (loading) return <p>Carregando trilhas...</p>

  return (
    <div className="p-6">
      {skillsWithTrails.map((skill) => (
        <div key={skill.id} className="mb-12">
          <h3 className="text-xl font-bold mb-2 text-center">{skill.name}</h3>
          <p className="text-gray-600 mb-4 text-center">{skill.description}</p>

          {skill.trails.map((trail) => (
            <div key={trail.id} className="mb-8">
              <h4 className="text-lg font-medium mb-3 text-center">{trail.title}</h4>

              {(() => {
                const watchedCount = (watchedMap[trail.id] || []).length;
                const totalCount = trail.videos.length;

                let status = "Não iniciado";
                if (watchedCount === totalCount && totalCount > 0) {
                  status = "Concluído";
                } else if (watchedCount > 0) {
                  status = "Em progresso";
                }

                return (
                  <button className={`trail-status-button ${status.toLowerCase().replace(" ", "-")}`}>
                    {status}
                  </button>
                );
              })()}

              <div className="slider-container">
                <Slider {...{ ...settings, slidesToShow: Math.min(2, trail.videos.length) }}>
                  {trail.videos.map((video, index) => {
                    const watched = watchedMap[trail.id]?.includes(video.id);

                    return (
                      <div key={`${trail.id}-${video.id}-${index}`} className="slide-item">
                        <div className="video-wrapper">
                          <div className="iframe-container">
                            <iframe
                              src={getEmbedUrl(video.url)}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="video-iframe"
                            />
                          </div>
                          <p className="video-title">
                            {video.title}
                          </p>
                          <button
                            className={`watch-toggle-button ${watched ? 'watched' : 'not-watched'}`}
                            onClick={() => toggleWatchStatus(trail.id, video.id)}
                          >
                            {watched ? '✅ Você já assistiu este vídeo' : '📺 Marcar como assistido'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          ))}
        </div>
      ))}

      <style jsx global>{`
        /* Container styles */
        .slider-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* Slide item styles */
        .slide-item {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
        
        /* Video wrapper styles */
        .video-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: 0 auto;
        }
        
        /* iframe container styles - FIXED SIZE */
        .iframe-container {
          width: 400px;
          height: 225px; /* 16:9 aspect ratio */
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
        }
        
        /* Responsive adjustment for small screens */
        @media (max-width: 480px) {
          .iframe-container {
            width: 320px;
            height: 180px;
          }
        }
        
        /* iframe styles */
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* Video title styles */
        .video-title {
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media (max-width: 480px) {
          .video-title {
            width: 320px;
          }
        }
        
        /* Slick slider overrides */
        .slick-slider {
          width: 100%;
          margin: 0 auto;
        }
        
        .slick-track {
          display: flex !important;
          justify-content: center !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        .slick-slide {
          float: none !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        .slick-list {
          overflow: hidden;
          margin: 0 auto;
          padding: 10px 0 !important;
        }
        
        /* Center dots */
        .slick-dots {
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 16px 0 16px 0 !important;
          list-style: none !important;
        }
        
        /* Fix arrow positioning */
        .slick-prev, .slick-next {
          z-index: 1;
        }
        
        .slick-prev {
          left: 10px !important;
        }
        
        .slick-next {
          right: 10px !important;
        }

        .watch-toggle-button {
          margin-top: 6px;
          padding: 6px 12px;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          transition: background 0.2s ease;
        }

        .watch-toggle-button.watched {
          background-color: #e6f4ea;
          color: #2e7d32;
          font-weight: 600;
        }

        .watch-toggle-button.not-watched {
          background-color: #f0f0f0;
          color: #444;
        }

        .trail-status-button {
          margin: 6px auto 16px auto;
          padding: 6px 12px;
          font-size: 14px;
          border: none;
          border-radius: 6px;
          cursor: default;
          text-align: center;
          font-weight: 600;
          display: block;
        }

        .trail-status-button.não-iniciado {
          background-color: #f0f0f0;
          color: #666;
        }

        .trail-status-button.em-progresso {
          background-color: #fff8e1;
          color: #ff9800;
        }

        .trail-status-button.concluído {
          background-color: #e6f4ea;
          color: #2e7d32;
        }

      `}</style>
    </div>
  )
}
