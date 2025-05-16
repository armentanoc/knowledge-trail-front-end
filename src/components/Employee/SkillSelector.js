"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { SkillAPI } from "./api"
import { useAuth } from "../../context/AuthContext"

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function SkillSelector() {
  const { user } = useAuth()
  const currentUserId = user?.id

  const [skills, setSkills] = useState([])
  const [selected, setSelected] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(50)
  const [currentPage, setCurrentPage] = useState(0)
  const [hoveredSkill, setHoveredSkill] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await SkillAPI.fetchSkills(currentPage, pageSize)
        setSkills(response.content)
      } catch (error) {
        console.error("Failed to fetch skills:", error)
      }
    }

    const fetchUserSkills = async () => {
      if (currentUserId) {
        try {
          const response = await SkillAPI.getSkillById(currentUserId)
          setUserSkills(response)
        } catch (error) {
          console.error("Failed to fetch user skills:", error)
        }
      }
    }

    Promise.all([fetchSkills(), fetchUserSkills()]).finally(() => {
      setLoading(false)
    })
  }, [currentUserId, currentPage, pageSize])

  useEffect(() => {
    const selectedSkillIds = userSkills.map((skill) => skill.id)
    setSelected(selectedSkillIds)
  }, [userSkills])

  const toggleSkill = (skillId) => {
    setSelected((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  const saveSkills = async () => {
    if (currentUserId) {
      try {
        await SkillAPI.updateSkill(currentUserId, selected)
        alert("Skills updated!")
      } catch (error) {
        console.error("Failed to update skills:", error)
        alert("Error saving skills")
      }
    }
  }

  if (loading) {
    return <p>Carregando habilidades...</p>
  }

  return (
    <div className="min-h-screen p-6 pt-40 bg-white">
      <h3 className="text-3xl font-semibold mb-12 text-center text-gray-900">Habilidades de Interesse</h3>
      <div className="max-w-4xl mx-auto">
        <style jsx>{`
          .skill-button {
            display: inline-flex !important;
            width: auto !important;
            height: 40px !important;
            padding: 0 16px !important;
            margin: 5px !important;
            align-items: center !important; 
          }
          
          .description-container {
            min-height: 80px;
            margin-top: 20px;
            padding: 16px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
            transition: all 0.3s ease;
            margin-bottom: 20px;
          }
          
          .description-container.has-content {
            background-color: #1e293b;
            color: white;
          }
          
          [data-theme="dark"] .description-container {
            background-color: #1e293b;
            border-color: #334155;
          }
          
          [data-theme="dark"] .description-container.has-content {
            background-color: #0f172a;
          }
        `}</style>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          layout
          transition={transitionProps}
        >
          {skills.map((skill) => {
            const isSelected = selected.includes(skill.id)
            return (
              <motion.button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                layout
                initial={false}
                animate={{
                  backgroundColor: isSelected ? "#3B82F6" : "#D1D5DB",
                }}
                whileHover={{
                  backgroundColor: isSelected ? "#2563EB" : "#60A5FA",
                }}
                whileTap={{
                  backgroundColor: isSelected ? "#2563EB" : "#2563EB",
                }}
                transition={{
                  ...transitionProps,
                  backgroundColor: { duration: 0.1 },
                }}
                className={`skill-button flex items-center justify-center rounded-full text-base font-medium w-full
                  ${isSelected ? "text-white ring-blue-500" : "text-black ring-gray-400"} 
                  ring-1 ring-inset truncate`}
                style={{
                  height: "40px",
                  padding: "0 16px",
                  display: "inline-flex",
                  margin: 0,
                }}
              >
                <span className="truncate text-center">{skill.name}</span>
                {isSelected && (
                  <span className="ml-2 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={1.5} />
                    </div>
                  </span>
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Separate description container below all buttons */}
        <div className={`description-container ${hoveredSkill ? "has-content" : ""}`}>
          {hoveredSkill ? (
            <div>
              <h4 className="font-medium mb-2">{hoveredSkill.name}</h4>
              <p>{hoveredSkill.description || "Nenhuma descrição disponível para esta habilidade."}</p>
            </div>
          ) : (
            <p className="text-gray-500">Passe o mouse sobre uma habilidade para ver sua descrição</p>
          )}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={saveSkills}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Salvar habilidades
          </button>
        </div>
      </div>
    </div>
  )
}
