import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { SkillAPI } from './api';
import Pagination from '../Pagination'; 
import { useAuth } from "../../context/AuthContext"; 

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export default function SkillSelector() {
  const { user } = useAuth(); 
  const currentUserId = user?.id; 

  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(50); 
  const [currentPage, setCurrentPage] = useState(0); 

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await SkillAPI.fetchSkills(currentPage, pageSize); 
        setSkills(response.content); 
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    const fetchUserSkills = async () => {
      if (currentUserId) {
        try {
          const response = await SkillAPI.getSkillById(currentUserId); 
          setUserSkills(response); 
        } catch (error) {
          console.error("Failed to fetch user skills:", error);
        }
      }
    };

    Promise.all([fetchSkills(), fetchUserSkills()]).finally(() => {
      setLoading(false);
    });
  }, [currentUserId, currentPage, pageSize]); 

  useEffect(() => {
    const selectedSkillIds = userSkills.map(skill => skill.id); 
    setSelected(selectedSkillIds);
  }, [userSkills]);

  const toggleSkill = (skillId) => {
    setSelected((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const saveSkills = async () => {
    if (currentUserId) {
      try {
        await SkillAPI.updateSkill(currentUserId, selected);  
        alert("Skills updated!");
      } catch (error) {
        console.error("Failed to update skills:", error);
        alert("Error saving skills");
      }
    }
  };

  const renderSkillDetails = (skill) => (
    <div className="skill-details">
      <h3>{skill.name}</h3>
      <p>{skill.description}</p>
      {skill.trails && skill.trails.map((trail) => (
        <div key={trail.id} className="trail">
          <h4>{trail.title}</h4>
          <div className="videos">
            {trail.videos && trail.videos.map((video) => (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer">
                {video.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <div className="min-h-screen p-6 pt-40 bg-white">
      <h3 className="text-3xl font-semibold mb-12 text-center text-gray-900">
        Habilidades de Interesse
      </h3>
      <div className="max-w-[570px] mx-auto">
        <motion.div className="flex flex-row gap-3 overflow-visible flex-wrap-nowrap" layout transition={transitionProps}>
          {skills.map((skill) => {
            const isSelected = selected.includes(skill.id);
            return (
              <motion.button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                layout
                initial={false}
                animate={{
                  backgroundColor: isSelected ? '#3B82F6' : '#D1D5DB', 
                }}
                whileHover={{
                  backgroundColor: isSelected ? '#2563EB' : '#60A5FA', 
                }}
                whileTap={{
                  backgroundColor: isSelected ? '#2563EB' : '#2563EB', 
                }}
                transition={{
                  ...transitionProps,
                  backgroundColor: { duration: 0.1 },
                }}
                className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${isSelected ? 'text-white ring-blue-500' : 'text-black ring-gray-400'}`}
              >
                <motion.div
                  className="relative flex items-center"
                  animate={{
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.5rem" : "0",
                  }}
                  transition={{
                    ease: [0.175, 0.885, 0.32, 1.275],
                    duration: 0.3,
                  }}
                >
                  <span>{skill.name}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={transitionProps}
                        className="absolute right-0"
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={1.5} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        <Pagination
          page={currentPage}
          totalPages={Math.ceil(skills.length / pageSize)} 
          onPageChange={(newPage) => setCurrentPage(newPage)} 
        />

        <div className="text-center mt-10">
          <button
            onClick={saveSkills}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
