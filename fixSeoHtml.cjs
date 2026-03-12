const fs = require("fs");
const file = "e:/RRDesign/Site/Front/index.html";
let content = fs.readFileSync(file, "utf8");

// Fix render blocking for fonts
content = content.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">',
    `<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"></noscript>`
);

// Add Schema.org and Google Analytics
const headEnd = `    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RRDesign",
      "url": "https://rrdesign.ro",
      "logo": "https://rrdesign.ro/logo.png",
      "description": "Solu?ii software complete: site-uri de prezentare, magazine online, aplica?ii web ?i mobile, design UX/UI ?i optimizare SEO.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+407XXXXXXXX",
        "contactType": "customer service"
      }
    }
    </script>
    
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
  </head>`;

content = content.replace("  </head>", headEnd);

fs.writeFileSync(file, content);
console.log("index.html updated with SEO fixes");
