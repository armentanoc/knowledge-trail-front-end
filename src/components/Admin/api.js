// src/components/Admin/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== USER API ==========
const fetchUsers = () => apiRequest(`${BASE_URL}/users`);

const removeUser = (userId, adminId) => {
  if (!adminId) throw new Error('adminId is required');
  return apiRequest(`${BASE_URL}/users/${userId}`, 'POST', { adminId });
};

const updateUser = (userId, userData, adminId) => {
  if (!adminId) throw new Error('adminId is required');

  const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== undefined)
  );

  return apiRequest(`${BASE_URL}/users/${userId}`, 'PATCH', {
    ...filteredData,
    adminId,
  });
};

// ========== SKILL API ==========
const fetchSkills = () => apiRequest(`${BASE_URL}/skills?page=0&size=50`);
const createSkill = (skillData) => apiRequest(`${BASE_URL}/skills`, 'POST', skillData);
const deleteSkill = (skillId) => apiRequest(`${BASE_URL}/skills/${skillId}`, 'DELETE');
const updateSkill = (skillId, data) => apiRequest(`${BASE_URL}/skills/${skillId}`, 'PATCH', data);
const getSkillById = (skillId) => apiRequest(`${BASE_URL}/skills/${skillId}`);
const searchSkillByName = (name) => apiRequest(`${BASE_URL}/skills/search?name=${encodeURIComponent(name)}`);

// ========== TRAIL API ==========
const fetchTrails = () => apiRequest(`${BASE_URL}/trails`);
const createTrail = (trailData) => apiRequest(`${BASE_URL}/trails`, 'POST', trailData);
const deleteTrail = (trailId) => apiRequest(`${BASE_URL}/trails/${trailId}`, 'DELETE');
const updateTrail = (trailId, trailData) => apiRequest(`${BASE_URL}/trails/${trailId}`, 'PATCH', trailData);
const getTrailVideos = (trailId) => apiRequest(`${BASE_URL}/trails/${trailId}/videos`);
const addTrailVideos = (trailId, videoData) => apiRequest(`${BASE_URL}/trails/${trailId}/videos`, 'PATCH', videoData);
const replaceTrailVideos = (trailId, videoData) => apiRequest(`${BASE_URL}/trails/${trailId}/videos`, 'PUT', videoData);
const getTrailSkill = (trailId) => apiRequest(`${BASE_URL}/trails/${trailId}/skill`);

// ========== VERIFY PROGRESS API ==========
const fetchEmployeesBySkill = (skillId) =>
    apiRequest(`${BASE_URL}/trail-progress/employees-by-skill?skillId=${skillId}`);

const fetchSkillsByUser = (userId) =>
    apiRequest(`${BASE_URL}/trail-progress/skills-by-user?userId=${userId}`);

// ========== EXPORTS ==========
export const UserAPI = {
  fetchUsers,
  removeUser,
  updateUser,
};

export const SkillAPI = {
  fetchSkills,
  createSkill,
  deleteSkill,
  updateSkill,
  getSkillById,
  searchSkillByName,
};

export const TrailAPI = {
  fetchTrails,
  createTrail,
  deleteTrail,
  updateTrail,
  getTrailVideos,
  addTrailVideos,
  replaceTrailVideos,
  getTrailSkill,
};

export const VerifyProgressAPI = {
  fetchEmployeesBySkill,
  fetchSkillsByUser,
};
