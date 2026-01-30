import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

interface AccordionBlockProps {
  props: AccordionProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<AccordionProps>) => void;
}

export function AccordionBlock({ props, isSelected, isPreview }: AccordionBlockProps) {
  const styleClasses = {
    default: '',
    bordered: 'border rounded-lg overflow-hidden',
    separated: 'space-y-2',
  }[props.style];

  return (
    <div className={cn('w-full', styleClasses)}>
      <Accordion 
        type={props.allowMultiple ? 'multiple' : 'single'} 
        collapsible={!props.allowMultiple}
        className="w-full"
      >
        {props.items.map((item, index) => (
          <AccordionItem 
            key={item.id} 
            value={item.id}
            className={cn(
              props.style === 'separated' && 'border rounded-lg px-2',
              props.style === 'bordered' && index !== props.items.length - 1 && 'border-b'
            )}
          >
            <AccordionTrigger 
              className={cn(
                'text-left',
                props.iconPosition === 'left' && 'flex-row-reverse justify-end gap-3'
              )}
            >
              <span className="font-medium">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
