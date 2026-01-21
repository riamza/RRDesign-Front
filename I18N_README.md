# Internationalization (i18n) - RRDesign

## Limbile suportate
- **Română (RO)** - Limba default
- **Engleză (EN)**

## Structura fișierelor

```
frontend/src/
├── i18n/
│   ├── config.js          # Configurare i18next
│   └── locales/
│       ├── ro.json        # Traduceri în română
│       └── en.json        # Traduceri în engleză
└── components/
    └── LanguageSwitcher/  # Component pentru schimbarea limbii
```

## Utilizare

### În componente React

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('header.home')}</h1>
      <p>{t('home.hero.title')}</p>
    </div>
  );
}
```

### Schimbarea limbii

Componentul `LanguageSwitcher` poate fi adăugat în orice parte a aplicației:

```jsx
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

<LanguageSwitcher />
```

### Structura cheilor de traducere

Cheile sunt organizate ierarhic:

```json
{
  "header": {
    "home": "Acasă",
    "services": "Servicii"
  },
  "home": {
    "hero": {
      "title": "Transformăm idei în"
    }
  }
}
```

## Adăugarea de noi traduceri

1. Deschide fișierul `frontend/src/i18n/locales/ro.json`
2. Adaugă cheia de traducere în română
3. Deschide fișierul `frontend/src/i18n/locales/en.json`
4. Adaugă aceeași cheie în engleză
5. Folosește cheia în componente: `t('cheia.ta')`

## Exemple

```jsx
// Text simplu
{t('header.home')}

// Cu interpolation
{t('welcome.message', { name: userName })}

// Plural
{t('items.count', { count: 5 })}
```

## Configurare

Limba este salvată în `localStorage` și este detectată automat la următoarea vizită.

Ordinea de detectare:
1. localStorage
2. Browser navigator

Pentru a seta manual limba:

```jsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('en'); // sau 'ro'
```

## Componente actualizate cu i18n

- ✅ Header
- ✅ Footer
- ✅ Home
- ✅ Services
- ✅ Projects
- ✅ Templates
- ✅ Contact
- ✅ Login
- ✅ Dashboard
- ✅ ServicesManager
- ✅ ProjectsManager
- ✅ TemplatesManager
