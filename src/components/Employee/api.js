// src/components/Admin/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== SKILL API ==========

const fetchSkills = () => apiRequest(`${BASE_URL}/skills?page=0&size=50`);
const getSkillById = (userId) => apiRequest(`${BASE_URL}/users/${userId}/skills`);  
const updateSkill = (userId, selectedSkills) => apiRequest(`${BASE_URL}/users/${userId}/skills`, 'PUT', selectedSkills);
const getUserSkillTrails = (userId) => apiRequest(`${BASE_URL}/users/${userId}/skills`);

export const SkillAPI = {
  fetchSkills,
  getSkillById,
  updateSkill,
  getUserSkillTrails, 
};

// ========== TRAIL PROGRESS API ==========

const getWatchedVideos = (userId, trailId) =>
  apiRequest(`${BASE_URL}/trail-progress?userId=${userId}&trailId=${trailId}`);

const watchVideo = (userId, trailId, videoId) =>
  apiRequest(`${BASE_URL}/trail-progress/watch?userId=${userId}&trailId=${trailId}&videoId=${videoId}`, 'POST');

const unwatchVideo = (userId, trailId, videoId) =>
  apiRequest(`${BASE_URL}/trail-progress/unwatch?userId=${userId}&trailId=${trailId}&videoId=${videoId}`, 'POST');

export const TrailProgressAPI = {
  getWatchedVideos,
  watchVideo,
  unwatchVideo,
};
