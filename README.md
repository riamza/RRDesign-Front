# RRDesign - Software Solutions Platform

Platformă web modernă pentru firma de outsourcing software RRDesign.

## 🚀 Tehnologii

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: CSS3 (Design modern minimalist cu culori calde)
- **Fonts**: Inter (Google Fonts)

## 📁 Structura Proiectului

```
frontend/
├── src/
│   ├── components/      # Componente reutilizabile
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Card/
│   │   └── Button/
│   ├── pages/          # Pagini principale
│   │   ├── Home/
│   │   ├── Projects/
│   │   ├── Templates/
│   │   ├── Services/
│   │   └── Contact/
│   ├── data/           # Date hardcodate
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js

backend/                 # Va fi implementat în viitor
└── (Onion Architecture: API, Repository, Business Logic, Domain)
```

## 🎨 Design

Design modern minimalist cu:
- Culori calde: Roșu corai (#FF6B6B) și Portocaliu (#FFB84D)
- Gradient-uri moderne
- Animații subtile
- Layout responsive
- Componente card cu shadow și hover effects

## 📄 Pagini

1. **Home** - Pagina principală cu hero section, servicii preview, statistici
2. **Services** - Lista completă de servicii oferite
3. **Projects** - Portofoliu cu proiecte finalizate
4. **Templates** - Colecție de template-uri disponibile
5. **Contact** - Formular de contact și informații

## 🛠️ Instalare și Rulare

### Prerequisites
- Node.js (v16 sau mai recent)
- npm sau yarn

### Pași de instalare

1. Navighează în folderul frontend:
```bash
cd frontend
```

2. Instalează dependențele:
```bash
npm install
```

3. Pornește serverul de dezvoltare:
```bash
npm run dev
```

4. Aplicația va fi disponibilă la: `http://localhost:3000`

### Comenzi disponibile

- `npm run dev` - Pornește serverul de dezvoltare
- `npm run build` - Construiește aplicația pentru producție
- `npm run preview` - Previzualizează build-ul de producție

## 📊 Date Mock

Toate datele sunt momentan hardcodate în `src/data/mockData.js`:
- 6 proiecte finalizate
- 5 template-uri disponibile
- 6 servicii oferite
- Informații despre companie

## 🔮 Viitor - Backend

Backend-ul va fi implementat în .NET cu arhitectură Onion:
- **Domain Layer**: Entități și interfețe
- **Business Logic Layer**: Servicii și validări
- **Repository Layer**: Acces la date
- **API Layer**: Controllers și endpoints

## 📝 Customizare

Pentru a customiza aplicația:
1. Modifică datele în `src/data/mockData.js`
2. Ajustează culorile în `src/index.css` (variabilele CSS)
3. Personalizează componentele din `src/components/`

## 🎯 Features

- ✅ Design responsive (mobile-first)
- ✅ Animații fluide
- ✅ Componente reutilizabile
- ✅ Routing cu React Router
- ✅ SEO friendly
- ✅ Performance optimizată cu Vite

## 📱 Responsive

Aplicația este complet responsive și funcționează perfect pe:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (<768px)

---

Dezvoltat cu ❤️ de RRDesign Team
