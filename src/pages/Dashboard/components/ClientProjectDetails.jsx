import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  X,
  Plus,
  Trash2,
  Edit2,
  PlayCircle,
  ChevronDown,
  Check,
  Info,
} from "lucide-react";
import { api } from "../../../services/api";
import Modal from "../../../components/Modal/Modal";
import "./ProjectDetails.css";

const StatusDropdown = ({ status, onChange, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: 0, label: t("dashboard.clientProjectDetails.statusTodo") },
    { value: 1, label: t("dashboard.clientProjectDetails.statusInProgress") },
    { value: 2, label: t("dashboard.clientProjectDetails.statusFinished") },
  ];

  const currentOption = options.find((o) => o.value === status) || options[0];

  const getStatusClass = (val) => {
    switch (val) {
      case 0:
        return "status-0";
      case 1:
        return "status-1";
      case 2:
        return "status-2";
      default:
        return "";
    }
  };

  return (
    <div className="custom-status-dropdown" ref={dropdownRef}>
      <button
        className={`status-trigger ${getStatusClass(status)}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentOption.label}
        <ChevronDown size={14} className="ml-2" />
      </button>
      {isOpen && (
        <div className="status-menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`status-option ${status === opt.value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span
                className={`status-dot ${getStatusClass(opt.value)}`}
              ></span>
              {opt.label}
              {status === opt.value && (
                <Check size={14} className="check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClientProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // New requirement state
  const [isAddingReq, setIsAddingReq] = useState(false);
  const [editingReqId, setEditingReqId] = useState(null);
  const [newReq, setNewReq] = useState({
    title: "",
    description: "",
    estimatedDays: 1,
  });

  // Reject state
  const [isRejectingReq, setIsRejectingReq] = useState(false);
  const [reqToReject, setReqToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    [],
  );

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
      if (editingReqId) {
        // Check if we are resubmitting a rejected requirement
        const currentReq = project.requirements.find(
          (r) => r.id === editingReqId,
        );
        let statusToUpdate = currentReq.status;

        // If it was rejected and Client edits it, it becomes Proposed (3) again
        if (currentReq.status === 4 && user?.role === "Client") {
          statusToUpdate = 3; // Proposed
        }

        await api.updateClientProjectRequirement(editingReqId, {
          status: statusToUpdate,
          title: newReq.title,
          description: newReq.description,
          estimatedDurationDays:
            user?.role === "Admin" ? parseInt(newReq.estimatedDays) : undefined,
        });
      } else {
        const reqData = {
          title: newReq.title,
          description: newReq.description,
          estimatedDurationDays:
            user?.role === "Admin" ? parseInt(newReq.estimatedDays) : 0, // Client proposals have 0 days initially
        };

        if (user?.role === "Client") {
          await api.proposeClientProjectRequirement(id, reqData);
          alert(
            t("dashboard.clientProjectDetails.proposalSent") ||
              "Proposal sent!",
          );
        } else {
          await api.addClientProjectRequirement(id, reqData);
        }
      }
      setIsAddingReq(false);
      setEditingReqId(null);
      setNewReq({ title: "", description: "", estimatedDays: 1 });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  const openAddModal = () => {
    setEditingReqId(null);
    setNewReq({ title: "", description: "", estimatedDays: 1 });
    setIsAddingReq(true);
  };

  const openEditModal = (req) => {
    setEditingReqId(req.id);
    setNewReq({
      title: req.title,
      description: req.description,
      estimatedDays: req.estimatedDurationDays,
    });
    setIsAddingReq(true);
  };

  const handleApprove = async (req) => {
    try {
      // 0 = ToDo
      await api.updateClientProjectRequirement(req.id, { status: 0 });
      fetchProject();
    } catch (e) {
      console.error(e);
    }
  };

  const openRejectModal = (req) => {
    setReqToReject(req);
    setRejectReason("");
    setIsRejectingReq(true);
  };

  const submitReject = async () => {
    if (!reqToReject) return;
    try {
      // 4 = Rejected
      await api.updateClientProjectRequirement(reqToReject.id, {
        status: 4,
        rejectionReason: rejectReason,
      });
      setIsRejectingReq(false);
      setReqToReject(null);
      fetchProject();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    if (window.confirm(t("dashboard.clientProjectDetails.confirmDelete"))) {
      try {
        await api.deleteClientProjectRequirement(reqId);
        fetchProject();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading)
    return (
      <div className="p-4">{t("dashboard.clientProjectDetails.loading")}</div>
    );
  if (!project)
    return (
      <div className="p-4">{t("dashboard.clientProjectDetails.notFound")}</div>
    );

  const activeReqs = project.requirements.filter((r) =>
    [0, 1, 2].includes(r.status),
  );
  const proposedReqs = project.requirements.filter((r) =>
    [3, 4].includes(r.status),
  );

  return (
    <div className="project-details-page">
      <div className="details-header">
        <button
          className="btn-back"
          onClick={() => {
            if (location.pathname.includes("/my-projects")) {
              navigate("/my-projects");
            } else {
              navigate("/dashboard?tab=client-projects");
            }
          }}
        >
          <ArrowLeft size={20} />{" "}
          {location.pathname.includes("/my-projects")
            ? t("app.back") || "Back"
            : t("dashboard.clientProjectDetails.backToDashboard")}
        </button>
      </div>

      <div className="project-info-card">
        <div className="project-title-section">
          <h1>{project.title}</h1>
          <span
            className={`status-pill ${project.endDate ? "finished" : "active"}`}
          >
            {project.endDate
              ? t("dashboard.clientProjectDetails.finished")
              : t("dashboard.clientProjectDetails.active")}
          </span>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>{t("dashboard.clientProjectDetails.client")}</label>
            <span>{project.userName}</span>
          </div>
          <div className="info-item">
            <label>{t("dashboard.clientProjectDetails.startDate")}</label>
            <span>{formatDate(project.startDate)}</span>
          </div>
          {project.endDate && (
            <div className="info-item">
              <label>{t("dashboard.clientProjectDetails.endDate")}</label>
              <span>{formatDate(project.endDate)}</span>
            </div>
          )}
        </div>

        <div className="description-section">
          <h3>{t("dashboard.clientProjectDetails.description")}</h3>
          <p>{project.description}</p>
        </div>

        <div className="tech-section">
          <h3>{t("dashboard.clientProjectDetails.technologies")}</h3>
          <div className="tech-tags">
            {project.technologies.split(",").map((tech, i) => (
              <span key={i} className="tech-tag">
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="requirements-board">
        <div className="board-header">
          <h2>{t("dashboard.clientProjectDetails.requirementsSimple")}</h2>
          <button className="btn-primary-sm" onClick={openAddModal}>
            <Plus size={16} />{" "}
            {user?.role === "Client"
              ? t("dashboard.clientProjectDetails.proposeRequirement") ||
                "Propose Requirement"
              : t("dashboard.clientProjectDetails.addRequirement")}
          </button>
        </div>

        <Modal
          isOpen={isAddingReq}
          onClose={() => setIsAddingReq(false)}
          title={
            editingReqId
              ? t("dashboard.clientProjectDetails.modal.editTitle")
              : user?.role === "Client"
                ? t("dashboard.clientProjectDetails.proposeRequirement")
                : t("dashboard.clientProjectDetails.modal.title")
          }
        >
          <form
            onSubmit={handleAddRequirement}
            className="add-requirement-form flex flex-col gap-4"
          >
            {/* Show Rejection Reason if editing a rejected requirement */}
            {editingReqId &&
              (() => {
                const r = project?.requirements?.find(
                  (x) => x.id === editingReqId,
                );
                if (r?.status === 4 && r?.rejectionReason) {
                  return (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-2 text-sm">
                      <div className="font-bold flex items-center gap-2">
                        <AlertCircle size={16} />
                        {t("dashboard.clientProjectDetails.rejectionReason")}:
                      </div>
                      <div className="mt-1">{r.rejectionReason}</div>
                    </div>
                  );
                }
                return null;
              })()}

            <div className="form-group">
              <label>
                {t("dashboard.clientProjectDetails.modal.reqTitle")}
              </label>
              <input
                type="text"
                placeholder={t(
                  "dashboard.clientProjectDetails.modal.reqTitlePlaceholder",
                )}
                value={newReq.title}
                onChange={(e) =>
                  setNewReq({ ...newReq, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.clientProjectDetails.modal.reqDesc")}</label>
              <ReactQuill
                theme="snow"
                value={newReq.description}
                onChange={(value) =>
                  setNewReq({ ...newReq, description: value })
                }
                modules={quillModules}
                placeholder={t(
                  "dashboard.clientProjectDetails.modal.reqDescPlaceholder",
                )}
              />
            </div>

            {/* Hide Estimation for Clients */}
            {user?.role === "Admin" && (
              <div className="form-group">
                <label>
                  {t("dashboard.clientProjectDetails.modal.reqEst")}
                </label>
                <input
                  type="number"
                  placeholder={t(
                    "dashboard.clientProjectDetails.modal.reqEstPlaceholder",
                  )}
                  min="1"
                  value={newReq.estimatedDays}
                  onChange={(e) =>
                    setNewReq({ ...newReq, estimatedDays: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel-sm"
                onClick={() => setIsAddingReq(false)}
              >
                {t("dashboard.clientProjectDetails.modal.cancel")}
              </button>
              <button type="submit" className="btn-primary-sm">
                {editingReqId
                  ? user?.role === "Client" &&
                    project?.requirements?.find((r) => r.id === editingReqId)
                      ?.status === 4
                    ? t("dashboard.clientProjectDetails.resubmit")
                    : t("dashboard.clientProjectDetails.modal.save")
                  : user?.role === "Client"
                    ? t("dashboard.clientProjectDetails.proposeRequirement")
                    : t("dashboard.clientProjectDetails.modal.add")}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isRejectingReq}
          onClose={() => setIsRejectingReq(false)}
          title={t("dashboard.clientProjectDetails.rejectModal.title")}
        >
          <div className="flex flex-col gap-4 p-2">
            <div className="form-group">
              <label>
                {t("dashboard.clientProjectDetails.rejectModal.reasonLabel")}
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder={t(
                  "dashboard.clientProjectDetails.rejectModal.reasonPlaceholder",
                )}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel-sm"
                onClick={() => setIsRejectingReq(false)}
              >
                {t("dashboard.clientProjectDetails.rejectModal.cancel")}
              </button>
              <button
                className="btn-danger-sm"
                onClick={submitReject}
                disabled={!rejectReason.trim()}
              >
                <X size={16} />
                {t("dashboard.clientProjectDetails.rejectModal.submit")}
              </button>
            </div>
          </div>
        </Modal>

        <div className="req-list-container">
          {/* PROPOSED AND REJECTED REQUIREMENTS TABLE */}
          {proposedReqs.length > 0 && (
            <div className="mb-8 proposed-section">
              <h3 className="text-lg font-bold mb-4 text-orange-600 flex items-center gap-2">
                <AlertCircle size={20} />
                {t("dashboard.clientProjectDetails.proposedRequirements") ||
                  "Proposed Requirements"}
              </h3>
              <div className="req-table">
                <div className="req-row req-header">
                  <div className="col-idx">#</div>
                  <div className="col-desc" style={{ flex: 2 }}>
                    {t("dashboard.clientProjectDetails.reqTitle")}
                  </div>
                  <div className="col-est">
                    {t("dashboard.clientProjectDetails.reqEst")}
                  </div>
                  <div className="col-status">
                    {t("dashboard.clientProjectDetails.reqStatus")}
                  </div>
                  <div className="col-actions">
                    {t("dashboard.clientProjectDetails.reqActions")}
                  </div>
                </div>
                {proposedReqs.map((req, index) => (
                  <div
                    key={req.id}
                    className={`req-row status-row-${req.status}`}
                  >
                    <div className="col-idx">{index + 1}</div>
                    <div className="col-desc" style={{ flex: 2 }}>
                      <div
                        className="text-gray-900"
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "700",
                          marginBottom: "5px",
                        }}
                      >
                        {req.title}
                      </div>
                      <div
                        className="text-sm text-gray-600 ql-editor-display"
                        dangerouslySetInnerHTML={{ __html: req.description }}
                      />

                      {/* Show Rejection Reason if Rejected */}
                      {req.status === 4 && req.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          <strong>
                            {t(
                              "dashboard.clientProjectDetails.rejectionReason",
                            )}
                            :
                          </strong>{" "}
                          {req.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="col-est">{req.estimatedDurationDays}d</div>
                    <div className="col-status">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 3 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}
                      >
                        {req.status === 3 ? "PROPOSED" : "REJECTED"}
                      </span>
                    </div>
                    <div className="col-actions">
                      {user?.role === "Admin" && req.status === 3 && (
                        <div className="flex gap-2">
                          <button
                            className="btn-icon-primary"
                            onClick={() => handleApprove(req)}
                            title={t("dashboard.clientProjectDetails.approve")}
                          >
                            <Check size={20} />
                          </button>
                          <button
                            className="btn-icon-danger"
                            onClick={() => openRejectModal(req)}
                            title={t("dashboard.clientProjectDetails.reject")}
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}

                      {/* Client can Edit rejected proposals to resubmit */}
                      {user?.role === "Client" && req.status === 4 && (
                        <button
                          className="btn-icon-primary"
                          onClick={() => openEditModal(req)}
                          title={t("dashboard.clientProjectDetails.resubmit")}
                        >
                          <Edit2 size={20} />
                        </button>
                      )}

                      <button
                        className="btn-icon-danger"
                        onClick={() => handleDeleteRequirement(req.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE REQUIREMENTS TABLE */}
          <div style={{ marginTop: "60px" }}>
            <h3 className="text-lg font-bold mb-4 text-gray-700">
              {t("dashboard.clientProjectDetails.requirements")}
            </h3>
          </div>
          {activeReqs.length === 0 ? (
            <p className="text-muted">
              {t("dashboard.clientProjectDetails.noRequirements")}
            </p>
          ) : (
            <div className="req-table">
              <div className="req-row req-header">
                <div className="col-idx">#</div>
                <div className="col-desc" style={{ flex: 2 }}>
                  {t("dashboard.clientProjectDetails.reqTitle")}
                </div>
                <div className="col-est">
                  {t("dashboard.clientProjectDetails.reqEst")}
                </div>
                <div className="col-dates">
                  {t("dashboard.clientProjectDetails.reqDates")}
                </div>
                <div className="col-status">
                  {t("dashboard.clientProjectDetails.reqStatus")}
                </div>
                <div className="col-actions">
                  {t("dashboard.clientProjectDetails.reqActions")}
                </div>
              </div>
              {activeReqs.map((req, index) => (
                <div
                  key={req.id}
                  className={`req-row status-row-${req.status}`}
                >
                  <div className="col-idx">{index + 1}</div>
                  <div className="col-desc" style={{ flex: 2 }}>
                    <div
                      className="text-gray-900"
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "800",
                        borderBottom: "1px solid rgba(0,0,0,0.15)",
                        paddingBottom: "10px",
                        marginBottom: "10px",
                        lineHeight: "1.2",
                      }}
                    >
                      {req.title ||
                        t("dashboard.clientProjectDetails.untitled")}
                    </div>
                    <div
                      className="text-sm text-gray-600 ql-editor-display"
                      dangerouslySetInnerHTML={{ __html: req.description }}
                    />
                  </div>
                  <div className="col-est">{req.estimatedDurationDays}d</div>
                  <div className="col-dates">
                    {req.startDate && (
                      <div>
                        {t("dashboard.clientProjectDetails.start")}:{" "}
                        {formatDate(req.startDate)}
                      </div>
                    )}
                    {req.endDate && (
                      <div>
                        {t("dashboard.clientProjectDetails.end")}:{" "}
                        {formatDate(req.endDate)}
                      </div>
                    )}
                  </div>
                  <div className="col-status">
                    {user?.role === "Admin" ? (
                      <StatusDropdown
                        status={req.status}
                        onChange={(val) => handleUpdateStatus(req, val)}
                        t={t}
                      />
                    ) : (
                      <div
                        className={`status-pill ${req.status === 2 ? "finished" : "active"}`}
                        style={{ display: "inline-block" }}
                      >
                        {req.status === 0
                          ? t("dashboard.clientProjectDetails.statusTodo")
                          : req.status === 1
                            ? t(
                                "dashboard.clientProjectDetails.statusInProgress",
                              )
                            : t(
                                "dashboard.clientProjectDetails.statusFinished",
                              )}
                      </div>
                    )}
                  </div>
                  <div className="col-actions">
                    {user?.role === "Admin" && (
                      <>
                        <button
                          className="btn-icon-primary"
                          onClick={() => openEditModal(req)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon-danger"
                          onClick={() => handleDeleteRequirement(req.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
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
