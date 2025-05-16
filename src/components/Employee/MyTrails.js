import { useEffect, useState } from "react"
import Slider from "react-slick"
import { SkillAPI } from "./api"
import { useAuth } from "../../context/AuthContext"


const getEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:\/watch\?v=|youtu\.be\/)([^\&\?\/]+)/)
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url
}

export default function MyTrails() {
  
  const { user } = useAuth()
  const [skillsWithTrails, setSkillsWithTrails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      SkillAPI.getUserSkillTrails(user.id)
        .then(setSkillsWithTrails)
        .catch((err) => console.error("Failed to load skill trails", err))
        .finally(() => setLoading(false))
    }
  }, [user?.id])

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

              <div className="slider-container">
              <Slider {...{ ...settings, slidesToShow: Math.min(2, trail.videos.length) }}>
                {trail.videos.map((video, index) => (
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
                        <p className="video-title">{video.title}</p>
                      </div>
                    </div>
                  ))}
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
      `}</style>
    </div>
  )
}
