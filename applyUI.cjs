const fs = require('fs');

// 1. Update Translations
let enPath = 'e:/RRDesign/Site/Front/src/i18n/locales/en.json';
let roPath = 'e:/RRDesign/Site/Front/src/i18n/locales/ro.json';

let enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));

enData.estimatedPriceNotice = "This price is strictly an estimate. The final price may vary if the initial requirements change.";
roData.estimatedPriceNotice = "Acest pre\u021B este strict estimativ \u0219i se poate modifica dac\u0103 cerin\u021Bele discutate ini\u021Bial se schimb\u0103.";

if(!enData.dashboard) enData.dashboard = {};
if(!enData.dashboard.clientProjectDetails) enData.dashboard.clientProjectDetails = {};
enData.dashboard.clientProjectDetails.estimatedPriceNotice = "This price is strictly an estimate. The final price may vary if the initial requirements change.";

if(!roData.dashboard) roData.dashboard = {};
if(!roData.dashboard.clientProjectDetails) roData.dashboard.clientProjectDetails = {};
roData.dashboard.clientProjectDetails.estimatedPriceNotice = "Acest pre\u021B este strict estimativ \u0219i se poate modifica dac\u0103 cerin\u021Bele discutate ini\u021Bial se schimb\u0103.";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(roPath, JSON.stringify(roData, null, 2));

console.log("Translations updated.");

// 2. Update MyProjects.jsx
let myProjectsPath = 'e:/RRDesign/Site/Front/src/pages/MyProjects/MyProjects.jsx';
let myProjectsSrc = fs.readFileSync(myProjectsPath, 'utf8');

const myProjectsFind = `{project.estimatedPrice && (
                      <div className="project-price" style={{ marginTop:        
'10px', fontWeight: 'bold' }}>
                        {t("estimatedPrice", "PreÈ› Estimat")}:
{project.estimatedPrice} {project.currency || "EUR"}
                      </div>
                    )}`;

const myProjectsReplace = `{project.estimatedPrice && (
                      <div className="project-price-container" style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderLeft: '4px solid #0d6efd', borderRadius: '6px' }}>
                        <div className="project-price" style={{ fontWeight: 'bold', fontSize: '1.05em', color: '#2c3e50', marginBottom: '6px' }}>
                          {t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}
                        </div>
                        <p className="price-notice" style={{ fontSize: '0.85em', color: '#6c757d', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                          {t("estimatedPriceNotice", "Acest preț este strict estimativ și se poate modifica dacă cerințele discutate inițial se schimbă.")}
                        </p>
                      </div>
                    )}`;

// Handle varying line endings and spaces
let myProjectsRegex = /\{project\.estimatedPrice && \(\s*<div className="project-price" style=\{\{ marginTop:\s*'10px', fontWeight:\s*'bold'\s*\}\}>\s*\{t\("estimatedPrice",\s*"[^"]+"\)\}:\s*\{project\.estimatedPrice\}\s*\{project\.currency\s*\|\|\s*"EUR"\}\s*<\/div>\s*\)\}/g;

if (myProjectsRegex.test(myProjectsSrc)) {
    myProjectsSrc = myProjectsSrc.replace(myProjectsRegex, myProjectsReplace);
    fs.writeFileSync(myProjectsPath, myProjectsSrc);
    console.log("MyProjects.jsx updated.");
} else {
    console.log("MyProjects.jsx regex not matched.");
}

// 3. Update ClientProjectDetails.jsx
let detailsPath = 'e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectDetails.jsx';
let detailsSrc = fs.readFileSync(detailsPath, 'utf8');

const detailsRegex = /\{project\.estimatedPrice && \(\s*<div className="info-item">\s*<label>\{t\("dashboard\.clientProjectDetails\.estimatedPrice",\s*"[^"]+"\)\}<\/label>\s*<span>\{project\.estimatedPrice\}\s*\{project\.currency\s*\|\|\s*"EUR"\}<\/span>\s*<\/div>\s*\)\}/g;

const detailsReplace = `{project.estimatedPrice && (
              <div className="info-item price-estimate-container" style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #0d6efd', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}>{t("dashboard.clientProjectDetails.estimatedPrice", "Preț Estimat")}</label>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#2c3e50' }}>{project.estimatedPrice} {project.currency || "EUR"}</span>
                </div>
                <div style={{ fontSize: '0.85em', color: '#6c757d', fontStyle: 'italic', lineHeight: '1.4' }}>
                  {t("dashboard.clientProjectDetails.estimatedPriceNotice", "Acest preț este strict estimativ și se poate modifica dacă cerințele discutate inițial se schimbă.")}
                </div>
              </div>
            )}`;

if (detailsRegex.test(detailsSrc)) {
    detailsSrc = detailsSrc.replace(detailsRegex, detailsReplace);
    fs.writeFileSync(detailsPath, detailsSrc);
    console.log("ClientProjectDetails.jsx updated.");
} else {
    console.log("ClientProjectDetails.jsx regex not matched.");
}
