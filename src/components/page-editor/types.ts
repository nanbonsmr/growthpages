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
  | 'spacer';

export type BlockCategory = 'basic' | 'forms' | 'marketing' | 'layout';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  category: BlockCategory;
  defaultProps: Record<string, any>;
}

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
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
      color: '#000000',
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
      color: '#666666',
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
