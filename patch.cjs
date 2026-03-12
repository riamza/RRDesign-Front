const fs = require('fs');
let data = fs.readFileSync('e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectsManager.jsx', 'utf8');

const regex = /<div className="form-group mb-4">\s*<label className="block text-sm font-medium mb-1 font-semibold">\s*\{t\("dashboard\.clientProjectsManager\.form\.estimatedPrice"\)[^}]*\}\s*<\/label>\s*<input\s*type="number"\s*step="0\.01"\s*min="0"\s*className="w-full p-2 border rounded"\s*value=\{formData\.estimatedPrice\}\s*onChange=\{\(e\) =>\s*setFormData\(\{ \.\.\.formData, estimatedPrice: e\.target\.value \}\)\s*\}\s*placeholder="Ex: 500"\s*\/>\s*<\/div>/g;

const replaceWith = `<div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1 font-semibold">
                {t("dashboard.clientProjectsManager.form.estimatedPrice") || "Estimated Price"}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={formData.estimatedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedPrice: e.target.value })
                  }
                  placeholder="Ex: 500"
                />
                <select
                  className="p-2 border rounded"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                >
                  <option value="EUR">€ (EUR)</option>
                  <option value="RON">Lei (RON)</option>
                  <option value="USD">$ (USD)</option>
                </select>
              </div>
            </div>`;

if(data.match(regex)) {
    data = data.replace(regex, replaceWith);
    fs.writeFileSync('e:/RRDesign/Site/Front/src/pages/Dashboard/components/ClientProjectsManager.jsx', data);
    console.log("Success");
} else {
    console.log("No match found");
}