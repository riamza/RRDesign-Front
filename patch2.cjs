const fs = require("fs");

function patchMyProjects() {
  let data = fs.readFileSync(
    "e:/RRDesign/Site/Front/src/pages/MyProjects/MyProjects.jsx",
    "utf8",
  );

  // Remove old â‚¬ hardcoding
  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}: \u00E2\u201A\u00AC\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );

  // Some systems write it differently depending on terminal encoding:
  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}:[ \n]*â‚¬\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );
  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}: €\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );

  fs.writeFileSync(
    "e:/RRDesign/Site/Front/src/pages/MyProjects/MyProjects.jsx",
    data,
  );
  console.log("Patched MyProjects.jsx");
}

function patchClientProjectDetails() {
  let file =
    "e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectDetails.jsx";
  if (!fs.existsSync(file)) {
    // Checking another path
    file =
      "e:/RRDesign/Site/Front/src/pages/MyProjects/ClientProjectDetails.jsx";
    if (!fs.existsSync(file)) {
      console.log("ClientProjectDetails.jsx not found");
      return;
    }
  }

  let data = fs.readFileSync(file, "utf8");

  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}:[ \n]*\u00A0\u00E2\u201A\u00AC\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );
  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}:[ \n]*â‚¬\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );
  data = data.replace(
    /\{t\("estimatedPrice", "[^"]+"\)\}:[ \n]*€\{project\.estimatedPrice\}/g,
    '{t("estimatedPrice", "Preț Estimat")}: {project.estimatedPrice} {project.currency || "EUR"}',
  );

  fs.writeFileSync(file, data);
  console.log("Patched ClientProjectDetails.jsx");
}

patchMyProjects();
patchClientProjectDetails();
