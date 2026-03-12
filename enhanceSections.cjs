const fs = require("fs");

// Update JSX
const jsxFile = "e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectDetails.jsx";
let jsxContent = fs.readFileSync(jsxFile, "utf8");

// Add 'Layers' to lucide-react imports if not there
if (jsxContent.includes("lucide-react") && !jsxContent.includes("Layers,")) {
    jsxContent = jsxContent.replace("Info,", "Info,\n  Layers,");
}

const targetSection = /<div className="description-section">[\s\S]*?<\/div>\s*<div className="tech-section">[\s\S]*?<\/div>\s*<\/div>/;

const replacementSection = `<div className="description-section">
            <h3 className="section-title">
              <FileText size={18} className="section-icon text-blue-600" />
              {t("dashboard.clientProjectDetails.description")}
            </h3>
            <div className="section-content">
              {project.description}
            </div>
          </div>

          <div className="tech-section">
            <h3 className="section-title">
              <Layers size={18} className="section-icon text-blue-600" />
              {t("dashboard.clientProjectDetails.technologies")}
            </h3>
            <div className="tech-tags">
              {project.technologies && project.technologies.split(",").map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>`;

jsxContent = jsxContent.replace(targetSection, replacementSection);
fs.writeFileSync(jsxFile, jsxContent);
console.log("JSX Sections Updated");

// Update CSS
const cssFile = "e:/RRDesign/Site/Front/src/pages/Dashboard/components/ProjectDetails.css";
let cssContent = fs.readFileSync(cssFile, "utf8");

// Create the new CSS rules
const newRules = `
/* Details Sections Styling */
.description-section, .tech-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px dashed rgba(229, 231, 235, 1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.section-icon {
  color: #2563eb;
  background: #eff6ff;
  padding: 4px;
  border-radius: 6px;
  width: 28px;
  height: 28px;
}

.section-content {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  white-space: pre-wrap;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.tech-tag:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.04);
}
`;

// Remove old tech-tags and tags styles from css
cssContent = cssContent.replace(/\.tech-tags\s*\{[\s\S]*?\}\s*\.tech-tag\s*\{[\s\S]*?\}/, "");

// append new rules
cssContent += newRules;

fs.writeFileSync(cssFile, cssContent);
console.log("CSS Sections Updated");

