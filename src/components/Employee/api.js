// src/components/Admin/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== SKILL API ==========

const fetchSkills = () => apiRequest(`${BASE_URL}/skills?page=0&size=50`);
const getSkillById = (userId) => apiRequest(`${BASE_URL}/users/${userId}/skills`);  
const updateSkill = (userId, selectedSkills) => apiRequest(`${BASE_URL}/users/${userId}/skills`, 'PUT', selectedSkills);

export const SkillAPI = {
  fetchSkills,
  getSkillById,
  updateSkill,
};
