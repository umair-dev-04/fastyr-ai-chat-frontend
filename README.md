# FastyRAI Chat Frontend

A modern, responsive AI chat application built with Next.js 15, TypeScript, and Tailwind CSS. This application provides an intuitive interface for users to interact with AI assistants, featuring real-time chat, session management, and comprehensive authentication.


## 🚀 Features

### Core Features
- **Real-time AI Chat**: Instant responses with typing indicators
- **Session Management**: Save and organize chat conversations
- **Multi-format Support**: Text, code, and structured responses
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Automatic theme switching support

### Authentication & Security
- **Multiple Auth Methods**: Email/password and Google OAuth
- **JWT Token Management**: Secure authentication with auto-refresh
- **Input Sanitization**: XSS protection and content validation
- **Error Boundaries**: Graceful error handling and recovery

### User Experience
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Offline Support**: Connection status indicators and offline handling
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance Optimized**: Code splitting and lazy loading

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### State Management & Data
- **Zustand** - Lightweight state management
- **React Hook Form** - Efficient form handling
- **JWT Decode** - Token parsing and validation

### Development & Testing
- **Jest** - Unit testing framework
- **Cypress** - End-to-end testing
- **ESLint** - Code linting and formatting
- **MSW** - API mocking for testing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/fastyrai-chat-frontend.git
cd fastyrai-chat-frontend
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Environment
NODE_ENV=development
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
fastyrai-chat-frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat-specific components
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
│   └── auth-context.tsx   # Authentication context
├── hooks/                 # Custom React hooks
│   ├── use-api.ts         # API interaction hook
│   ├── use-mobile.tsx     # Mobile detection
│   └── use-toast.ts       # Toast notifications
├── lib/                   # Utility libraries
│   ├── api.ts             # API client and endpoints
│   ├── auth.ts            # Authentication manager
│   ├── config.ts          # Environment configuration
│   ├── constants.ts       # Application constants
│   ├── logger.ts          # Logging system
│   ├── sanitizer.ts       # Content sanitization
│   └── utils.ts           # General utilities
├── store/                 # State management
│   └── chat-store.ts      # Chat state with Zustand
├── types/                 # TypeScript type definitions
│   └── index.ts           # Global types
├── __tests__/             # Test files
├── cypress/               # E2E tests
├── mocks/                 # API mocking for tests
└── public/                # Static assets
\`\`\`

## 🔧 Available Scripts

### Development
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Testing
\`\`\`bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run cypress:open # Open Cypress GUI
npm run cypress:run  # Run Cypress tests headlessly
\`\`\`

## 🌐 API Integration

The application integrates with a backend API for:

### Authentication Endpoints
- `POST /login` - User login
- `POST /signup` - User registration
- `POST /auth/google` - Google OAuth
- `GET /me` - Get current user
- `POST /refresh` - Refresh JWT token

### Chat Endpoints
- `POST /chat` - Send message to AI
- `GET /chat/sessions` - Get user's chat sessions
- `GET /chat/sessions/:id` - Get specific session
- `DELETE /chat/sessions/:id` - Delete session

### File Upload
- `POST /upload/avatar` - Upload user avatar

## 🔒 Security Features

### Input Validation & Sanitization
- XSS protection with DOMPurify
- Input length validation
- Malicious pattern detection
- Content type validation

### Authentication Security
- JWT token with auto-refresh
- Secure token storage
- CSRF protection
- Rate limiting ready

### Error Handling
- Global error boundaries
- Graceful degradation
- User-friendly error messages
- Comprehensive logging

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Touch-optimized interface with drawer navigation

## 🎨 Theming & Customization

### Color Scheme
The application uses a carefully crafted color palette:
- **Primary**: Blue (#2563EB)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Customizing Themes
Modify `tailwind.config.ts` to customize:
- Colors and gradients
- Typography scales
- Spacing and sizing
- Animation timings

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- State management testing

### Integration Tests
- API integration testing with MSW
- Authentication flow testing
- Error handling testing

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance testing

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Environment Variables for Production
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-google-client-id
NODE_ENV=production
\`\`\`

## 📊 Performance Optimization

### Built-in Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Automatic font loading
- **Bundle Analysis**: Built-in bundle analyzer

### Performance Monitoring
- Core Web Vitals tracking
- Error boundary reporting
- User interaction analytics
- Performance metrics logging

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Use semantic commit messages

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

**TypeScript Errors**
\`\`\`bash
# Check TypeScript configuration
npx tsc --noEmit
\`\`\`

**Dependency Issues**
\`\`\`bash
# Clean install
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Getting Help
- Check the [Issues](https://github.com/yourusername/fastyrai-chat-frontend/issues) page
- Review the [Documentation](https://github.com/yourusername/fastyrai-chat-frontend/wiki)
- Join our [Discord Community](https://discord.gg/your-invite)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vercel](https://vercel.com/) - Deployment and hosting platform

## 📞 Support

For support and questions:
- **Documentation**: [docs.fastyrai.com](https://docs.fastyrai.com)
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/fastyrai-chat-frontend/issues/new)

---

**Made with ❤️**

*Last updated: January 2025*
