'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[150px] p-md text-on-surface text-hyphenated prose-headings:font-h3 prose-headings:text-h3 prose-headings:text-primary prose-p:font-body-md prose-p:text-body-md prose-p:mb-sm prose-ul:list-disc prose-ul:pl-md prose-ul:mb-sm prose-ol:list-decimal prose-ol:pl-md prose-ol:mb-sm',
      },
    },
  });

  // Keep content in sync if value prop changes from outside (e.g., translation)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border border-outline-variant rounded-DEFAULT bg-surface-bright flex flex-col", className)}>
      <div className="flex flex-wrap gap-xs border-b border-outline-variant p-xs bg-surface-container-lowest rounded-t-DEFAULT">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn("p-1 rounded hover:bg-surface-container transition-colors text-on-surface", {
            'bg-surface-container-high text-primary': editor.isActive('bold'),
          })}
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn("p-1 rounded hover:bg-surface-container transition-colors text-on-surface", {
            'bg-surface-container-high text-primary': editor.isActive('italic'),
          })}
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("p-1 rounded hover:bg-surface-container transition-colors text-on-surface", {
            'bg-surface-container-high text-primary': editor.isActive('heading', { level: 2 }),
          })}
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-1 rounded hover:bg-surface-container transition-colors text-on-surface", {
            'bg-surface-container-high text-primary': editor.isActive('bulletList'),
          })}
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-1 rounded hover:bg-surface-container transition-colors text-on-surface", {
            'bg-surface-container-high text-primary': editor.isActive('orderedList'),
          })}
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="flex-grow overflow-y-auto" />
    </div>
  );
}
