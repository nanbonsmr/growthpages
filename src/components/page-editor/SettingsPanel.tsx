import { Block, PageSettings, BLOCK_DEFINITIONS, AccordionItemData, PricingTier, FeatureItem, NavMenuItem, FooterColumn, FooterLink, FooterSocial } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface SettingsPanelProps {
  selectedBlock: Block | null;
  settings: PageSettings;
  onUpdateBlock: (props: Record<string, any>) => void;
  onUpdateSettings: (settings: Partial<PageSettings>) => void;
}

export function SettingsPanel({
  selectedBlock,
  settings,
  onUpdateBlock,
  onUpdateSettings,
}: SettingsPanelProps) {
  const blockDef = selectedBlock
    ? BLOCK_DEFINITIONS.find((b) => b.type === selectedBlock.type)
    : null;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <Tabs defaultValue="element" className="flex flex-col h-full">
        <div className="border-b border-border p-2">
          <TabsList className="w-full">
            <TabsTrigger value="element" className="flex-1 gap-2">
              <Settings className="h-4 w-4" />
              Element
            </TabsTrigger>
            <TabsTrigger value="page" className="flex-1 gap-2">
              <Palette className="h-4 w-4" />
              Page
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="element" className="m-0 p-4">
            {selectedBlock ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground capitalize mb-4">
                    {blockDef?.label || selectedBlock.type} Settings
                  </h3>
                  <BlockSettings
                    block={selectedBlock}
                    onUpdate={onUpdateBlock}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No element selected</p>
                <p className="text-sm mt-1">Click an element to edit its settings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="page" className="m-0 p-4">
            <PageSettingsForm
              settings={settings}
              onUpdate={onUpdateSettings}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface BlockSettingsProps {
  block: Block;
  onUpdate: (props: Record<string, any>) => void;
}

function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
  const props = block.props;

  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-4">
          <div>
            <Label>Text</Label>
            <Textarea
              value={props.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={props.level} onValueChange={(v) => onUpdate({ level: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Main Heading</SelectItem>
                <SelectItem value="h2">H2 - Section Heading</SelectItem>
                <SelectItem value="h3">H3 - Subsection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Font Size: {props.fontSize}px</Label>
            <Slider
              value={[props.fontSize]}
              onValueChange={([v]) => onUpdate({ fontSize: v })}
              min={12}
              max={72}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Weight</Label>
            <Select value={props.fontWeight} onValueChange={(v) => onUpdate({ fontWeight: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={props.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Text</Label>
            <Textarea
              value={props.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label>Font Size: {props.fontSize}px</Label>
            <Slider
              value={[props.fontSize]}
              onValueChange={([v]) => onUpdate({ fontSize: v })}
              min={12}
              max={32}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={props.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <ImageUpload
            value={props.src}
            onChange={(url) => onUpdate({ src: url })}
            label="Image"
            aspectRatio="square"
          />
          <div>
            <Label>Alt Text</Label>
            <Input
              value={props.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Width: {props.width}px</Label>
            <Slider
              value={[props.width]}
              onValueChange={([v]) => onUpdate({ width: v })}
              min={50}
              max={600}
              step={10}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Height: {props.height}px</Label>
            <Slider
              value={[props.height]}
              onValueChange={([v]) => onUpdate({ height: v })}
              min={50}
              max={600}
              step={10}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Border Radius: {props.borderRadius}px</Label>
            <Slider
              value={[props.borderRadius]}
              onValueChange={([v]) => onUpdate({ borderRadius: v })}
              min={0}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={props.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Action</Label>
            <Select value={props.action} onValueChange={(v) => onUpdate({ action: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submit">Submit Form</SelectItem>
                <SelectItem value="link">Open Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {props.action === 'link' && (
            <div>
              <Label>Link URL</Label>
              <Input
                value={props.linkUrl || ''}
                onChange={(e) => onUpdate({ linkUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          )}
          <div>
            <Label>Size</Label>
            <Select value={props.size} onValueChange={(v) => onUpdate({ size: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Text Color</Label>
            <Input
              type="color"
              value={props.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Border Radius: {props.borderRadius}px</Label>
            <Slider
              value={[props.borderRadius]}
              onValueChange={([v]) => onUpdate({ borderRadius: v })}
              min={0}
              max={24}
              step={1}
              className="mt-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Full Width</Label>
            <Switch
              checked={props.fullWidth}
              onCheckedChange={(v) => onUpdate({ fullWidth: v })}
            />
          </div>
        </div>
      );

    case 'form':
      return (
        <div className="space-y-4">
          <div>
            <Label>Layout</Label>
            <Select value={props.layout} onValueChange={(v) => onUpdate({ layout: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stacked">Stacked</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Name Field</Label>
            <Switch
              checked={props.showName}
              onCheckedChange={(v) => onUpdate({ showName: v })}
            />
          </div>
          {props.showName && (
            <div>
              <Label>Name Placeholder</Label>
              <Input
                value={props.namePlaceholder}
                onChange={(e) => onUpdate({ namePlaceholder: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label>Show Email Field</Label>
            <Switch
              checked={props.showEmail}
              onCheckedChange={(v) => onUpdate({ showEmail: v })}
            />
          </div>
          {props.showEmail && (
            <div>
              <Label>Email Placeholder</Label>
              <Input
                value={props.emailPlaceholder}
                onChange={(e) => onUpdate({ emailPlaceholder: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label>Show Phone Field</Label>
            <Switch
              checked={props.showPhone}
              onCheckedChange={(v) => onUpdate({ showPhone: v })}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={props.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Button Color</Label>
            <Input
              type="color"
              value={props.buttonColor}
              onChange={(e) => onUpdate({ buttonColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Success Message</Label>
            <Textarea
              value={props.successMessage}
              onChange={(e) => onUpdate({ successMessage: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="space-y-4">
          <div>
            <Label>Style</Label>
            <Select value={props.style} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={props.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Thickness: {props.thickness}px</Label>
            <Slider
              value={[props.thickness]}
              onValueChange={([v]) => onUpdate({ thickness: v })}
              min={1}
              max={8}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Width: {props.width}%</Label>
            <Slider
              value={[props.width]}
              onValueChange={([v]) => onUpdate({ width: v })}
              min={10}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="space-y-4">
          <div>
            <Label>Height: {props.height}px</Label>
            <Slider
              value={[props.height]}
              onValueChange={([v]) => onUpdate({ height: v })}
              min={10}
              max={200}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div className="space-y-4">
          <div>
            <Label>Target Date</Label>
            <Input
              type="datetime-local"
              value={props.targetDate?.slice(0, 16)}
              onChange={(e) => onUpdate({ targetDate: new Date(e.target.value).toISOString() })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Label</Label>
            <Input
              value={props.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={props.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Days</Label>
            <Switch checked={props.showDays} onCheckedChange={(v) => onUpdate({ showDays: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Hours</Label>
            <Switch checked={props.showHours} onCheckedChange={(v) => onUpdate({ showHours: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Minutes</Label>
            <Switch checked={props.showMinutes} onCheckedChange={(v) => onUpdate({ showMinutes: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Seconds</Label>
            <Switch checked={props.showSeconds} onCheckedChange={(v) => onUpdate({ showSeconds: v })} />
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="space-y-4">
          <div>
            <Label>Quote</Label>
            <Textarea
              value={props.quote}
              onChange={(e) => onUpdate({ quote: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Author</Label>
            <Input
              value={props.author}
              onChange={(e) => onUpdate({ author: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              value={props.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input
              value={props.avatar}
              onChange={(e) => onUpdate({ avatar: e.target.value })}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
        </div>
      );

    case 'social':
      return (
        <div className="space-y-4">
          <div>
            <Label>Size</Label>
            <Select value={props.size} onValueChange={(v) => onUpdate({ size: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={props.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Platforms</Label>
            {props.platforms?.map((platform: any, idx: number) => (
              <div key={platform.name} className="flex items-center gap-2">
                <Switch
                  checked={platform.enabled}
                  onCheckedChange={(v) => {
                    const newPlatforms = [...props.platforms];
                    newPlatforms[idx] = { ...platform, enabled: v };
                    onUpdate({ platforms: newPlatforms });
                  }}
                />
                <span className="capitalize text-sm">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="space-y-4">
          <div>
            <Label>Video URL</Label>
            <Input
              value={props.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="YouTube, Vimeo, or Loom URL"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports YouTube, Vimeo, and Loom
            </p>
          </div>
          <div>
            <Label>Aspect Ratio</Label>
            <Select value={props.aspectRatio} onValueChange={(v) => onUpdate({ aspectRatio: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Autoplay (muted)</Label>
            <Switch checked={props.autoplay} onCheckedChange={(v) => onUpdate({ autoplay: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Controls</Label>
            <Switch checked={props.controls} onCheckedChange={(v) => onUpdate({ controls: v })} />
          </div>
        </div>
      );

    case 'accordion':
      return (
        <div className="space-y-4">
          <div>
            <Label>Style</Label>
            <Select value={props.style} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="separated">Separated Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Icon Position</Label>
            <Select value={props.iconPosition} onValueChange={(v) => onUpdate({ iconPosition: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow Multiple Open</Label>
            <Switch checked={props.allowMultiple} onCheckedChange={(v) => onUpdate({ allowMultiple: v })} />
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label>FAQ Items</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newItem: AccordionItemData = {
                    id: Math.random().toString(36).substr(2, 9),
                    question: 'New question?',
                    answer: 'Answer here...',
                  };
                  onUpdate({ items: [...(props.items || []), newItem] });
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {props.items?.map((item: AccordionItemData, idx: number) => (
              <div key={item.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Item {idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      const newItems = props.items.filter((i: AccordionItemData) => i.id !== item.id);
                      onUpdate({ items: newItems });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const newItems = props.items.map((i: AccordionItemData) =>
                      i.id === item.id ? { ...i, question: e.target.value } : i
                    );
                    onUpdate({ items: newItems });
                  }}
                  placeholder="Question"
                />
                <Textarea
                  value={item.answer}
                  onChange={(e) => {
                    const newItems = props.items.map((i: AccordionItemData) =>
                      i.id === item.id ? { ...i, answer: e.target.value } : i
                    );
                    onUpdate({ items: newItems });
                  }}
                  placeholder="Answer"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div className="space-y-4">
          <div>
            <Label>Columns</Label>
            <Select value={String(props.columns)} onValueChange={(v) => onUpdate({ columns: Number(v) })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Style</Label>
            <Select value={props.style} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Highlight Color</Label>
            <Input
              type="color"
              value={props.highlightColor}
              onChange={(e) => onUpdate({ highlightColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label>Pricing Tiers</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newTier: PricingTier = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: 'New Plan',
                    price: '$0',
                    period: 'month',
                    description: '',
                    features: ['Feature 1'],
                    buttonText: 'Get Started',
                    buttonUrl: '#',
                    highlighted: false,
                  };
                  onUpdate({ tiers: [...(props.tiers || []), newTier] });
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {props.tiers?.map((tier: PricingTier, idx: number) => (
              <div key={tier.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tier.name}</span>
                  <div className="flex gap-1">
                    <Switch
                      checked={tier.highlighted}
                      onCheckedChange={(v) => {
                        const newTiers = props.tiers.map((t: PricingTier) =>
                          t.id === tier.id ? { ...t, highlighted: v } : t
                        );
                        onUpdate({ tiers: newTiers });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => {
                        const newTiers = props.tiers.filter((t: PricingTier) => t.id !== tier.id);
                        onUpdate({ tiers: newTiers });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Input
                  value={tier.name}
                  onChange={(e) => {
                    const newTiers = props.tiers.map((t: PricingTier) =>
                      t.id === tier.id ? { ...t, name: e.target.value } : t
                    );
                    onUpdate({ tiers: newTiers });
                  }}
                  placeholder="Plan name"
                />
                <div className="flex gap-2">
                  <Input
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = props.tiers.map((t: PricingTier) =>
                        t.id === tier.id ? { ...t, price: e.target.value } : t
                      );
                      onUpdate({ tiers: newTiers });
                    }}
                    placeholder="$29"
                    className="w-20"
                  />
                  <Input
                    value={tier.period}
                    onChange={(e) => {
                      const newTiers = props.tiers.map((t: PricingTier) =>
                        t.id === tier.id ? { ...t, period: e.target.value } : t
                      );
                      onUpdate({ tiers: newTiers });
                    }}
                    placeholder="month"
                    className="flex-1"
                  />
                </div>
                <Textarea
                  value={tier.features.join('\n')}
                  onChange={(e) => {
                    const newTiers = props.tiers.map((t: PricingTier) =>
                      t.id === tier.id ? { ...t, features: e.target.value.split('\n').filter(Boolean) } : t
                    );
                    onUpdate({ tiers: newTiers });
                  }}
                  placeholder="One feature per line"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'feature-grid':
      return (
        <div className="space-y-4">
          <div>
            <Label>Columns</Label>
            <Select value={String(props.columns)} onValueChange={(v) => onUpdate({ columns: Number(v) })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Style</Label>
            <Select value={props.style} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="icons-left">Icons Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Icons</Label>
            <Switch checked={props.showIcons} onCheckedChange={(v) => onUpdate({ showIcons: v })} />
          </div>
          {props.showIcons && (
            <div>
              <Label>Icon Color</Label>
              <Input
                type="color"
                value={props.iconColor}
                onChange={(e) => onUpdate({ iconColor: e.target.value })}
                className="mt-1 h-10 cursor-pointer"
              />
            </div>
          )}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newFeature: FeatureItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    icon: 'Star',
                    title: 'New Feature',
                    description: 'Description here',
                  };
                  onUpdate({ features: [...(props.features || []), newFeature] });
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {props.features?.map((feature: FeatureItem, idx: number) => (
              <div key={feature.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Feature {idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      const newFeatures = props.features.filter((f: FeatureItem) => f.id !== feature.id);
                      onUpdate({ features: newFeatures });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Select
                  value={feature.icon}
                  onValueChange={(v) => {
                    const newFeatures = props.features.map((f: FeatureItem) =>
                      f.id === feature.id ? { ...f, icon: v } : f
                    );
                    onUpdate({ features: newFeatures });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Star">Star</SelectItem>
                    <SelectItem value="Zap">Zap</SelectItem>
                    <SelectItem value="Shield">Shield</SelectItem>
                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                    <SelectItem value="Globe">Globe</SelectItem>
                    <SelectItem value="Lock">Lock</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Heart">Heart</SelectItem>
                    <SelectItem value="Rocket">Rocket</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={feature.title}
                  onChange={(e) => {
                    const newFeatures = props.features.map((f: FeatureItem) =>
                      f.id === feature.id ? { ...f, title: e.target.value } : f
                    );
                    onUpdate({ features: newFeatures });
                  }}
                  placeholder="Title"
                />
                <Input
                  value={feature.description}
                  onChange={(e) => {
                    const newFeatures = props.features.map((f: FeatureItem) =>
                      f.id === feature.id ? { ...f, description: e.target.value } : f
                    );
                    onUpdate({ features: newFeatures });
                  }}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Textarea
              value={props.headline}
              onChange={(e) => onUpdate({ headline: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label>Subheadline</Label>
            <Textarea
              value={props.subheadline}
              onChange={(e) => onUpdate({ subheadline: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={props.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={props.buttonLink}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
              placeholder="#signup or https://..."
              className="mt-1"
            />
          </div>
          <ImageUpload
            value={props.backgroundImage}
            onChange={(url) => onUpdate({ backgroundImage: url })}
            label="Background Image"
            aspectRatio="video"
          />
          {props.backgroundImage && (
            <div>
              <Label>Overlay Opacity: {props.backgroundOverlay}%</Label>
              <Slider
                value={[props.backgroundOverlay || 50]}
                onValueChange={([v]) => onUpdate({ backgroundOverlay: v })}
                min={0}
                max={90}
                step={5}
                className="mt-2"
              />
            </div>
          )}
          <div>
            <Label>Height</Label>
            <Select value={props.height || 'medium'} onValueChange={(v) => onUpdate({ height: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (300px)</SelectItem>
                <SelectItem value="medium">Medium (450px)</SelectItem>
                <SelectItem value="large">Large (600px)</SelectItem>
                <SelectItem value="full">Full Screen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment || 'center'} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Text Color</Label>
            <Select value={props.textColor || 'light'} onValueChange={(v) => onUpdate({ textColor: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light (for dark backgrounds)</SelectItem>
                <SelectItem value="dark">Dark (for light backgrounds)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'nav':
      return (
        <div className="space-y-4">
          <div>
            <Label>Logo Type</Label>
            <Select value={props.logoType || 'text'} onValueChange={(v) => onUpdate({ logoType: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {props.logoType === 'image' ? (
            <ImageUpload
              value={props.logoImage}
              onChange={(url) => onUpdate({ logoImage: url })}
              label="Logo Image"
              aspectRatio="square"
            />
          ) : (
            <div>
              <Label>Logo Text</Label>
              <Input
                value={props.logoText}
                onChange={(e) => onUpdate({ logoText: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          <div>
            <Label>Style</Label>
            <Select value={props.style || 'glass'} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="glass">Glass (Blur)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {props.style === 'solid' && (
            <>
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={props.backgroundColor}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={props.textColor}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
            </>
          )}
          <div>
            <Label>Alignment</Label>
            <Select value={props.alignment || 'spread'} onValueChange={(v) => onUpdate({ alignment: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="spread">Spread (Logo left, menu right)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Menu Items */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label>Menu Items</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newItem: NavMenuItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    label: 'New Link',
                    url: '#',
                  };
                  onUpdate({ menuItems: [...(props.menuItems || []), newItem] });
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {props.menuItems?.map((item: NavMenuItem, idx: number) => (
              <div key={item.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Item {idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      const newItems = props.menuItems.filter((i: NavMenuItem) => i.id !== item.id);
                      onUpdate({ menuItems: newItems });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const newItems = props.menuItems.map((i: NavMenuItem) =>
                      i.id === item.id ? { ...i, label: e.target.value } : i
                    );
                    onUpdate({ menuItems: newItems });
                  }}
                  placeholder="Label"
                />
                <Input
                  value={item.url}
                  onChange={(e) => {
                    const newItems = props.menuItems.map((i: NavMenuItem) =>
                      i.id === item.id ? { ...i, url: e.target.value } : i
                    );
                    onUpdate({ menuItems: newItems });
                  }}
                  placeholder="#section or https://..."
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="space-y-3 mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>CTA Button</Label>
              <Switch
                checked={props.ctaButton?.enabled ?? true}
                onCheckedChange={(v) => onUpdate({ ctaButton: { ...props.ctaButton, enabled: v } })}
              />
            </div>
            {props.ctaButton?.enabled && (
              <>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={props.ctaButton?.text || ''}
                    onChange={(e) => onUpdate({ ctaButton: { ...props.ctaButton, text: e.target.value } })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Button URL</Label>
                  <Input
                    value={props.ctaButton?.url || ''}
                    onChange={(e) => onUpdate({ ctaButton: { ...props.ctaButton, url: e.target.value } })}
                    placeholder="#signup or https://..."
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Sticky Option */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <Label>Sticky Navigation</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keep navbar fixed at top when scrolling
              </p>
            </div>
            <Switch
              checked={props.sticky ?? false}
              onCheckedChange={(v) => onUpdate({ sticky: v })}
            />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-4">
          <div>
            <Label>Style</Label>
            <Select value={props.style || 'columns'} onValueChange={(v) => onUpdate({ style: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple (One Row)</SelectItem>
                <SelectItem value="columns">Columns</SelectItem>
                <SelectItem value="centered">Centered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Logo Type</Label>
            <Select value={props.logoType || 'text'} onValueChange={(v) => onUpdate({ logoType: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {props.logoType === 'image' ? (
            <ImageUpload
              value={props.logoImage}
              onChange={(url) => onUpdate({ logoImage: url })}
              label="Logo Image"
              aspectRatio="square"
            />
          ) : (
            <div>
              <Label>Logo Text</Label>
              <Input
                value={props.logoText}
                onChange={(e) => onUpdate({ logoText: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label>Tagline</Label>
            <Input
              value={props.tagline}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
              placeholder="Your company tagline"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Copyright Text</Label>
            <Input
              value={props.copyrightText}
              onChange={(e) => onUpdate({ copyrightText: e.target.value })}
              placeholder="© {year} Company"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Use {'{year}'} for current year</p>
          </div>

          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor || '#1a1a2e'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
          <div>
            <Label>Text Color</Label>
            <Input
              type="color"
              value={props.textColor || '#ffffff'}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Show Social Icons</Label>
              <Switch
                checked={props.showSocials ?? true}
                onCheckedChange={(v) => onUpdate({ showSocials: v })}
              />
            </div>
            {props.showSocials && (
              <div className="space-y-2">
                {props.socials?.map((social: FooterSocial, idx: number) => (
                  <div key={social.platform} className="flex items-center gap-2">
                    <Switch
                      checked={social.enabled}
                      onCheckedChange={(v) => {
                        const newSocials = props.socials.map((s: FooterSocial, i: number) =>
                          i === idx ? { ...s, enabled: v } : s
                        );
                        onUpdate({ socials: newSocials });
                      }}
                    />
                    <span className="text-sm capitalize w-20">{social.platform}</span>
                    {social.enabled && (
                      <Input
                        value={social.url}
                        onChange={(e) => {
                          const newSocials = props.socials.map((s: FooterSocial, i: number) =>
                            i === idx ? { ...s, url: e.target.value } : s
                          );
                          onUpdate({ socials: newSocials });
                        }}
                        placeholder="https://..."
                        className="flex-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns - Only show for columns/centered style */}
          {(props.style === 'columns' || props.style === 'centered') && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Link Columns</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newColumn: FooterColumn = {
                      id: Math.random().toString(36).substr(2, 9),
                      title: 'New Column',
                      links: [{ id: '1', label: 'Link', url: '#' }],
                    };
                    onUpdate({ columns: [...(props.columns || []), newColumn] });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {props.columns?.map((column: FooterColumn, colIdx: number) => (
                <div key={column.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={column.title}
                      onChange={(e) => {
                        const newColumns = props.columns.map((c: FooterColumn, i: number) =>
                          i === colIdx ? { ...c, title: e.target.value } : c
                        );
                        onUpdate({ columns: newColumns });
                      }}
                      placeholder="Column title"
                      className="font-medium"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 ml-2"
                      onClick={() => {
                        const newColumns = props.columns.filter((_: FooterColumn, i: number) => i !== colIdx);
                        onUpdate({ columns: newColumns });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {column.links.map((link: FooterLink, linkIdx: number) => (
                      <div key={link.id} className="flex gap-1">
                        <Input
                          value={link.label}
                          onChange={(e) => {
                            const newColumns = props.columns.map((c: FooterColumn, ci: number) =>
                              ci === colIdx
                                ? {
                                    ...c,
                                    links: c.links.map((l: FooterLink, li: number) =>
                                      li === linkIdx ? { ...l, label: e.target.value } : l
                                    ),
                                  }
                                : c
                            );
                            onUpdate({ columns: newColumns });
                          }}
                          placeholder="Label"
                          className="text-sm"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newColumns = props.columns.map((c: FooterColumn, ci: number) =>
                              ci === colIdx
                                ? {
                                    ...c,
                                    links: c.links.map((l: FooterLink, li: number) =>
                                      li === linkIdx ? { ...l, url: e.target.value } : l
                                    ),
                                  }
                                : c
                            );
                            onUpdate({ columns: newColumns });
                          }}
                          placeholder="#url"
                          className="text-sm"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0"
                          onClick={() => {
                            const newColumns = props.columns.map((c: FooterColumn, ci: number) =>
                              ci === colIdx
                                ? { ...c, links: c.links.filter((_: FooterLink, li: number) => li !== linkIdx) }
                                : c
                            );
                            onUpdate({ columns: newColumns });
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-1"
                      onClick={() => {
                        const newColumns = props.columns.map((c: FooterColumn, ci: number) =>
                          ci === colIdx
                            ? {
                                ...c,
                                links: [
                                  ...c.links,
                                  { id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#' },
                                ],
                              }
                            : c
                        );
                        onUpdate({ columns: newColumns });
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'contact-form':
      return (
        <div className="space-y-4">
          <div>
            <Label>Layout</Label>
            <Select value={props.layout || 'stacked'} onValueChange={(v) => onUpdate({ layout: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stacked">Stacked</SelectItem>
                <SelectItem value="two-column">Two Column</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Toggles */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-muted-foreground">Fields</Label>
            
            <div className="flex items-center justify-between">
              <Label>Name Field</Label>
              <Switch
                checked={props.showName ?? true}
                onCheckedChange={(v) => onUpdate({ showName: v })}
              />
            </div>
            {props.showName && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={props.nameLabel}
                  onChange={(e) => onUpdate({ nameLabel: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={props.namePlaceholder}
                  onChange={(e) => onUpdate({ namePlaceholder: e.target.value })}
                  placeholder="Placeholder"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label>Email Field</Label>
              <Switch
                checked={props.showEmail ?? true}
                onCheckedChange={(v) => onUpdate({ showEmail: v })}
              />
            </div>
            {props.showEmail && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={props.emailLabel}
                  onChange={(e) => onUpdate({ emailLabel: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={props.emailPlaceholder}
                  onChange={(e) => onUpdate({ emailPlaceholder: e.target.value })}
                  placeholder="Placeholder"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label>Phone Field</Label>
              <Switch
                checked={props.showPhone ?? true}
                onCheckedChange={(v) => onUpdate({ showPhone: v })}
              />
            </div>
            {props.showPhone && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={props.phoneLabel}
                    onChange={(e) => onUpdate({ phoneLabel: e.target.value })}
                    placeholder="Label"
                  />
                  <Input
                    value={props.phonePlaceholder}
                    onChange={(e) => onUpdate({ phonePlaceholder: e.target.value })}
                    placeholder="Placeholder"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Require Phone</Label>
                  <Switch
                    checked={props.requirePhone ?? false}
                    onCheckedChange={(v) => onUpdate({ requirePhone: v })}
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label>Message Field</Label>
              <Switch
                checked={props.showMessage ?? true}
                onCheckedChange={(v) => onUpdate({ showMessage: v })}
              />
            </div>
            {props.showMessage && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={props.messageLabel}
                  onChange={(e) => onUpdate({ messageLabel: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={props.messagePlaceholder}
                  onChange={(e) => onUpdate({ messagePlaceholder: e.target.value })}
                  placeholder="Placeholder"
                />
              </div>
            )}
          </div>

          {/* Button Settings */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-muted-foreground">Button</Label>
            <div>
              <Label>Button Text</Label>
              <Input
                value={props.buttonText}
                onChange={(e) => onUpdate({ buttonText: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Button Color</Label>
              <Input
                type="color"
                value={props.buttonColor || '#7c3aed'}
                onChange={(e) => onUpdate({ buttonColor: e.target.value })}
                className="mt-1 h-10 cursor-pointer"
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="pt-4 border-t">
            <Label>Success Message</Label>
            <Textarea
              value={props.successMessage}
              onChange={(e) => onUpdate({ successMessage: e.target.value })}
              placeholder="Thank you! We'll be in touch soon."
              className="mt-1"
            />
          </div>
        </div>
      );

    default:
      return (
        <p className="text-muted-foreground text-sm">
          No settings available for this block type.
        </p>
      );
  }
}

interface PageSettingsFormProps {
  settings: PageSettings;
  onUpdate: (settings: Partial<PageSettings>) => void;
}

function PageSettingsForm({ settings, onUpdate }: PageSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Page Settings</h3>
        <div className="space-y-4">
          <div>
            <Label>Page Title</Label>
            <Input
              value={settings.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={settings.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={settings.slug}
              onChange={(e) => onUpdate({ slug: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Background</h3>
        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <Select
              value={settings.backgroundType}
              onValueChange={(v: any) => onUpdate({ backgroundType: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.backgroundType === 'solid' && (
            <div>
              <Label>Background Color</Label>
              <Input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="mt-1 h-10 cursor-pointer"
              />
            </div>
          )}

          {settings.backgroundType === 'gradient' && (
            <>
              <div>
                <Label>From Color</Label>
                <Input
                  type="color"
                  value={settings.gradientFrom}
                  onChange={(e) => onUpdate({ gradientFrom: e.target.value })}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
              <div>
                <Label>To Color</Label>
                <Input
                  type="color"
                  value={settings.gradientTo}
                  onChange={(e) => onUpdate({ gradientTo: e.target.value })}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
            </>
          )}

          {settings.backgroundType === 'image' && (
            <div>
              <Label>Image URL</Label>
              <Input
                value={settings.backgroundImage}
                onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Typography</h3>
        <div className="space-y-4">
          <div>
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(v) => onUpdate({ fontFamily: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                <SelectItem value="DM Sans">DM Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => onUpdate({ primaryColor: e.target.value })}
              className="mt-1 h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Layout</h3>
        <div>
          <Label>Max Width</Label>
          <Select
            value={settings.maxWidth}
            onValueChange={(v: any) => onUpdate({ maxWidth: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small (384px)</SelectItem>
              <SelectItem value="md">Medium (448px)</SelectItem>
              <SelectItem value="lg">Large (512px)</SelectItem>
              <SelectItem value="xl">Extra Large (576px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
