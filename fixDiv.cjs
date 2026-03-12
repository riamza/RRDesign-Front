const fs = require("fs");
const jsxFile = "e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectDetails.jsx";
let content = fs.readFileSync(jsxFile, "utf8");

// We have 4 closing divs here. We only want 3.
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="requirements-board">/, 
`            </div>
          </div>
        </div>

      <div className="requirements-board">`);

fs.writeFileSync(jsxFile, content);
console.log("Fixed JSX Div count via regex");
