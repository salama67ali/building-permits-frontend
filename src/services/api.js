const BASE_URL = 'http://localhost:9090/api';

export async function createProject(payload) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to create project');
  return res.json();
}

export async function listOwnerProjects(ownerId) {
  const res = await fetch(`${BASE_URL}/projects?ownerId=${encodeURIComponent(ownerId)}`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function listPendingProjects() {
  const res = await fetch(`${BASE_URL}/projects?status=submitted`);
  if (!res.ok) throw new Error('Failed to load pending projects');
  return res.json();
}

export async function decideProject(projectId, decision, reviewerId) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, reviewerId }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update decision');
  return res.json();
}

export async function fetchGisAssessment(projectId) {
  const res = await fetch(`${BASE_URL}/gis/assess/${projectId}`);
  if (!res.ok) throw new Error('Failed to load GIS assessment');
  return res.json();
}

export async function assessGeometry(input) {
  const res = await fetch(`${BASE_URL}/gis/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to assess');
  return res.json();
}