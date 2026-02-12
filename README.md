# 🌐 Smart AQI Monitoring System - Frontend

A modern, responsive web application for monitoring Air Quality Index (AQI) across Pakistan. Built with React, TypeScript, and Tailwind CSS, this frontend provides real-time air quality data visualization, location-based alerts, and an intuitive user interface for citizens and policymakers.

**Live Demo:** [https://aqi-monitoring-system-frontend.vercel.app](https://aqi-monitoring-system-frontend.vercel.app)

---

## ✨ Features

- **Real-Time AQI Monitoring**: View current air quality levels for cities across Pakistan
- **Location-Based Tracking**: Get personalized AQI data based on your location
- **Interactive Dashboard**: Visualize air quality trends with charts and graphs
- **User Authentication**: Secure JWT-based login and registration
- **Alert Notifications**: Receive alerts when air quality becomes unhealthy
- **Health Recommendations**: AI-powered chatbot providing health advice based on current AQI
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Easy on the eyes with theme switching

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building interactive interfaces |
| **TypeScript** | Type-safe JavaScript for better code quality |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Axios** | HTTP client for API requests |
| **React Router** | Client-side routing and navigation |
| **Recharts** | Data visualization library for charts |
| **React Query** | Server state management and caching |
| **Zustand** | Lightweight state management |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Maaz-x14/aqi-monitoring-system-frontend.git
cd aqi-monitoring-system-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=AQI Monitor
```

**Environment Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | Application name | `AQI Monitor` |

### 4. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be in the `dist/` directory.

---

## 📁 Project Structure

```
aqi-monitoring-system-frontend/
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Generic components (Button, Card, etc.)
│   │   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components (routing)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Profile.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAQI.ts
│   │   └── useLocation.ts
│   ├── services/            # API services and utilities
│   │   ├── api.ts           # Axios instance and interceptors
│   │   ├── authService.ts   # Authentication API calls
│   │   └── aqiService.ts    # AQI data API calls
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   └── aqiStore.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   └── aqi.types.ts
│   ├── utils/               # Utility functions
│   │   ├── aqiCalculator.ts # AQI level calculations
│   │   └── formatters.ts    # Data formatting utilities
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Public static files
├── .env.example             # Example environment variables
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.cjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── vercel.json              # Vercel deployment config
```

---

## 🎨 Component Architecture

### Core Components

```typescript
// Example: AQI Card Component
interface AQICardProps {
  location: string;
  aqi: number;
  timestamp: string;
  onRefresh?: () => void;
}

const AQICard: React.FC<AQICardProps> = ({ location, aqi, timestamp, onRefresh }) => {
  const level = getAQILevel(aqi);
  
  return (
    <div className={`p-6 rounded-lg ${level.color}`}>
      <h3>{location}</h3>
      <div className="text-4xl font-bold">{aqi}</div>
      <p>{level.description}</p>
      <span className="text-sm">{formatTimestamp(timestamp)}</span>
    </div>
  );
};
```

### State Management Pattern

```typescript
// Using Zustand for global state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    set({ user: response.user, token: response.token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

---

## 🔌 API Integration

### API Client Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Authenticate user |
| `/aqi` | GET | Get AQI data by location |
| `/user/profile` | GET | Get user profile |
| `/user/location` | PUT | Update user location |
| `/user/alerts` | GET | Get user's AQI alerts |

---

## 🎯 Key Features Implementation

### 1. AQI Level Calculation

```typescript
export const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', description: 'Air quality is satisfactory' };
  if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', description: 'Air quality is acceptable' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', description: 'Members of sensitive groups may experience health effects' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', description: 'Everyone may begin to experience health effects' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500', description: 'Health alert: everyone may experience more serious health effects' };
  return { level: 'Hazardous', color: 'bg-maroon-700', description: 'Health warnings of emergency conditions' };
};
```

### 2. Location-Based Updates

```typescript
export const useUserLocation = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => setError(error.message)
      );
    }
  }, []);

  return { location, error };
};
```

### 3. Real-Time Notifications

```typescript
export const useAQIAlerts = (location: string) => {
  const { data, isLoading, error } = useQuery(
    ['aqi', location],
    () => aqiService.getAQI(location),
    {
      refetchInterval: 300000, // Refresh every 5 minutes
      onSuccess: (data) => {
        if (data.aqi > 150) {
          showNotification('Air Quality Alert', `AQI is ${data.aqi} in ${location}`);
        }
      },
    }
  );

  return { data, isLoading, error };
};
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Libraries

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing
- **MSW**: Mock Service Worker for API mocking

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t aqi-frontend .
```

### Run Container

```bash
docker run -p 80:80 aqi-frontend
```

### Docker Compose (with Backend)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api
    depends_on:
      - backend
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Or push to GitHub and connect with Vercel dashboard

### Nginx (Self-hosted)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/aqi-frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 Configuration

### Tailwind Customization

```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
```

### Vite Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
});
```

---

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading for routes and heavy components
- **Image Optimization**: WebP format with lazy loading
- **Caching**: React Query for API response caching
- **Bundle Size**: Tree shaking and dynamic imports
- **CDN**: Static assets served via CDN

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: API requests failing with CORS error
```
Solution: Ensure backend has proper CORS configuration for your frontend domain
```

**Problem**: Build fails with TypeScript errors
```
Solution: Run `npm run type-check` to identify type issues
```

**Problem**: Slow development server
```
Solution: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier for consistent formatting
- Follow React best practices and hooks guidelines
- Write meaningful commit messages
- Add tests for new features

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |
| `npm run format` | Format code with Prettier |

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Maaz**  
GitHub: [@Maaz-x14](https://github.com/Maaz-x14)

---

## 🙏 Acknowledgments

- Air Quality Index data provided by [EPA AQI Standards](https://www.airnow.gov/aqi/)
- Icons from [Lucide Icons](https://lucide.dev/)
- Maps powered by Google Maps API
- Deployed on [Vercel](https://vercel.com/)

---

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on [GitHub Issues](https://github.com/Maaz-x14/aqi-monitoring-system-frontend/issues)
- Email: support@aqimonitor.com
- Documentation: [Wiki](https://github.com/Maaz-x14/aqi-monitoring-system-frontend/wiki)

---

**Made with ❤️ for cleaner air in Pakistan**
