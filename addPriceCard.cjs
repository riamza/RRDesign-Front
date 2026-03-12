const fs = require('fs');

let path = 'e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectsManager.jsx';
let data = fs.readFileSync(path, 'utf8');

const regex = /<p className="project-description">\{project\.description\}<\/p>/g;
const replacement = `<p className="project-description">{project.description}</p>
                {project.estimatedPrice && (
                  <div className="project-price" style={{ marginTop: '10px', padding: '6px 10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.95em', color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #e9ecef' }}>
                    <span style={{color: '#6c757d', fontWeight: 'normal'}}>{t("estimatedPrice", "Preț Estimat")}:</span> {project.estimatedPrice} {project.currency || "EUR"}
                  </div>
                )}`;

if (regex.test(data)) {
    data = data.replace(regex, replacement);
    fs.writeFileSync(path, data);
    console.log("ClientProjectsManager.jsx updated ok.");
} else {
    console.log("Could not find element in ClientProjectsManager.jsx.");
}
