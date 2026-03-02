import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  invalidatePricing,
  fetchPricing,
} from "../../../store/slices/pricingSlice";
import { api } from "../../../services/api";
import Modal from "../../../components/Modal/Modal";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import PriceCard from "../../../components/PriceCard/PriceCard";
import "./Manager.css";

const PricingManager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: pricing, status } = useSelector((state) => state.pricing);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    features: [""],
    highlight: false,
    isMonthly: false,
    recommendedFor: [""],
  });

  const loadPricing = async () => {
    dispatch(invalidatePricing());
    dispatch(fetchPricing());
  };

  useEffect(() => {
    dispatch(fetchPricing());
  }, [dispatch]);

  const gridRef = useRef(null);

  useEffect(() => {
    if (!pricing || pricing.length === 0) return;

    const alignCardSections = () => {
      if (!gridRef.current) return;

      const headers = gridRef.current.querySelectorAll(".pricing-header");
      const features = gridRef.current.querySelectorAll(".pricing-features");
      const recommended = gridRef.current.querySelectorAll(
        ".pricing-recommended",
      );

      // Reset
      [...headers, ...features, ...recommended].forEach(
        (el) => (el.style.height = "auto"),
      );

      // Calc max
      const maxHeaderHeight = Math.max(
        ...Array.from(headers).map((el) => el.offsetHeight),
      );
      const maxFeaturesHeight = Math.max(
        ...Array.from(features).map((el) => el.offsetHeight),
      );
      const maxRecommendedHeight = Math.max(
        ...Array.from(recommended).map((el) => el.offsetHeight),
      );

      // Apply
      if (headers.length)
        headers.forEach((el) => (el.style.height = `${maxHeaderHeight}px`));
      if (features.length)
        features.forEach((el) => (el.style.height = `${maxFeaturesHeight}px`));
      if (recommended.length)
        recommended.forEach(
          (el) => (el.style.height = `${maxRecommendedHeight}px`),
        );
    };

    alignCardSections();
    window.addEventListener("resize", alignCardSections);
    const timeoutId = setTimeout(alignCardSections, 100);

    return () => {
      window.removeEventListener("resize", alignCardSections);
      clearTimeout(timeoutId);
    };
  }, [pricing]);

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title,
      price: pkg.price,
      description: pkg.description,
      features: [...pkg.features],
      highlight: pkg.highlight,
      isMonthly: pkg.isMonthly ?? false,
      recommendedFor: Array.isArray(pkg.recommendedFor)
        ? [...pkg.recommendedFor]
        : [""],
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = (pkg) => {
    setDeleteId(pkg.id);
    setDeleteItemName(pkg.title);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deletePricing(deleteId);
      await loadPricing();
    } catch (e) {
      console.error(e);
    }
    setDeleteId(null);
    setShowConfirmDelete(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updatePricing(editingId, formData);
      } else {
        await api.createPricing(formData);
      }
      await loadPricing();
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      features: [""],
      highlight: false,
      isMonthly: false,
      recommendedFor: [""],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <button
          className="button button-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          {"+ " + t("dashboard.pricingManager.add")}
        </button>
      </div>

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={
          editingId
            ? t("dashboard.pricingManager.edit")
            : t("dashboard.pricingManager.add")
        }
      >
        <form
          className="manager-form"
          onSubmit={handleSubmit}
          style={{ margin: 0, padding: 0, border: "none", boxShadow: "none" }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>{t("dashboard.pricingManager.title")}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>{t("dashboard.pricingManager.price")}</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="1500"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t("dashboard.pricingManager.description")}</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{t("dashboard.pricingManager.recommendedFor")}</label>
            {formData.recommendedFor.map((rec, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={rec}
                  onChange={(e) =>
                    handleArrayChange("recommendedFor", index, e.target.value)
                  }
                  placeholder={t(
                    "dashboard.pricingManager.recommendedForPlaceholder",
                  )}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeArrayItem("recommendedFor", index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem("recommendedFor")}
            >
              {"+ " + t("dashboard.pricingManager.addRecommendation")}
            </button>
          </div>

          <div className="form-checkbox-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="check-highlight"
                checked={formData.highlight}
                onChange={(e) =>
                  setFormData({ ...formData, highlight: e.target.checked })
                }
              />
              <label htmlFor="check-highlight">
                {t("dashboard.pricingManager.highlight")}
              </label>
            </div>

            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="check-monthly"
                checked={formData.isMonthly}
                onChange={(e) =>
                  setFormData({ ...formData, isMonthly: e.target.checked })
                }
              />
              <label htmlFor="check-monthly">
                {t("dashboard.pricingManager.isMonthly")}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t("dashboard.pricingManager.features")}</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleArrayChange("features", index, e.target.value)
                  }
                  placeholder={t("dashboard.pricingManager.featurePlaceholder")}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeArrayItem("features", index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => addArrayItem("features")}
            >
              {"+ " + t("dashboard.pricingManager.addFeature")}
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              {editingId
                ? t("dashboard.pricingManager.update")
                : t("dashboard.pricingManager.save")}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              {t("dashboard.pricingManager.cancel")}
            </button>
          </div>
        </form>
      </Modal>

      <div className="services-manager-grid" ref={gridRef}>
        {pricing.map((pkg) => (
          <PriceCard
            key={pkg.id}
            pkg={pkg}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title={t("dashboard.pricingManager.confirmDelete")}
        message={`Ești sigur că vrei să ștergi pachetul "${deleteItemName}"? Această acțiune nu poate fi anulată.`}
      />
    </div>
  );
};

export default PricingManager;
