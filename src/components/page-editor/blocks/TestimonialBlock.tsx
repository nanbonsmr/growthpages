import { TestimonialProps } from '../types';
import { Quote } from 'lucide-react';

interface TestimonialBlockProps {
  props: TestimonialProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<TestimonialProps>) => void;
}

export function TestimonialBlock({ props, isPreview, onUpdate }: TestimonialBlockProps) {
  return (
    <div
      className="p-6 rounded-xl max-w-lg mx-auto"
      style={{ backgroundColor: props.backgroundColor }}
    >
      <Quote className="h-6 w-6 text-primary/30 mb-3" />
      <p
        className="text-foreground mb-4 leading-relaxed"
        contentEditable={!isPreview}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ quote: e.currentTarget.innerText })}
      >
        {props.quote}
      </p>
      <div className="flex items-center gap-3">
        {props.avatar ? (
          <img
            src={props.avatar}
            alt={props.author}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {props.author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">{props.author}</p>
          <p className="text-muted-foreground text-xs">{props.role}</p>
        </div>
      </div>
    </div>
  );
}
