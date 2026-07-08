"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useCallback } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Link2, Image as ImageIcon, List, ListOrdered, Quote,
  Code, Minus, AlignLeft, AlignCenter, AlignRight,
  Heading2, Heading3, Undo, Redo, Code2
} from 'lucide-react'

interface Props {
  content?: string
  contentJson?: Record<string, unknown>
  onChange: (html: string, json: Record<string, unknown>) => void
  placeholder?: string
}

export default function RichEditor({ content, contentJson, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ HTMLAttributes: { class: 'editor-img' } }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing your post…' }),
      CharacterCount,
    ],
    content: contentJson || content || '',
    editorProps: { attributes: { class: 'tiptap-editor' } },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON() as Record<string, unknown>)
    },
  })

  useEffect(() => {
    if (editor && contentJson && Object.keys(contentJson).length > 0) {
      editor.commands.setContent(contentJson)
    }
  }, [])

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL:')
    if (!url) return
    if (url === '') { editor?.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL (or use Media Library):')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const ToolBtn = ({ onClick, active, title, children }: { onClick: ()=>void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button type="button" onClick={onClick} title={title}
      style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'none', cursor:'pointer', background:active?'rgba(139,105,20,0.15)':'transparent', color:active?'#8B6914':'#475569', transition:'all 0.1s' }}>
      {children}
    </button>
  )

  const Divider = () => <div style={{ width:1, height:22, background:'#e2e8f0', margin:'0 4px' }}/>

  const words = editor.storage.characterCount?.words() || 0
  const chars = editor.storage.characterCount?.characters() || 0

  return (
    <div style={{ border:'1px solid #e2e8f0', borderRadius:10, overflow:'hidden', background:'#fff' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:2, padding:'8px 10px', borderBottom:'1px solid #f1f5f9', background:'#fafafa' }}>
        <ToolBtn onClick={()=>editor.chain().focus().undo().run()} title="Undo"><Undo size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().redo().run()} title="Redo"><Redo size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()} active={editor.isActive('heading',{level:2})} title="Heading 2"><Heading2 size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleHeading({level:3}).run()} active={editor.isActive('heading',{level:3})} title="Heading 3"><Heading3 size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={()=>editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={()=>editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({textAlign:'left'})} title="Align left"><AlignLeft size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({textAlign:'center'})} title="Align center"><AlignCenter size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({textAlign:'right'})} title="Align right"><AlignRight size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={()=>editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={()=>editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><Code2 size={14}/></ToolBtn>
        <ToolBtn onClick={()=>editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14}/></ToolBtn>
        <Divider/>
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Add link"><Link2 size={14}/></ToolBtn>
        <ToolBtn onClick={addImage} title="Add image"><ImageIcon size={14}/></ToolBtn>
      </div>

      {/* Editor */}
      <div style={{ padding:'20px 24px', minHeight:400 }}>
        <EditorContent editor={editor}/>
      </div>

      {/* Word count */}
      <div style={{ padding:'8px 16px', borderTop:'1px solid #f1f5f9', display:'flex', gap:16, fontSize:11.5, color:'#94a3b8' }}>
        <span>{words} words</span>
        <span>{chars} characters</span>
        <span>~{Math.max(1, Math.ceil(words/200))} min read</span>
      </div>
    </div>
  )
}
