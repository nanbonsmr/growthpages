import { Block, PageSettings } from './types';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  blocks: Block[];
  settings: Partial<PageSettings>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Clean newsletter subscription page',
    thumbnail: '/placeholder.svg',
    settings: {
      backgroundType: 'gradient',
      gradientFrom: '#667eea',
      gradientTo: '#764ba2',
      primaryColor: '#667eea',
    },
    blocks: [
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
      {
        id: generateId(),
        type: 'heading',
        props: {
          text: 'Stay in the Loop',
          level: 'h1',
          fontSize: 42,
          fontWeight: 'bold',
          alignment: 'center',
          color: '#ffffff',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'Get the latest updates, tips, and exclusive content delivered straight to your inbox.',
          fontSize: 18,
          alignment: 'center',
          color: '#e0e7ff',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'form',
        props: {
          showName: false,
          showEmail: true,
          showPhone: false,
          emailPlaceholder: 'Enter your email',
          buttonText: 'Subscribe Now',
          buttonColor: '#ffffff',
          successMessage: 'Welcome aboard! Check your inbox.',
          layout: 'inline',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 40 },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'Join 10,000+ subscribers • No spam, ever',
          fontSize: 14,
          alignment: 'center',
          color: '#c4b5fd',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
    ],
  },
  {
    id: 'waitlist',
    name: 'Startup Waitlist',
    description: 'Modern waitlist for product launches',
    thumbnail: '/placeholder.svg',
    settings: {
      backgroundType: 'solid',
      backgroundColor: '#0f172a',
      primaryColor: '#06b6d4',
    },
    blocks: [
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 80 },
      },
      {
        id: generateId(),
        type: 'image',
        props: {
          src: '',
          alt: 'Logo',
          width: 80,
          height: 80,
          alignment: 'center',
          borderRadius: 16,
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'heading',
        props: {
          text: 'Something Amazing is Coming',
          level: 'h1',
          fontSize: 48,
          fontWeight: 'bold',
          alignment: 'center',
          color: '#ffffff',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: "We're building the next generation of productivity tools. Be the first to experience it.",
          fontSize: 20,
          alignment: 'center',
          color: '#94a3b8',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 20 },
      },
      {
        id: generateId(),
        type: 'countdown',
        props: {
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          label: 'Launching in',
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: false,
          color: '#06b6d4',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'form',
        props: {
          showName: true,
          showEmail: true,
          showPhone: false,
          namePlaceholder: 'Your name',
          emailPlaceholder: 'Your email',
          buttonText: 'Join the Waitlist',
          buttonColor: '#06b6d4',
          successMessage: "You're on the list! We'll be in touch soon.",
          layout: 'stacked',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 80 },
      },
    ],
  },
  {
    id: 'event',
    name: 'Event Registration',
    description: 'Professional event signup page',
    thumbnail: '/placeholder.svg',
    settings: {
      backgroundType: 'gradient',
      gradientFrom: '#f97316',
      gradientTo: '#ea580c',
      primaryColor: '#f97316',
    },
    blocks: [
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'VIRTUAL EVENT • MARCH 2025',
          fontSize: 14,
          alignment: 'center',
          color: '#fef3c7',
        },
      },
      {
        id: generateId(),
        type: 'heading',
        props: {
          text: 'Design Summit 2025',
          level: 'h1',
          fontSize: 52,
          fontWeight: 'bold',
          alignment: 'center',
          color: '#ffffff',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'Join industry leaders for 3 days of inspiration, learning, and networking.',
          fontSize: 20,
          alignment: 'center',
          color: '#fed7aa',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'form',
        props: {
          showName: true,
          showEmail: true,
          showPhone: true,
          namePlaceholder: 'Full name',
          emailPlaceholder: 'Work email',
          phonePlaceholder: 'Phone number',
          buttonText: 'Reserve My Spot',
          buttonColor: '#1e293b',
          successMessage: "You're registered! Check your email for details.",
          layout: 'stacked',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 40 },
      },
      {
        id: generateId(),
        type: 'testimonial',
        props: {
          quote: '"Last year\'s summit was incredible. The insights I gained transformed our design process."',
          author: 'Sarah Chen',
          role: 'Head of Design, TechCorp',
          avatar: '',
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
    ],
  },
  {
    id: 'product_launch',
    name: 'Product Launch',
    description: 'Exciting product reveal page',
    thumbnail: '/placeholder.svg',
    settings: {
      backgroundType: 'solid',
      backgroundColor: '#18181b',
      primaryColor: '#a855f7',
    },
    blocks: [
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 80 },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: '✨ NEW RELEASE',
          fontSize: 14,
          alignment: 'center',
          color: '#a855f7',
        },
      },
      {
        id: generateId(),
        type: 'heading',
        props: {
          text: 'Meet Your New Favorite App',
          level: 'h1',
          fontSize: 48,
          fontWeight: 'bold',
          alignment: 'center',
          color: '#ffffff',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'The all-in-one solution for modern teams. Faster, smarter, better.',
          fontSize: 20,
          alignment: 'center',
          color: '#a1a1aa',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 40 },
      },
      {
        id: generateId(),
        type: 'image',
        props: {
          src: '',
          alt: 'Product Preview',
          width: 400,
          height: 250,
          alignment: 'center',
          borderRadius: 12,
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 40 },
      },
      {
        id: generateId(),
        type: 'form',
        props: {
          showName: false,
          showEmail: true,
          showPhone: false,
          emailPlaceholder: 'Enter your email',
          buttonText: 'Get Early Access',
          buttonColor: '#a855f7',
          successMessage: 'Welcome to the future!',
          layout: 'inline',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'social',
        props: {
          platforms: [
            { name: 'twitter', url: '#', enabled: true },
            { name: 'linkedin', url: '#', enabled: true },
          ],
          size: 'md',
          color: '#71717a',
          alignment: 'center',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 80 },
      },
    ],
  },
  {
    id: 'free_resource',
    name: 'Free Download',
    description: 'Lead magnet download page',
    thumbnail: '/placeholder.svg',
    settings: {
      backgroundType: 'gradient',
      gradientFrom: '#10b981',
      gradientTo: '#059669',
      primaryColor: '#10b981',
    },
    blocks: [
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: 'FREE DOWNLOAD',
          fontSize: 14,
          alignment: 'center',
          color: '#a7f3d0',
        },
      },
      {
        id: generateId(),
        type: 'heading',
        props: {
          text: 'The Ultimate Startup Playbook',
          level: 'h1',
          fontSize: 44,
          fontWeight: 'bold',
          alignment: 'center',
          color: '#ffffff',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: '50+ pages of actionable strategies, templates, and frameworks used by top founders.',
          fontSize: 18,
          alignment: 'center',
          color: '#d1fae5',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'image',
        props: {
          src: '',
          alt: 'Ebook Cover',
          width: 200,
          height: 280,
          alignment: 'center',
          borderRadius: 8,
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 30 },
      },
      {
        id: generateId(),
        type: 'form',
        props: {
          showName: true,
          showEmail: true,
          showPhone: false,
          namePlaceholder: 'Your name',
          emailPlaceholder: 'Your best email',
          buttonText: 'Download Free Guide',
          buttonColor: '#ffffff',
          successMessage: 'Check your email for the download link!',
          layout: 'stacked',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 20 },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          text: '🔒 Your email is safe with us. No spam.',
          fontSize: 14,
          alignment: 'center',
          color: '#a7f3d0',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 60 },
      },
    ],
  },
];
