export type BlockType = 
  | 'heading'
  | 'text'
  | 'image'
  | 'form'
  | 'button'
  | 'divider'
  | 'social'
  | 'testimonial'
  | 'countdown'
  | 'spacer'
  | 'video'
  | 'accordion'
  | 'pricing'
  | 'feature-grid'
  | 'hero'
  | 'nav'
  | 'footer'
  | 'contact-form'
  | 'list'
  | 'blockquote'
  | 'map'
  | 'stats'
  | 'logo-cloud'
  | 'alert-banner'
  | 'html-embed';

export type BlockCategory = 'basic' | 'forms' | 'marketing' | 'layout';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  category: BlockCategory;
  defaultProps: Record<string, any>;
}

export interface BlockPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  position?: BlockPosition; // Optional - if not set, uses flow layout
}

export interface HeadingProps {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface TextProps {
  text: string;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  color: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
}

export interface ButtonProps {
  text: string;
  action: 'submit' | 'link';
  linkUrl?: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
}

export interface FormProps {
  showName: boolean;
  showEmail: boolean;
  showPhone: boolean;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  buttonText: string;
  buttonColor: string;
  successMessage: string;
  layout: 'stacked' | 'inline';
}

export interface DividerProps {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
  width: number;
}

export interface SocialProps {
  platforms: Array<{
    name: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
    enabled: boolean;
  }>;
  size: 'sm' | 'md' | 'lg';
  color: string;
  alignment: 'left' | 'center' | 'right';
}

export interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  backgroundColor: string;
}

export interface CountdownProps {
  targetDate: string;
  label: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  color: string;
}

export interface SpacerProps {
  height: number;
}

export interface VideoProps {
  url: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
  controls: boolean;
  alignment: 'left' | 'center' | 'right';
}

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple: boolean;
  style: 'default' | 'bordered' | 'separated';
  iconPosition: 'left' | 'right';
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted: boolean;
}

export interface PricingProps {
  tiers: PricingTier[];
  columns: 2 | 3;
  style: 'cards' | 'minimal' | 'gradient';
  highlightColor: string;
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  features: FeatureItem[];
  columns: 2 | 3 | 4;
  style: 'cards' | 'minimal' | 'icons-left';
  iconColor: string;
  showIcons: boolean;
}

export interface HeroProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  backgroundOverlay: number;
  height: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  textColor: 'light' | 'dark';
}

export interface NavMenuItem {
  id: string;
  label: string;
  url: string;
}

export interface NavProps {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  menuItems: NavMenuItem[];
  ctaButton: { enabled: boolean; text: string; url: string };
  style: 'transparent' | 'solid' | 'glass';
  alignment: 'left' | 'center' | 'spread';
  sticky: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'github';
  url: string;
  enabled: boolean;
}

export interface FooterProps {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  tagline: string;
  columns: FooterColumn[];
  socials: FooterSocial[];
  copyrightText: string;
  style: 'simple' | 'columns' | 'centered';
  backgroundColor: string;
  textColor: string;
  showSocials: boolean;
}

export interface ContactFormProps {
  showName: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showMessage: boolean;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
  buttonText: string;
  buttonColor: string;
  successMessage: string;
  requirePhone: boolean;
  layout: 'stacked' | 'two-column';
}

export interface ListProps {
  items: string[];
  style: 'bullet' | 'numbered' | 'check' | 'none';
  fontSize: number;
  color: string;
  spacing: 'tight' | 'normal' | 'relaxed';
}

export interface BlockquoteProps {
  text: string;
  author: string;
  style: 'simple' | 'bordered' | 'highlighted';
  fontSize: number;
  color: string;
  accentColor: string;
}

export interface MapProps {
  address: string;
  zoom: number;
  height: number;
  borderRadius: number;
  style: 'roadmap' | 'satellite';
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  prefix: string;
  suffix: string;
}

export interface StatsProps {
  stats: StatItem[];
  columns: 2 | 3 | 4;
  style: 'simple' | 'cards' | 'bordered';
  valueColor: string;
  valueSize: number;
}

export interface LogoItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface LogoCloudProps {
  logos: LogoItem[];
  columns: 3 | 4 | 5 | 6;
  grayscale: boolean;
  title: string;
  showTitle: boolean;
}

export interface AlertBannerProps {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: boolean;
  dismissible: boolean;
  style: 'filled' | 'outlined' | 'subtle';
}

export interface HtmlEmbedProps {
  code: string;
  height: number;
}

export interface PageSettings {
  title: string;
  description: string;
  slug: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  primaryColor: string;
  fontFamily: string;
  maxWidth: 'sm' | 'md' | 'lg' | 'xl';
}

export interface PageData {
  blocks: Block[];
  settings: PageSettings;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: 'Type',
    category: 'basic',
    defaultProps: {
      text: 'Add your heading',
      level: 'h1',
      fontSize: 36,
      fontWeight: 'bold',
      alignment: 'center',
      color: '',
    } as HeadingProps,
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'AlignLeft',
    category: 'basic',
    defaultProps: {
      text: 'Add your text here. Click to edit.',
      fontSize: 16,
      alignment: 'center',
      color: '',
    } as TextProps,
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    category: 'basic',
    defaultProps: {
      src: '',
      alt: 'Image',
      width: 200,
      height: 200,
      alignment: 'center',
      borderRadius: 8,
    } as ImageProps,
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'MousePointer',
    category: 'basic',
    defaultProps: {
      text: 'Click me',
      action: 'submit',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      borderRadius: 8,
      size: 'md',
      fullWidth: false,
    } as ButtonProps,
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'Minus',
    category: 'layout',
    defaultProps: {
      style: 'solid',
      color: '#e5e7eb',
      thickness: 1,
      width: 100,
    } as DividerProps,
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    category: 'layout',
    defaultProps: {
      height: 40,
    } as SpacerProps,
  },
  {
    type: 'form',
    label: 'Signup Form',
    icon: 'FileInput',
    category: 'forms',
    defaultProps: {
      showName: true,
      showEmail: true,
      showPhone: false,
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Your email',
      phonePlaceholder: 'Your phone',
      buttonText: 'Subscribe',
      buttonColor: '#7c3aed',
      successMessage: 'Thank you for subscribing!',
      layout: 'stacked',
    } as FormProps,
  },
  {
    type: 'social',
    label: 'Social Icons',
    icon: 'Share2',
    category: 'marketing',
    defaultProps: {
      platforms: [
        { name: 'twitter', url: '#', enabled: true },
        { name: 'facebook', url: '#', enabled: true },
        { name: 'instagram', url: '#', enabled: true },
        { name: 'linkedin', url: '#', enabled: false },
        { name: 'youtube', url: '#', enabled: false },
      ],
      size: 'md',
      color: '#6b7280',
      alignment: 'center',
    } as SocialProps,
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: 'Quote',
    category: 'marketing',
    defaultProps: {
      quote: '"This product changed my life. Highly recommended!"',
      author: 'Jane Doe',
      role: 'CEO at Company',
      avatar: '',
      backgroundColor: '#f9fafb',
    } as TestimonialProps,
  },
  {
    type: 'countdown',
    label: 'Countdown',
    icon: 'Clock',
    category: 'marketing',
    defaultProps: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      label: 'Launching in',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      color: '#7c3aed',
    } as CountdownProps,
  },
  {
    type: 'video',
    label: 'Video',
    icon: 'Play',
    category: 'basic',
    defaultProps: {
      url: '',
      aspectRatio: '16:9',
      autoplay: false,
      controls: true,
      alignment: 'center',
    } as VideoProps,
  },
  {
    type: 'accordion',
    label: 'FAQ / Accordion',
    icon: 'ChevronDown',
    category: 'marketing',
    defaultProps: {
      items: [
        { id: '1', question: 'What is your refund policy?', answer: 'We offer a 30-day money-back guarantee on all plans.' },
        { id: '2', question: 'How do I get started?', answer: 'Simply sign up for a free account and follow our onboarding guide.' },
        { id: '3', question: 'Do you offer support?', answer: 'Yes! We provide 24/7 email support and live chat during business hours.' },
      ],
      allowMultiple: false,
      style: 'default',
      iconPosition: 'right',
    } as AccordionProps,
  },
  {
    type: 'pricing',
    label: 'Pricing Table',
    icon: 'CreditCard',
    category: 'marketing',
    defaultProps: {
      tiers: [
        {
          id: '1',
          name: 'Starter',
          price: '$9',
          period: 'month',
          description: 'Perfect for individuals',
          features: ['Up to 1,000 subscribers', 'Basic analytics', 'Email support'],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: false,
        },
        {
          id: '2',
          name: 'Pro',
          price: '$29',
          period: 'month',
          description: 'For growing businesses',
          features: ['Up to 10,000 subscribers', 'Advanced analytics', 'Priority support', 'Custom branding'],
          buttonText: 'Start Free Trial',
          buttonUrl: '#',
          highlighted: true,
        },
        {
          id: '3',
          name: 'Enterprise',
          price: '$99',
          period: 'month',
          description: 'For large teams',
          features: ['Unlimited subscribers', 'Full analytics suite', 'Dedicated support', 'API access', 'SSO'],
          buttonText: 'Contact Sales',
          buttonUrl: '#',
          highlighted: false,
        },
      ],
      columns: 3,
      style: 'cards',
      highlightColor: '#7c3aed',
    } as PricingProps,
  },
  {
    type: 'feature-grid',
    label: 'Feature Grid',
    icon: 'LayoutGrid',
    category: 'marketing',
    defaultProps: {
      features: [
        { id: '1', icon: 'Zap', title: 'Lightning Fast', description: 'Built for speed and performance' },
        { id: '2', icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' },
        { id: '3', icon: 'Smartphone', title: 'Mobile Ready', description: 'Works on any device' },
        { id: '4', icon: 'Globe', title: 'Global Scale', description: 'Deploy worldwide in seconds' },
      ],
      columns: 4,
      style: 'cards',
      iconColor: '#7c3aed',
      showIcons: true,
    } as FeatureGridProps,
  },
  {
    type: 'hero',
    label: 'Hero Section',
    icon: 'Sparkles',
    category: 'marketing',
    defaultProps: {
      headline: 'Build Something Amazing',
      subheadline: 'Create stunning landing pages in minutes with our drag-and-drop editor. No coding required.',
      buttonText: 'Get Started Free',
      buttonLink: '#signup',
      backgroundImage: '',
      backgroundOverlay: 50,
      height: 'medium',
      alignment: 'center',
      textColor: 'light',
    } as HeroProps,
  },
  {
    type: 'nav',
    label: 'Navigation',
    icon: 'PanelTop',
    category: 'layout',
    defaultProps: {
      logoType: 'text',
      logoText: 'YourBrand',
      logoImage: '',
      menuItems: [
        { id: '1', label: 'Features', url: '#features' },
        { id: '2', label: 'Pricing', url: '#pricing' },
        { id: '3', label: 'About', url: '#about' },
        { id: '4', label: 'Contact', url: '#contact' },
      ],
      ctaButton: { enabled: true, text: 'Get Started', url: '#signup' },
      style: 'glass',
      alignment: 'spread',
      sticky: true,
      backgroundColor: '#ffffff',
      textColor: '#000000',
    } as NavProps,
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: 'PanelBottom',
    category: 'layout',
    defaultProps: {
      logoType: 'text',
      logoText: 'YourBrand',
      logoImage: '',
      tagline: 'Building the future, one step at a time.',
      columns: [
        {
          id: '1',
          title: 'Product',
          links: [
            { id: '1', label: 'Features', url: '#features' },
            { id: '2', label: 'Pricing', url: '#pricing' },
            { id: '3', label: 'Integrations', url: '#integrations' },
          ],
        },
        {
          id: '2',
          title: 'Company',
          links: [
            { id: '1', label: 'About', url: '#about' },
            { id: '2', label: 'Blog', url: '#blog' },
            { id: '3', label: 'Careers', url: '#careers' },
          ],
        },
        {
          id: '3',
          title: 'Support',
          links: [
            { id: '1', label: 'Help Center', url: '#help' },
            { id: '2', label: 'Contact', url: '#contact' },
            { id: '3', label: 'Privacy', url: '#privacy' },
          ],
        },
      ],
      socials: [
        { platform: 'twitter', url: '#', enabled: true },
        { platform: 'facebook', url: '#', enabled: true },
        { platform: 'instagram', url: '#', enabled: true },
        { platform: 'linkedin', url: '#', enabled: false },
        { platform: 'youtube', url: '#', enabled: false },
        { platform: 'github', url: '#', enabled: false },
      ],
      copyrightText: '© {year} YourBrand. All rights reserved.',
      style: 'columns',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      showSocials: true,
    } as FooterProps,
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    icon: 'MessageSquare',
    category: 'forms',
    defaultProps: {
      showName: true,
      showEmail: true,
      showPhone: true,
      showMessage: true,
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      messageLabel: 'Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+1 (555) 000-0000',
      messagePlaceholder: 'How can we help you?',
      buttonText: 'Send Message',
      buttonColor: '#7c3aed',
      successMessage: 'Thank you! We\'ll be in touch soon.',
      requirePhone: false,
      layout: 'stacked',
    } as ContactFormProps,
  },
  {
    type: 'list',
    label: 'List',
    icon: 'List',
    category: 'basic',
    defaultProps: {
      items: ['First item in the list', 'Second item in the list', 'Third item in the list'],
      style: 'bullet',
      fontSize: 16,
      color: '',
      spacing: 'normal',
    } as ListProps,
  },
  {
    type: 'blockquote',
    label: 'Blockquote',
    icon: 'TextQuote',
    category: 'basic',
    defaultProps: {
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      style: 'bordered',
      fontSize: 20,
      color: '#333333',
      accentColor: '#7c3aed',
    } as BlockquoteProps,
  },
  {
    type: 'map',
    label: 'Map',
    icon: 'MapPin',
    category: 'basic',
    defaultProps: {
      address: 'New York, NY',
      zoom: 12,
      height: 300,
      borderRadius: 12,
      style: 'roadmap',
    } as MapProps,
  },
  {
    type: 'stats',
    label: 'Stats Counter',
    icon: 'BarChart3',
    category: 'marketing',
    defaultProps: {
      stats: [
        { id: '1', value: '10K', label: 'Happy Users', prefix: '', suffix: '+' },
        { id: '2', value: '99', label: 'Uptime', prefix: '', suffix: '%' },
        { id: '3', value: '24/7', label: 'Support', prefix: '', suffix: '' },
        { id: '4', value: '50', label: 'Countries', prefix: '', suffix: '+' },
      ],
      columns: 4,
      style: 'simple',
      valueColor: '#7c3aed',
      valueSize: 36,
    } as StatsProps,
  },
  {
    type: 'logo-cloud',
    label: 'Logo Cloud',
    icon: 'Building2',
    category: 'marketing',
    defaultProps: {
      logos: [
        { id: '1', name: 'Company 1', imageUrl: '' },
        { id: '2', name: 'Company 2', imageUrl: '' },
        { id: '3', name: 'Company 3', imageUrl: '' },
        { id: '4', name: 'Company 4', imageUrl: '' },
        { id: '5', name: 'Company 5', imageUrl: '' },
        { id: '6', name: 'Company 6', imageUrl: '' },
      ],
      columns: 6,
      grayscale: true,
      title: 'Trusted by leading companies',
      showTitle: true,
    } as LogoCloudProps,
  },
  {
    type: 'alert-banner',
    label: 'Alert Banner',
    icon: 'Bell',
    category: 'marketing',
    defaultProps: {
      text: '🎉 Special offer: Get 50% off for a limited time!',
      type: 'info',
      icon: true,
      dismissible: false,
      style: 'filled',
    } as AlertBannerProps,
  },
  {
    type: 'html-embed',
    label: 'HTML Embed',
    icon: 'Code',
    category: 'layout',
    defaultProps: {
      code: '<div style="padding: 20px; text-align: center; background: #f3f4f6; border-radius: 8px;"><p>Custom HTML content goes here</p></div>',
      height: 200,
    } as HtmlEmbedProps,
  },
];

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  title: 'My Signup Page',
  description: 'Join our community',
  slug: 'my-page',
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  gradientFrom: '#7c3aed',
  gradientTo: '#a855f7',
  backgroundImage: '',
  primaryColor: '#7c3aed',
  fontFamily: 'Inter',
  maxWidth: 'md',
};
