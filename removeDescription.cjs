const fs = require('fs');
let path = 'e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectsManager.jsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(/<p className="project-description">\{project\.description\}<\/p>\s*/g, '');

fs.writeFileSync(path, data);
console.log("Success");
