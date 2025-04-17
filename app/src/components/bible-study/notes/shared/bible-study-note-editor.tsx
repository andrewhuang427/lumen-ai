import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const notesEditorExtensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Add notes here..." }),
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function BibleStudyNoteEditor({ value, onChange }: Props) {
  const editor = useEditor({
    content: parseInitialContent(value),
    extensions: notesEditorExtensions,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON();
      onChange(JSON.stringify(updatedContent));
    },
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} className="p-2 text-sm" />;
}

function parseInitialContent(value: string): JSONContent | string {
  try {
    return JSON.parse(value) as JSONContent;
  } catch {
    return value;
  }
}
