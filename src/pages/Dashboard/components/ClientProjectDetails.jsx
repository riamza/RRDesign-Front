import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Calendar, FileText, CheckCircle, Clock, 
  AlertCircle, Save, X, Plus, Trash2, Edit2, PlayCircle 
} from 'lucide-react';
import { api } from '../../../services/api';
import './ProjectDetails.css';

const ProjectRequirementStatus = {
  0: 'To Do',
  1: 'In Progress',
  2: 'Finished'
};

const ClientProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New requirement state
  const [isAddingReq, setIsAddingReq] = useState(false);
  const [newReq, setNewReq] = useState({ description: '', estimatedDays: 1 });

  // Init
  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await api.getClientProject(id);
      setProject(data);
    } catch (error) {
      console.error(error);
      // Optional: Redirect if not found
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (req, newStatus) => {
    try {
      await api.updateClientProjectRequirement(req.id, { status: newStatus });
      fetchProject(); // Refresh to see updated dates
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };
  
  const handleAddRequirement = async (e) => {
    e.preventDefault();
    try {
      await api.addClientProjectRequirement(id, {
        description: newReq.description,
        estimatedDurationDays: parseInt(newReq.estimatedDays)
      });
      setIsAddingReq(false);
      setNewReq({ description: '', estimatedDays: 1 });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.deleteClientProjectRequirement(reqId);
        fetchProject();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!project) return <div className="p-4">Project not found</div>;

  return (
    <div className="project-details-page">
      <div className="details-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="header-actions">
           {/* Maybe edit project level details here */}
        </div>
      </div>
      
      <div className="project-info-card">
         <div className="project-title-section">
            <h1>{project.title}</h1>
            <span className={`status-pill ${project.endDate ? 'finished' : 'active'}`}>
                {project.endDate ? 'Finished' : 'Active'}
            </span>
         </div>
         
         <div className="info-grid">
             <div className="info-item">
                <label>Client</label>
                <span>{project.userName}</span>
             </div>
             <div className="info-item">
                <label>Start Date</label>
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
             </div>
             {project.endDate && (
                 <div className="info-item">
                    <label>End Date</label>
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                 </div>
             )}
         </div>
         
         <div className="description-section">
             <h3>Description</h3>
             <p>{project.description}</p>
         </div>

         <div className="tech-section">
             <h3>Technologies</h3>
             <div className="tech-tags">
                 {project.technologies.split(',').map((tech, i) => (
                     <span key={i} className="tech-tag">{tech.trim()}</span>
                 ))}
             </div>
         </div>
      </div>

      <div className="requirements-board">
          <div className="board-header">
              <h2>Project Requirements</h2>
              <button className="btn-primary-sm" onClick={() => setIsAddingReq(true)}>
                  <Plus size={16} /> Add Requirement
              </button>
          </div>

          {isAddingReq && (
              <div className="new-req-form">
                  <form onSubmit={handleAddRequirement}>
                      <input 
                        type="text" 
                        placeholder="Requirement description" 
                        value={newReq.description}
                        onChange={e => setNewReq({...newReq, description: e.target.value})}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Est. Days" 
                        min="1"
                        style={{width: '80px'}}
                        value={newReq.estimatedDays}
                        onChange={e => setNewReq({...newReq, estimatedDays: e.target.value})}
                        required
                      />
                      <button type="submit" className="btn-save-sm"><Save size={16}/></button>
                      <button type="button" className="btn-cancel-sm" onClick={() => setIsAddingReq(false)}><X size={16}/></button>
                  </form>
              </div>
          )}

          <div className="req-list-container">
              {project.requirements.length === 0 ? <p className="text-muted">No requirements added yet.</p> : (
                  <div className="req-table">
                      <div className="req-row header">
                          <div className="col-desc">Description</div>
                          <div className="col-est">Est. (Days)</div>
                          <div className="col-dates">Dates</div>
                          <div className="col-status">Status</div>
                          <div className="col-actions">Actions</div>
                      </div>
                      {project.requirements.map(req => (
                          <div key={req.id} className={`req-row status-${req.status}`}>
                              <div className="col-desc">{req.description}</div>
                              <div className="col-est">{req.estimatedDurationDays}d</div>
                              <div className="col-dates">
                                  {req.startDate && <div>Start: {new Date(req.startDate).toLocaleDateString()}</div>}
                                  {req.endDate && <div>End: {new Date(req.endDate).toLocaleDateString()}</div>}
                              </div>
                              <div className="col-status">
                                  <select 
                                    value={req.status} 
                                    onChange={(e) => handleUpdateStatus(req, parseInt(e.target.value))}
                                    className={`status-select status-${req.status}`}
                                  >
                                      <option value={0}>To Do</option>
                                      <option value={1}>In Progress</option>
                                      <option value={2}>Finished</option>
                                  </select>
                              </div>
                              <div className="col-actions">
                                  <button className="btn-icon-danger" onClick={() => handleDeleteRequirement(req.id)}>
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default ClientProjectDetails;
