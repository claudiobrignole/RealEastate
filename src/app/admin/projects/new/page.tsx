'use client';

import React, { useState } from 'react';
import { Sparkles, Save, ArrowLeft, LayoutTemplate, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { cn } from '@/lib/utils';
import { createProject } from '@/lib/actions/projects';

import ThemeVariant1 from '@/components/themes/ThemeVariant1';
import ThemeVariant2 from '@/components/themes/ThemeVariant2';
import ThemeVariant3 from '@/components/themes/ThemeVariant3';
import ThemeVariant4 from '@/components/themes/ThemeVariant4';
import { translateContent } from '@/lib/ai';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageBlock, BlockType } from '@/types/blocks';
import ImageUploader from '@/components/ui/ImageUploader';
import HeroBlock from '@/components/blocks/HeroBlock';

type Language = 'it' | 'en' | 'fr' | 'de';

function SortableBlockItem({ block, isActive, onClick }: { block: PageBlock, isActive: boolean, onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      onPointerDown={onClick}
      className={cn("p-sm bg-surface-bright border rounded-DEFAULT mb-2 cursor-pointer font-body-md text-primary hover:border-tertiary/50 transition-colors", isActive ? "border-tertiary text-secondary shadow-sm" : "border-outline-variant")}
    >
      Blocco {block.type}
    </div>
  );
}

interface LocalizedContent {
  title: string;
  subtitle: string;
  content: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>('it');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  
  const updateBlockData = (id: string, newData: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b));
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);
  const theme = 'landing_variant_1';
  const [slug, setSlug] = useState('');
  
  const [content, setContent] = useState<Record<Language, LocalizedContent>>({
    it: { title: '', subtitle: '', content: '' },
    en: { title: '', subtitle: '', content: '' },
    fr: { title: '', subtitle: '', content: '' },
    de: { title: '', subtitle: '', content: '' },
  });

  const languages: { code: Language; label: string }[] = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
  ];

  const themes = [
    { id: 'landing_variant_1', name: 'Editorial Elegance (Variante 1)', component: ThemeVariant1 },
    { id: 'landing_variant_2', name: 'Modern Split (Variante 2)', component: ThemeVariant2 },
    { id: 'landing_variant_3', name: 'Dark Executive (Variante 3)', component: ThemeVariant3 },
    { id: 'landing_variant_4', name: 'High Contrast (Variante 4)', component: ThemeVariant4 },
  ];

  const [isTranslating, setIsTranslating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: {}
    };
    setBlocks([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
    setShowAddMenu(false);
  };

  const ActiveThemeComponent = themes.find(t => t.id === theme)?.component || ThemeVariant1;

  const handleContentChange = (field: keyof LocalizedContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  const handleTranslateAI = async () => {
    alert("La traduzione automatica con AI è temporaneamente in pausa in attesa di credenziali API valide.");
    /*
    const sourceContent = content[activeLang];
    
    if (!sourceContent.title && !sourceContent.content && !sourceContent.subtitle) {
      alert(`Il contenuto in ${activeLang.toUpperCase()} è vuoto, compila prima quello.`);
      return;
    }

    try {
      setIsTranslating(true);
      
      const targetLangs = languages.filter(l => l.code !== activeLang);
      
      const translationPromises = targetLangs.map(async (lang) => {
        const translatedTitle = sourceContent.title 
          ? await translateContent(sourceContent.title, lang.label)
          : '';
        const translatedSubtitle = sourceContent.subtitle 
          ? await translateContent(sourceContent.subtitle, lang.label)
          : '';
        const translatedRichText = sourceContent.content 
          ? await translateContent(sourceContent.content, lang.label)
          : '';
          
        return {
          langCode: lang.code,
          content: {
            title: translatedTitle,
            subtitle: translatedSubtitle,
            content: translatedRichText
          }
        };
      });

      const results = await Promise.all(translationPromises);
      
      setContent(prev => {
        const newObj = { ...prev };
        results.forEach(result => {
          newObj[result.langCode] = result.content;
        });
        return newObj;
      });
      
      alert('Traduzione completata!');
      
    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante la traduzione AI.");
    } finally {
      setIsTranslating(false);
    }
    */
  };

  const handleSave = async () => {
    if (!content.it.title && !slug) {
      alert("Inserisci almeno il Titolo in Italiano o l'URL Permanente.");
      return;
    }
    try {
      setIsSaving(true);
      const res = await createProject({
        slug: slug || content.it.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        themeId: theme,
        content: content,
        status: 'draft'
      });
      if (res.success) {
        alert("Progetto Salvato con successo!");
        router.push('/admin/projects');
      } else {
        console.error("Errore salvataggio:", res.error);
        alert(`Errore durante il salvataggio: ${res.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Errore critico durante il salvataggio.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-12 p-margin max-w-[1800px] mx-auto min-h-screen flex flex-col">
      {/* Header section */}
      <div className="flex items-center justify-between mb-lg shrink-0">
        <div className="flex items-center gap-sm">
          <Link href="/admin/projects" className="p-sm rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-h1 text-h2 text-primary">Nuovo Progetto</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Configura e visualizza l&apos;anteprima in tempo reale</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-on-primary px-lg py-sm rounded-DEFAULT font-data-point text-data-point flex items-center gap-xs hover:bg-inverse-surface transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Salvataggio..." : "Salva Progetto"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 min-h-0">
        
        {/* Sidebar Inputs */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-lg overflow-y-auto pb-lg pr-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
            <h3 className="font-h3 text-h3 text-primary mb-md border-b border-outline-variant pb-xs flex items-center gap-xs">
              <LayoutTemplate className="w-5 h-5 text-on-surface-variant" /> Impostazioni e Tema
            </h3>
            
            <div className="flex flex-col gap-md">
              <div>
                <div className="flex items-center justify-between mb-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Blocchi Pagina
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowAddMenu(!showAddMenu)}
                      className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded hover:bg-secondary/20"
                    >
                      + Aggiungi Blocco
                    </button>
                    {showAddMenu && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-outline-variant shadow-lg z-50 rounded-DEFAULT overflow-hidden">
                        {(['hero', 'gallery', 'editorial', 'features', 'form'] as BlockType[]).map(type => (
                          <button 
                            key={type}
                            onClick={() => handleAddBlock(type)}
                            className="block w-full text-left px-4 py-2 hover:bg-surface-container-low text-body-sm"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="min-h-[100px] border border-dashed border-outline-variant rounded-DEFAULT p-sm bg-surface-container-lowest">
                      {blocks.length === 0 ? (
                        <p className="text-center text-on-surface-variant text-body-sm py-md">Nessun blocco aggiunto.</p>
                      ) : (
                        blocks.map(block => (
                          <SortableBlockItem 
                            key={block.id} 
                            block={block} 
                            isActive={activeBlockId === block.id}
                            onClick={() => setActiveBlockId(block.id)}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                {activeBlock && (
                  <div className="mt-md p-md border border-outline-variant rounded-lg bg-surface-container-lowest shadow-sm">
                    <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
                      <h4 className="font-label-caps text-label-caps uppercase text-on-surface-variant flex items-center gap-xs">
                        Proprietà Blocco ({activeBlock.type})
                      </h4>
                      <button onClick={() => setActiveBlockId(null)} className="text-xs text-secondary hover:text-secondary-fixed">
                        Chiudi
                      </button>
                    </div>
                    
                    {activeBlock.type === 'hero' && (
                      <div className="flex flex-col gap-md">
                        <ImageUploader 
                          onUploadComplete={(url) => updateBlockData(activeBlock.id, { imageUrl: url })} 
                        />
                        
                        <div className="flex items-center gap-sm">
                          <hr className="flex-1 border-outline-variant" />
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider shrink-0">
                            oppure URL diretto
                          </span>
                          <hr className="flex-1 border-outline-variant" />
                        </div>
                        <div>
                          <input
                            type="url"
                            className="w-full bg-surface-bright border border-outline-variant rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary px-sm py-2 font-body-sm text-primary transition-all"
                            value={activeBlock.data?.imageUrl || ''}
                            onChange={(e) => updateBlockData(activeBlock.id, { imageUrl: e.target.value })}
                            placeholder="https://esempio.com/immagine.jpg"
                          />
                        </div>

                        {activeBlock.data?.imageUrl && (
                          <div className="w-full h-32 relative rounded overflow-hidden">
                            <img src={activeBlock.data.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                          </div>
                        )}
                        
                        <div>
                          <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-wider">
                            Label Superiore (Kicker)
                          </label>
                          <input
                            type="text"
                            className="w-full bg-surface-bright border border-outline-variant rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary px-sm py-2 font-body-md text-primary transition-all"
                            value={activeBlock.data?.kicker || ''}
                            onChange={(e) => updateBlockData(activeBlock.id, { kicker: e.target.value })}
                            placeholder="Es. Exclusive Listing"
                          />
                        </div>

                        <div>
                          <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-wider">
                            Titolo ({activeLang.toUpperCase()})
                          </label>
                          <input 
                            type="text"
                            className="w-full bg-surface-bright border border-outline-variant rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary px-sm py-2 font-body-md text-primary transition-all"
                            value={activeBlock.data?.title?.[activeLang] || ''}
                            onChange={(e) => updateBlockData(activeBlock.id, { 
                              title: { ...(activeBlock.data.title || {}), [activeLang]: e.target.value } 
                            })}
                            placeholder="Titolo"
                          />
                        </div>

                        <div>
                          <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-wider">
                            Sottotitolo ({activeLang.toUpperCase()})
                          </label>
                          <textarea 
                            className="w-full bg-surface-bright border border-outline-variant rounded-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary px-sm py-2 font-body-md text-primary transition-all resize-none min-h-[80px]"
                            value={activeBlock.data?.subtitle?.[activeLang] || ''}
                            onChange={(e) => updateBlockData(activeBlock.id, { 
                              subtitle: { ...(activeBlock.data.subtitle || {}), [activeLang]: e.target.value } 
                            })}
                            placeholder="Sottotitolo"
                          />
                        </div>
                      </div>
                    )}
                    {activeBlock.type !== 'hero' && (
                      <p className="font-body-sm text-on-surface-variant text-sm">Proprietà per {activeBlock.type} da implementare.</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-wider">
                  URL Permanente
                </label>
                <div className="flex items-center">
                  <span className="bg-surface-container border border-r-0 border-outline-variant px-sm py-2 rounded-l-DEFAULT font-body-sm text-on-surface-variant">
                    /p/
                  </span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="nome-progetto"
                    className="flex-1 bg-surface-bright border border-outline-variant rounded-r-DEFAULT focus:ring-1 focus:ring-secondary focus:border-secondary px-sm py-2 font-body-sm text-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex-1">
            {/* Lang Tabs & Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-md pb-sm border-b border-outline-variant gap-4">
              <div className="flex flex-wrap gap-2 bg-surface-container p-xs rounded-DEFAULT">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLang(lang.code)}
                    className={cn(
                      "px-md py-xs rounded font-data-point text-data-point transition-colors",
                      activeLang === lang.code 
                        ? "bg-surface-container-lowest text-primary shadow-sm" 
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleTranslateAI}
                disabled={isTranslating}
                className="flex items-center gap-xs text-secondary hover:text-secondary-fixed bg-secondary/10 hover:bg-secondary/20 px-sm py-xs rounded-DEFAULT font-label-caps text-label-caps uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50"
                title="Traduci questo contenuto in tutte le altre lingue con AI"
              >
                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isTranslating ? "AI in corso..." : "Auto-Traduci Tutto"}
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-md">
              <div className="flex-1 flex flex-col">
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-wider">
                  Descrizione Estesa ({activeLang.toUpperCase()})
                </label>
                <RichTextEditor 
                  className="flex-1 min-h-[300px]"
                  value={content[activeLang].content}
                  onChange={(val) => handleContentChange('content', val)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-7 xl:col-span-8 bg-surface-variant rounded-lg border border-outline-variant relative overflow-hidden shadow-inner hidden lg:block">
          <div className="absolute top-0 inset-x-0 h-10 bg-surface-container-high border-b border-outline-variant flex items-center px-4 gap-2 z-20">
             <div className="w-3 h-3 rounded-full bg-error/50"></div>
             <div className="w-3 h-3 rounded-full bg-tertiary-container/50"></div>
             <div className="w-3 h-3 rounded-full bg-secondary/50"></div>
             <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mx-auto tracking-widest">Live Preview - {activeLang.toUpperCase()}</span>
          </div>
          <div className="absolute inset-0 top-10 overflow-y-auto bg-surface bg-white">
            <div className="scale-[0.8] origin-top">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-[500px] text-on-surface-variant font-body-lg">
                  Aggiungi dei blocchi per visualizzare l&apos;anteprima
                </div>
              ) : (
                blocks.map(block => {
                  if (block.type === 'hero') {
                    return <HeroBlock key={block.id} data={{
                      ...block.data,
                      title: block.data?.title?.[activeLang] || '',
                      subtitle: block.data?.subtitle?.[activeLang] || ''
                    }} />;
                  }
                  return (
                    <div key={block.id} className="p-8 border-2 border-dashed border-outline-variant m-8 text-center text-on-surface-variant rounded-lg bg-surface-container-lowest">
                      Render di <span className="font-bold">{block.type}</span> da implementare
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
