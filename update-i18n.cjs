const fs = require('fs');
const roPath = 'E:/RRDesign/Site/Front/src/i18n/locales/ro.json';
const enPath = 'E:/RRDesign/Site/Front/src/i18n/locales/en.json';

const roTranslations = {
  legalPolicy: 'Legal & Politici',
  terms: 'Termeni și Condiții',
  privacy: 'Politica de Confidențialitate',
  gdpr: 'GDPR & Cookies'
};

const enTranslations = {
  legalPolicy: 'Legal & Policy',
  terms: 'Terms and Conditions',
  privacy: 'Privacy Policy',
  gdpr: 'GDPR & Cookies'
};

const roLegal = {
    gdpr: {
      title: 'Politica GDPR & Cookies',
      subtitle: 'Cum gestionăm datele tale și cum utilizăm cookie-urile pe RRDesign',
      sec1: { title: '1. Introducere', content: 'În conformitate cu Regulamentul (UE) 2016/679 (Regulamentul General privind Protecția Datelor - GDPR), această pagină vă informează despre modul în care RRDesign colectează, procesează și protejează datele cu caracter personal, precum și despre drepturile de care beneficiați în legătură cu aceste date.' },
      sec2: { title: '2. Drepturile dumneavoastră conform GDPR', p: 'În calitate de client sau vizitator al site-ului nostru, vizat de prelucrarea datelor cu caracter personal, aveți următoarele drepturi:', li1: 'Dreptul de acces (Art. 15 GDPR): Puteți solicita o confirmare privind prelucrarea datelor dumneavoastră și acces la acestea.', li2: 'Dreptul la rectificare (Art. 16 GDPR): Ne puteți solicita corectarea datelor personale inexacte sau completarea acestora.', li3: 'Dreptul la ștergerea datelor / Dreptul de a fi uitat (Art. 17 GDPR): Puteți solicita ștergerea datelor din baza noastră fără întârzieri nejustificate.', li4: 'Dreptul la restricționarea prelucrării (Art. 18 GDPR): Ne puteți solicita să oprim temporar sau definitiv folosirea datelor dumneavoastră.', li5: 'Dreptul la portabilitatea datelor (Art. 20 GDPR): Puteți primi datele pe care ni le-ați furnizat într-un format structurat, ce poate fi citit automat, pentru a le transfera altui operator.', li6: 'Dreptul la opoziție (Art. 21 GDPR): Vă puteți opune prelucrării datelor în scopuri de marketing direct.' },
      sec3: { title: '3. Politica de Cookie-uri', p: 'Site-ul RRDesign utilizează scripturi și fișiere de tip „cookie” pentru a îmbunătăți experiența de navigare, pentru menținerea sesiunilor de utilizator (autentificare) și pentru statistici anonime.', h3: 'Ce cookie-uri folosim:', li1: 'Cookie-uri absolut necesare (Strictly Necessary): Sunt vitale pentru funcționarea aplicației (ex: stocarea token-ului de securitate JWT, menținerea logării în Dashboard). Acestea nu pot fi dezactivate.', li2: 'Cookie-uri de preferințe: Mențin preferințele tale de afișare pe site (ex: limba bifată sau banner-ul de cookie-uri acceptat).', p2: 'Vă puteți configura browserul pentru a respinge toate cookie-urile, dar acest lucru poate face anumite funcții ale site-ului (precum contul de client) indisponibile.' },
      sec4: { title: '4. Exercitarea drepturilor', p: 'Pentru a exercita oricare dintre drepturile menționate mai sus sau dacă aveți întrebări despre modul în care utilizăm datele dumneavoastră, ne puteți contacta oricând la adresa de e-mail:', p2: 'Vom răspunde solicitării dumneavoastră în termen de maxim 30 de zile.' }
    },
    privacy: {
      title: 'Politica de Confidențialitate',
      subtitle: 'Află ce date prelucrăm și cum le menținem în siguranță',
      sec1: { title: '1. Informații Generale', content: 'Respectarea confidențialității datelor dumneavoastră este o prioritate pentru RRDesign. Acest document detaliază modul în care colectăm, utilizăm, păstrăm și protejăm datele personale pe care ni le furnizați prin intermediul site-ului ' },
      sec2: { title: '2. Ce date colectăm?', p: 'Ne limităm exclusiv la datele necesare pentru a vă oferi serviciile sau pentru a răspunde solicitărilor dumneavoastră:', li1: 'Date de contact: Nume, prenume, adresă de e-mail, număr de telefon (la utilizarea formularului de contact sau trimiterea unui mesaj pe cont).', li2: 'Date de cont: La crearea contului, stocăm un e-mail și o parolă securizată (criptată la un nivel înalt prin mecanisme de hash).', li3: 'Date legate de proiect (Client): Preferințe, cerințe de proiect și documentații aferente dezvoltării.', li4: 'Date de trafic tehnic: Simplu tracking de stare a rețelei: cum ar fi adresa IP (în log-uri de securitate pentru limitarea abuzurilor / atacurilor).' },
      sec3: { title: '3. Cum folosim datele colectate?', p: 'Informațiile colectate sunt folosite strict pentru următoarele scopuri:', li1: 'Derularea relațiilor de afaceri: facturare, ofertare, managementul proiectelor de web development.', li2: 'Autentificarea clienților pe platformă pentru urmărirea evoluției proiectelor lor.', li3: 'Răspunsuri la solicitările din formularele de contact.', li4: 'Notificări automate privind securitatea și statusul contului/proiectului.' },
      sec4: { title: '4. Securitatea datelor dumneavoastră', p: 'RRDesign implementează standarde tehnologice solide pentru a vă proteja datele de acces neautorizat, scurgeri sau distrugeri accidentale:', li1: 'Conexiune Securizată (HTTPS/SSL): Toate datele transmise între server și browser sunt criptate.', li2: 'Parole Criptate: Parolele nu sunt stocate niciodată sub formă de text pur. Folosim standardul industriei (Identity ASP.NET Core) pentru securizarea credențialelor.', li3: 'Securizarea interfeței (API): Metode de protecție ca "Rate Limiting" și politici CORS stricte previn atacurile automate asupra API-urilor ce conțin datele voastre.' },
      sec5: { title: '5. Terți și partajarea datelor', p: 'Nu vindem, nu închiriem și nu transferăm datele dumneavoastră personale către terți pentru scopuri de marketing. Acestea pot fi accesate doar de părțile autorizate care contribuie direct la buna funcționare tehnologică (de ex. platforma de Host / Servicii de trimitere E-mail), sub contracte stricte de confidențialitate.' }
    },
    terms: {
      title: 'Termeni și Condiții',
      subtitle: 'Regulile și condițiile de utilizare a platformei RRDesign',
      sec1: { title: '1. Acceptarea termenilor', content: 'Prin accesarea și utilizarea site-ului web rrdesign.ro (și subdomeniile / panourile aferente), sunteți de acord să respectați acești Termeni și Condiții de utilizare. Dacă nu sunteți de acord cu orice parte din acești termeni, vă rugăm să nu utilizați platforma.' },
      sec2: { title: '2. Servicii și Utilizarea acestora', p: 'RRDesign oferă servicii de consultanță, design și dezvoltare web (creare site-uri, aplicații dedicate, UI/UX). Prețurile sau funcționalitățile prezentate pe site sunt informative și devin clauze contractuale doar în momentul semnării unui contract prestări-servicii comercial fizic / electronic.', li1: 'Vă angajați să folosiți platforma doar în scopuri legale și etice.', li2: 'Este strict interzisă încercarea de accesare neautorizată a panourilor web (Dashboard de Client / Admin) fără a deține drepturi legitime.', li3: 'Conturile de utilizator create pentru urmărirea proiectelor sunt netransferabile. Păstrarea securității datelor de acces (parole) vă revine în totalitate.' },
      sec3: { title: '3. Drepturi de Proprietate Intelectuală', p1: 'Continutul original prezent pe rrdesign.ro (texte, logo-uri, imagini de portofoliu, grafică de interfață, cod sursă frontend/backend) este supus drepturilor de autor și este proprietatea intelectuală exclusivă a RRDesign.', p2: 'Nu aveți dreptul să copiați, să reproduceți sau să distribuiți secțiuni sau template-uri găsite pe acest site fără acordul scris în prealabil al RRDesign. Produsele / Site-urile dezvoltate pentru clienți (livrabilele finale) devin proprietatea intelectuală a clientului doar în termenii agreați în contractele comerciale finale și după confirmarea plății.' },
      sec4: { title: '4. Limitarea Răspunderii', p: 'Site-ul este oferit "ca atare" (as is). Pe cât posibil, facem tot efortul să asigurăm o platformă stabilă și lipsită de erori. Totuși, RRDesign nu își asumă responsabilitatea pentru:', li1: 'Întreruperi temporare cauzate de serverul de hosting extern.', li2: 'Diferențe subtile de rendering între varii browsere, impuse de actualizările de tehnologie web.', li3: 'Daune indirecte ce ar rezulta din imposibilitatea neprevăzută și temporară de a vizualiza stadiul proiectului pe Dashboard-ul personal.' },
      sec5: { title: '5. Modificarea Termenilor', p: 'Ne rezervăm dreptul de a actualiza sau de a schimba acești Termeni și Condiții în orice moment, fără notificare prealabilă, conform legilor în vigoare sau a noilor funcționalități aduse site-ului. Continuarea folosirii platformei implică acceptarea noilor termeni.' },
      sec6: { title: '6. Litigii și legislație aplicabilă', p: 'Acești Temeni și Condiții sunt ghidați de legile din România. Orice diferend va fi rezolvat inițial pe cale amiabilă; dacă acest lucru nu este posibil, litigiul va tinde spre instanțele judecătorești competente din România.' }
    }
};

const enLegal = {
    gdpr: {
      title: 'GDPR & Cookie Policy',
      subtitle: 'How we manage your data and use cookies on RRDesign',
      sec1: { title: '1. Introduction', content: 'In accordance with Regulation (EU) 2016/679 (General Data Protection Regulation - GDPR), this page informs you about how RRDesign collects, processes, and protects personal data, as well as the rights you have regarding this data.' },
      sec2: { title: '2. Your Rights under GDPR', p: 'As a client or visitor to our website, regarding the processing of your personal data, you have the following rights:', li1: 'Right of Access (Art. 15 GDPR): You may request confirmation of whether your data is being processed and obtain access to it.', li2: 'Right to Rectification (Art. 16 GDPR): You may request the correction of inaccurate personal data or completion of incomplete data.', li3: 'Right to Erasure / Right to be Forgotten (Art. 17 GDPR): You may request the deletion of your data from our database without undue delay.', li4: 'Right to Restriction of Processing (Art. 18 GDPR): You may request us to temporarily or permanently stop using your data.', li5: 'Right to Data Portability (Art. 20 GDPR): You may receive the data you have provided to us in a structured, commonly used, and machine-readable format to transfer it to another controller.', li6: 'Right to Object (Art. 21 GDPR): You may object to the processing of your data for direct marketing purposes.' },
      sec3: { title: '3. Cookie Policy', p: 'The RRDesign website uses scripts and "cookie" files to improve your browsing experience, maintain user sessions (authentication), and for anonymous statistics.', h3: 'Cookies we use:', li1: 'Strictly Necessary Cookies: These are vital for the application to function (e.g., storing the JWT security token, maintaining login state in the Dashboard). These cannot be disabled.', li2: 'Preference Cookies: These maintain your display preferences on the site (e.g., selected language or accepted cookie banner).', p2: 'You can configure your browser to reject all cookies, but this may make certain site features (such as the client account) unavailable.' },
      sec4: { title: '4. Exercising your rights', p: 'To exercise any of the rights mentioned above or if you have questions about how we use your data, you can contact us at any time at the email address:', p2: 'We will respond to your request within a maximum of 30 days.' }
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Learn what data we process and how we keep it safe',
      sec1: { title: '1. General Information', content: 'Respecting your data privacy is a priority for RRDesign. This document details how we collect, use, store, and protect the personal data you provide to us through the website ' },
      sec2: { title: '2. What data do we collect?', p: 'We strictly limit data collection to what is necessary to provide our services or answer your requests:', li1: 'Contact data: Name, surname, email address, phone number (when using the contact form or sending a message on your account).', li2: 'Account data: When creating an account, we store an email and a secure password (hashed to a high standard).', li3: 'Project-related data (Client): Preferences, project requirements, and related development documentation.', li4: 'Technical traffic data: Simple network status tracking, such as IP address (in security logs to limit abuse / attacks).' },
      sec3: { title: '3. How do we use the collected data?', p: 'The collected information is used strictly for the following purposes:', li1: 'Conducting business relations: invoicing, quoting, managing web development projects.', li2: 'Authenticating clients on the platform to track the progress of their projects.', li3: 'Responding to requests from contact forms.', li4: 'Automated notifications regarding security and account/project status.' },
      sec4: { title: '4. Security of your data', p: 'RRDesign implements solid technological standards to protect your data from unauthorized access, leaks, or accidental destruction:', li1: 'Secure Connection (HTTPS/SSL): All data transmitted between the server and the browser is encrypted.', li2: 'Encrypted Passwords: Passwords are never stored in plain text. We use industry standards (ASP.NET Core Identity) for credential security.', li3: 'Interface Security (API): Protection methods like "Rate Limiting" and strict CORS policies prevent automated attacks on APIs containing your data.' },
      sec5: { title: '5. Third parties and data sharing', p: 'We do not sell, rent, or transfer your personal data to third parties for marketing purposes. It can only be accessed by authorized parties who directly contribute to technological functionality (e.g., Hosting platform / Email delivery services) under strict confidentiality agreements.' }
    },
    terms: {
      title: 'Terms and Conditions',
      subtitle: 'Rules and conditions for using the RRDesign platform',
      sec1: { title: '1. Acceptance of terms', content: 'By accessing and using the website rrdesign.ro (and related subdomains / panels), you agree to comply with these Terms and Conditions of use. If you disagree with any part of these terms, please do not use the platform.' },
      sec2: { title: '2. Services and their Use', p: 'RRDesign provides consulting, visual design, and web development services (website creation, dedicated apps, UI/UX). Prices or features presented on the site are informative and become contractual clauses only upon signing a physical / electronic commercial service agreement.', li1: 'You agree to use the platform only for legal and ethical purposes.', li2: 'Any attempt towards unauthorized access to the web panels (Client / Admin Dashboard) without holding legitimate rights is strictly prohibited.', li3: 'User accounts created for tracking projects are non-transferable. Maintaining the security of access data (passwords) is your sole responsibility.' },
      sec3: { title: '3. Intellectual Property Rights', p1: 'Original content on rrdesign.ro (texts, logos, portfolio images, interface graphics, front-end/back-end source code) is subject to copyright and is the exclusive intellectual property of RRDesign.', p2: 'You may not copy, reproduce, or distribute sections or templates found on this site without the prior written consent of RRDesign. Products / Websites developed for clients (final deliverables) become the client’s intellectual property only under the terms agreed upon in the final commercial contracts and after payment confirmation.' },
      sec4: { title: '4. Limitation of Liability', p: 'The site is provided "as is". We make every effort to ensure a stable and error-free platform. However, RRDesign does not assume responsibility for:', li1: 'Temporary interruptions caused by the external hosting server.', li2: 'Subtle rendering differences between various browsers, imposed by web technology updates.', li3: 'Indirect damages resulting from the unforeseen and temporary impossibility of viewing the project status on the personal Dashboard.' },
      sec5: { title: '5. Modification of Terms', p: 'We reserve the right to update or change these Terms and Conditions at any time, without prior notice, in accordance with applicable laws or new features brought to the site. Continued use of the platform implies acceptance of the new terms.' },
      sec6: { title: '6. Disputes and applicable law', p: 'These Terms and Conditions are governed by the laws of Romania. Any dispute will initially be resolved amicably; if this is not possible, the dispute will head to the competent courts in Romania.' }
    }
};

let roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));
roData.footer = { ...roData.footer, ...roTranslations };
roData.legal = roLegal;
fs.writeFileSync(roPath, JSON.stringify(roData, null, 2));

let enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
enData.footer = { ...enData.footer, ...enTranslations };
enData.legal = enLegal;
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));

console.log('i18n updated');
