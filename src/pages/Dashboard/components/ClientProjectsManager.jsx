import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  invalidateClientProjects,
  fetchClientProjects,
} from "../../../store/slices/clientProjectsSlice";
import { fetchUsers } from "../../../store/slices/usersSlice";
import {
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
  Calendar,
  User,
  Mail,
  Briefcase,
} from "lucide-react";
import { api } from "../../../services/api";
import Modal from "../../../components/Modal/Modal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import InvitationSuccessModal from "../../../components/InvitationSuccessModal/InvitationSuccessModal";
import "./Manager.css";

const ClientProjectsManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: projects, status } = useSelector(
    (state) => state.clientProjects,
  );
  const { items: usersList } = useSelector((state) => state.users);
  const isLoading = status === "loading";

  // Modal States
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  // Data States
  const [editingId, setEditingId] = useState(null);
  const [deleteProjectData, setDeleteProjectData] = useState(null);
  const [finishProjectData, setFinishProjectData] = useState(null);
  const [invitationSuccessData, setInvitationSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    estimatedPrice: "",
    currency: "EUR",
    startDate: new Date().toISOString().split("T")[0],
    userId: "",
    newUserEmail: "",
  });

  useEffect(() => {
    dispatch(fetchClientProjects());
  }, [dispatch]);

  useEffect(() => {
    if (isExistingUser) {
      dispatch(fetchUsers());
    }
  }, [isExistingUser, dispatch]);

  const reloadProjects = async () => {
    dispatch(invalidateClientProjects());
    dispatch(fetchClientProjects());
  };

  const resetForm = () => {
    setEditingId(null);
    setIsExistingUser(false);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      estimatedPrice: "",
      currency: "EUR",
      startDate: new Date().toISOString().split("T")[0],
      userId: "",
      newUserEmail: "",
    });
    setShowForm(false);
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingId(project.id);
    setIsExistingUser(true); // Editing always implies existing user
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      estimatedPrice: project.estimatedPrice || "",
      currency: project.currency || "EUR",
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      userId: project.userId,
      newUserEmail: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
          currency: formData.currency,
        startDate: formData.startDate,
        // If existing user checkbox is checked, send userId. Else send email.
        userId: isExistingUser
          ? formData.userId
            ? parseInt(formData.userId)
            : null
          : null,
        newUserEmail: !isExistingUser ? formData.newUserEmail : null,
      };

      if (editingId) {
        await api.updateClientProject(editingId, payload);
      } else {
        const response = await api.createClientProject(payload);
        if (response && response.invitationLink) {
          setInvitationSuccessData({
            email: payload.newUserEmail,
            link: response.invitationLink,
          });
        }
      }
      setShowForm(false);
      resetForm();
      reloadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      if (error.message && error.message.startsWith("error.")) {
        setErrorMessage(t(error.message, error.message));
      } else {
        setErrorMessage(
          t(
            "dashboard.clientProjects.saveError",
            "A apărut o eroare la salvarea proiectului:",
          ) +
            " " +
            error.message,
        );
      }
    }
  };

  const handleDeleteClick = (project, e) => {
    e.stopPropagation();
    setDeleteProjectData(project);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteProjectData) {
      try {
        await api.deleteClientProject(deleteProjectData.id);
        reloadProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
    setShowConfirmDelete(false);
    setDeleteProjectData(null);
  };

  const handleFinish = (project, e) => {
    e.stopPropagation();
    setFinishProjectData(project);
    setShowConfirmFinish(true);
  };

  const confirmFinish = async () => {
    if (finishProjectData) {
      try {
        await api.markClientProjectFinished(finishProjectData.id);
        reloadProjects();
      } catch (error) {
        console.error("Error marking finished:", error);
      }
    }
    setShowConfirmFinish(false);
    setFinishProjectData(null);
  };

  const handleCardClick = (id) => {
    navigate(`/dashboard/client-projects/${id}`);
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>
          <User size={24} />
          {t("dashboard.clientProjectsManager.title")}
        </h2>
        <button
          className="button button-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          {t("dashboard.clientProjectsManager.addProject")}
        </button>
      </div>

      <div className="services-manager-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card ${project.isFinished ? "finished opacity-90" : ""}`}
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="project-card-header">
              <div className="project-card-status">
                {project.isFinished
                  ? `${t("dashboard.clientProjectsManager.status.finished").toUpperCase()} - ${new Date(project.endDate).toLocaleDateString()}`
                  : t(
                      "dashboard.clientProjectsManager.status.active",
                    ).toUpperCase()}
              </div>
            </div>

            <div className="project-card-content">
              <div className="project-icon-wrapper">
                <Briefcase size={28} />
              </div>

              <h3 className="project-title" title={project.title}>
                {project.title}
              </h3>

              <div
                className="project-client-chip"
                title={`${project.clientName} (${project.clientEmail || t("dashboard.clientProjectsManager.noEmail")})`}
              >
                <User size={14} />
                <span className="truncate max-w-[200px] font-medium">
                  {project.clientName ||
                    t("dashboard.clientProjectsManager.unknownClient")}
                </span>
              </div>

              {project.estimatedPrice && (
                  <div className="project-price" style={{ marginTop: '10px', padding: '6px 10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.95em', color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #e9ecef' }}>
                    <span style={{color: '#6c757d', fontWeight: 'normal'}}>{t("estimatedPrice", "Preț Estimat")}:</span> {project.estimatedPrice} {project.currency || "EUR"}
                  </div>
                )}

              <div
                className="project-actions"
                onClick={(e) => e.stopPropagation()}
              >
                {!project.isFinished && (
                  <button
                    className="action-icon-btn finish"
                    title={t(
                      "dashboard.clientProjectsManager.markFinished",
                      "Marchează ca finalizat",
                    )}
                    onClick={(e) => handleFinish(project, e)}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  className="action-icon-btn edit"
                  title={t(
                    "dashboard.clientProjectsManager.editProject",
                    "Editează proiectul",
                  )}
                  onClick={(e) => handleEdit(project, e)}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="action-icon-btn delete"
                  title={t(
                    "dashboard.clientProjectsManager.delete",
                    "Șterge proiectul",
                  )}
                  onClick={(e) => handleDeleteClick(project, e)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={
          editingId
            ? t("dashboard.clientProjectsManager.editProject")
            : t("dashboard.clientProjectsManager.newProject")
        }
      >
        <form
          onSubmit={handleSubmit}
          className="manager-form"
          style={{ padding: 0, boxShadow: "none" }}
        >
          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">
              {t("dashboard.clientProjectsManager.form.title")}
            </label>
            <input
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">
              {t("dashboard.clientProjectsManager.form.assignedClient")}
            </label>

            {!editingId && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="existUser"
                  checked={isExistingUser}
                  onChange={(e) => setIsExistingUser(e.target.checked)}
                  className="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="existUser"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  {t("dashboard.clientProjectsManager.form.existingUser")}
                </label>
              </div>
            )}

            <div className="relative">
              {isExistingUser ? (
                <select
                  className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  required
                >
                  <option value="">
                    {t("dashboard.clientProjectsManager.form.selectUser")}
                  </option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.userName} ({u.email})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.newUserEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, newUserEmail: e.target.value })
                  }
                  required
                  placeholder={t(
                    "dashboard.clientProjectsManager.form.emailPlaceholder",
                  )}
                />
              )}
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">
              {t("dashboard.clientProjectsManager.form.description")}
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">
              {t("dashboard.clientProjectsManager.form.technologies")}
            </label>
            <input
              className="w-full p-2 border rounded"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              placeholder={t(
                "dashboard.clientProjectsManager.form.technologiesPlaceholder",
              )}
            />
          </div>
          
          <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1 font-semibold">
                {t("dashboard.clientProjectsManager.form.estimatedPrice") || "Estimated Price"}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={formData.estimatedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedPrice: e.target.value })
                  }
                  placeholder="Ex: 500"
                />
                <select
                  className="p-2 border rounded"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                >
                  <option value="EUR">€ (EUR)</option>
                  <option value="RON">Lei (RON)</option>
                  <option value="USD">$ (USD)</option>
                </select>
              </div>
            </div>

          <div className="form-group mb-4">
            <label className="block text-sm font-medium mb-1 font-semibold">
              {t("dashboard.clientProjectsManager.form.startDate")}
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>

          <div
            className="form-actions modal-actions"
            style={{ justifyContent: "flex-end", marginTop: "1.5rem" }}
          >
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t("dashboard.clientProjectsManager.form.cancel")}
            </button>
            <button type="submit" className="button button-primary">
              {isExistingUser
                ? t("dashboard.clientProjectsManager.form.save")
                : t("dashboard.clientProjectsManager.form.create")}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t("common.confirmDelete", "Confirmare ștergere")}
        message={t(
          "dashboard.clientProjectsManager.deleteMessageFull",
          "Ești sigur că vrei să ștergi proiectul {{name}} pentru clientul {{client}}?",
          {
            name: deleteProjectData?.title || "",
            client:
              deleteProjectData?.clientName ||
              deleteProjectData?.clientEmail ||
              "",
          },
        )}
      />

      <ConfirmModal
        isOpen={showConfirmFinish}
        onClose={() => setShowConfirmFinish(false)}
        onConfirm={confirmFinish}
        title={t(
          "dashboard.clientProjectsManager.confirmFinishTitle",
          "Confirmare Finalizare Proiect",
        )}
        message={t(
          "dashboard.clientProjectsManager.confirmFinishMessage",
          "Ești sigur că vrei să marchezi proiectul {{name}} ca fiind finalizat?",
          { name: finishProjectData?.title || "" },
        )}
      />

      <InvitationSuccessModal
        isOpen={!!invitationSuccessData}
        onClose={() => setInvitationSuccessData(null)}
        email={invitationSuccessData?.email}
        invitationLink={invitationSuccessData?.link}
      />

      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        title={t("common.error", "Eroare")}
      >
        <p style={{ color: "#ef4444" }}>{errorMessage}</p>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="button button-primary"
            onClick={() => setErrorMessage("")}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ClientProjectsManager;

