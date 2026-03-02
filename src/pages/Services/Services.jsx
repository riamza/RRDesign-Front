import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Info } from "lucide-react";
import { fetchServices } from "../../store/slices/servicesSlice";
import { fetchPricing } from "../../store/slices/pricingSlice";
import "./Services.css";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import PriceCard from "../../components/PriceCard/PriceCard";
import SEO from "../../components/SEO/SEO";

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const pricingRef = useRef(null);
  const dispatch = useDispatch();
  const { items: services, status: servicesStatus } = useSelector(
    (state) => state.services,
  );
  const { items: pricingPackages, status: pricingStatus } = useSelector(
    (state) => state.pricing,
  );
  const loading = servicesStatus === "loading" || pricingStatus === "loading";

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchPricing());
  }, [dispatch]);

  useEffect(() => {
    const alignCardSections = () => {
      if (!gridRef.current) return;

      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        const headers = gridRef.current.querySelectorAll(".service-header");
        const descriptions = gridRef.current.querySelectorAll(
          ".service-description",
        );
        const features = gridRef.current.querySelectorAll(".service-features");
        const techs = gridRef.current.querySelectorAll(".service-tech");

        if (headers.length === 0) return;

        // Reset heights to auto first
        [...headers, ...descriptions, ...features, ...techs].forEach((el) => {
          el.style.height = "auto";
        });

        // Helper to get max height
        const getMaxHeight = (elements) => {
          if (!elements || elements.length === 0) return 0;
          return Math.max(...Array.from(elements).map((el) => el.offsetHeight));
        };

        // Calculate max heights
        const maxHeaderHeight = getMaxHeight(headers);
        const maxDescHeight = getMaxHeight(descriptions);
        const maxFeaturesHeight = getMaxHeight(features);
        const maxTechHeight = getMaxHeight(techs);

        // Apply max heights
        if (maxHeaderHeight > 0)
          headers.forEach((el) => (el.style.height = `${maxHeaderHeight}px`));
        if (maxDescHeight > 0)
          descriptions.forEach(
            (el) => (el.style.height = `${maxDescHeight}px`),
          );
        if (maxFeaturesHeight > 0)
          features.forEach(
            (el) => (el.style.height = `${maxFeaturesHeight}px`),
          );
        if (maxTechHeight > 0)
          techs.forEach((el) => (el.style.height = `${maxTechHeight}px`));
      }, 50);
    };

    const alignPricingCards = () => {
      if (!pricingRef.current) return;
      // Use a timeout to ensure rendering is complete
      setTimeout(() => {
        const headers = pricingRef.current.querySelectorAll(".pricing-header");
        const features =
          pricingRef.current.querySelectorAll(".pricing-features");
        const recommended = pricingRef.current.querySelectorAll(
          ".pricing-recommended",
        );

        if (headers.length === 0) return;

        const getMaxHeight = (elements) => {
          if (!elements || elements.length === 0) return 0;
          return Math.max(...Array.from(elements).map((el) => el.offsetHeight));
        };

        // Reset
        [...headers, ...features, ...recommended].forEach(
          (el) => (el.style.height = "auto"),
        );

        // Calc max
        const maxHeaderHeight = getMaxHeight(headers);
        const maxFeaturesHeight = getMaxHeight(features);
        const maxRecommendedHeight = getMaxHeight(recommended);

        // Apply
        if (maxHeaderHeight > 0)
          headers.forEach((el) => (el.style.height = `${maxHeaderHeight}px`));
        if (maxFeaturesHeight > 0)
          features.forEach(
            (el) => (el.style.height = `${maxFeaturesHeight}px`),
          );
        if (maxRecommendedHeight > 0)
          recommended.forEach(
            (el) => (el.style.height = `${maxRecommendedHeight}px`),
          );
      }, 50);
    };

    alignCardSections();
    alignPricingCards();
    window.addEventListener("resize", alignCardSections);
    window.addEventListener("resize", alignPricingCards);

    return () => {
      window.removeEventListener("resize", alignCardSections);
      window.removeEventListener("resize", alignPricingCards);
    };
  }, [services, pricingPackages]);

  return (
    <div className="services-page">
      <SEO
        title={t("seo.services.title")}
        description={t("seo.services.description")}
        keywords={t("seo.services.keywords")}
      />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t("services.pageTitle")}</h1>
          <p className="page-description">{t("services.pageDescription")}</p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="pricing-disclaimer-wrapper">
            <div className="pricing-disclaimer-badge">
              <Info size={18} strokeWidth={2} />
              <span>{t("services.pricing.disclaimer")}</span>
            </div>
          </div>
          <div className="services-grid" ref={gridRef}>
            {loading ? (
              <p>Loading services...</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="service-card-wrapper">
                  <ServiceCard service={service} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {pricingPackages && pricingPackages.length > 0 && (
        <section className="pricing-section">
          <div className="container">
            <h2 className="section-title">{t("services.pricing.title")}</h2>
            <p className="section-description">
              {t("services.pricing.description")}
            </p>

            <div className="pricing-grid" ref={pricingRef}>
              {pricingPackages.map((pkg) => (
                <PriceCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="services-cta">
        <div className="container">
          <div className="cta-box">
            <h2>{t("services.cta.title")}</h2>
            <p>{t("services.cta.description")}</p>
            <button
              onClick={() => navigate("/contact")}
              className="button button-primary"
            >
              {t("services.cta.button")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
