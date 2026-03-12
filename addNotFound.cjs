const fs = require("fs");
const file = "e:/RRDesign/Site/Front/src/App.jsx";
let content = fs.readFileSync(file, "utf8");

if(!content.includes("NotFound")) {
    content = content.replace("import Contact from", "import NotFound from \"./pages/NotFound/NotFound\";\nimport Contact from");
    
    // add route inside PublicLayout
    const routeRegex = /<Route path="\/politica-cookies-gdpr" element=\{<GDPR \/>\} \/>/;
    if(routeRegex.test(content)) {
       content = content.replace(routeRegex, `<Route path="/politica-cookies-gdpr" element={<GDPR />} />\n              <Route path="*" element={<NotFound />} />`);
    }

    fs.writeFileSync(file, content);
    console.log("NotFound added to App.jsx");
}
