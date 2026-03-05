import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
// import Image from '@tiptap/extension-image' // Install if needed: npm install @tiptap/extension-image
// import Link from '@tiptap/extension-link'   // Install if needed: npm install @tiptap/extension-link
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, Loader2 } from 'lucide-react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { cn } from '@/lib/tiptap-utils'
import { useEffect } from 'react'

interface SimpleEditorProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-muted/20">
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                data-active-state={editor.isActive('bold') ? 'on' : 'off'}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                data-active-state={editor.isActive('italic') ? 'on' : 'off'}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                data-active-state={editor.isActive('strike') ? 'on' : 'off'}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                data-active-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                data-active-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                data-active-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-active-state={editor.isActive('bulletList') ? 'on' : 'off'}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-active-state={editor.isActive('orderedList') ? 'on' : 'off'}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function SimpleEditor({ value, onChange, disabled, placeholder }: SimpleEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[150px] p-4',
            },
        },
    })

    // Sync value if changed externally
    useEffect(() => {
        if (!editor) {
            return
        }

        // specific check for reset or initial load
        if (value === '' && editor.getText() !== '') {
            editor.commands.setContent('')
            return
        }

        // Only update content if it's truly different to avoid cursor jumps
        if (editor.getHTML() === value) {
            return
        }

        // For now, we only sync if editor is empty (initial load) or value is empty
        if (editor.isEmpty && value) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) {
        return (
            <div className="border rounded-md min-h-[150px] flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    return (
        <div className={cn("border border-gray-300 rounded-md overflow-hidden bg-background", disabled && "opacity-50 cursor-not-allowed")}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}