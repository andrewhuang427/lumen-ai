"use client";

import { type Editor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Redo,
  Strikethrough,
  TextQuote,
  Undo,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { usePostEditor } from "./hooks/use-post-editor";

export default function PostEditorToolbar() {
  const editor = usePostEditor();

  if (editor == null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-6 pt-0">
      <ToggleGroup>
        <Toggle
          onToggle={() => editor.chain().focus().undo().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("undo")}
          Icon={Undo}
        />
        <Toggle
          onToggle={() => editor.chain().focus().redo().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("redo")}
          Icon={Redo}
        />
      </ToggleGroup>
      <Separator orientation="vertical" className="h-[20px]" />
      <ToggleGroup>
        <Toggle
          onToggle={() => editor.chain().focus().toggleBold().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("bold")}
          Icon={Bold}
        />
        <Toggle
          onToggle={() => editor.chain().focus().toggleItalic().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("italic")}
          Icon={Italic}
        />
        <Toggle
          onToggle={() => editor.chain().focus().toggleStrike().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("strike")}
          Icon={Strikethrough}
        />
      </ToggleGroup>
      <Separator orientation="vertical" className="h-[20px]" />
      <ToggleGroup>
        <Toggle
          onToggle={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          getIsActive={(updatedEditor) =>
            updatedEditor.isActive("heading", { level: 1 })
          }
          Icon={Heading1}
        />
        <Toggle
          onToggle={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          getIsActive={(updatedEditor) =>
            updatedEditor.isActive("heading", { level: 2 })
          }
          Icon={Heading2}
        />
      </ToggleGroup>
      <Separator orientation="vertical" className="h-[20px]" />
      <ToggleGroup>
        <Toggle
          onToggle={() => editor.chain().focus().toggleBulletList().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("bulletList")}
          Icon={List}
        />
        <Toggle
          onToggle={() => editor.chain().focus().toggleOrderedList().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("orderedList")}
          Icon={ListOrdered}
        />
      </ToggleGroup>
      <Separator orientation="vertical" className="h-[20px]" />
      <ToggleGroup>
        <Toggle
          onToggle={() => editor.chain().focus().toggleBlockquote().run()}
          getIsActive={(updatedEditor) => updatedEditor.isActive("blockquote")}
          Icon={TextQuote}
        />
      </ToggleGroup>
    </div>
  );
}

function ToggleGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

type FormatToggleProps = {
  onToggle: () => void;
  getIsActive: (editor: Editor) => boolean;
  Icon: LucideIcon;
};

function Toggle({ onToggle, getIsActive, Icon }: FormatToggleProps) {
  const editor = usePostEditor();
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isActive: editor != null && getIsActive(editor),
    }),
  });

  return (
    <Button
      size="icon"
      variant={editorState?.isActive ? "secondary" : "ghost"}
      onClick={onToggle}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
