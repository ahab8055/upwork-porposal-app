"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type EditorCommand =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock";

interface ProposalRichTextEditorProps {
  defaultHtml: string;
  onChange: (html: string) => void;
  onDirty?: () => void;
  placeholder?: string;
  className?: string;
  editorTestId?: string;
}

export function ProposalRichTextEditor({
  defaultHtml,
  onChange,
  onDirty,
  placeholder = "Edit your proposal...",
  className,
  editorTestId = "proposal-rich-text-editor",
}: ProposalRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = defaultHtml;
    hasMounted.current = true;
  }, [defaultHtml]);

  const emitChange = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !hasMounted.current) return;
    onChange(editor.innerHTML);
    onDirty?.();
  }, [onChange, onDirty]);

  const runCommand = (command: EditorCommand, valueArg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    emitChange();
  };

  return (
    <div className={cn("rounded-lg border border-slate-200 overflow-hidden", className)}>
      <div
        className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2"
        data-testid="proposal-editor-toolbar"
      >
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Bold"
          onPressedChange={() => runCommand("bold")}
        >
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Italic"
          onPressedChange={() => runCommand("italic")}
        >
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Underline"
          onPressedChange={() => runCommand("underline")}
        >
          <Underline className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Heading"
          onPressedChange={() => runCommand("formatBlock", "h2")}
        >
          <Heading2 className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Bullet list"
          onPressedChange={() => runCommand("insertUnorderedList")}
        >
          <List className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          variant="outline"
          aria-label="Numbered list"
          onPressedChange={() => runCommand("insertOrderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </Toggle>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        data-testid={editorTestId}
        className="min-h-[320px] max-h-[60vh] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-slate-800 focus:outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
        onInput={emitChange}
        onBlur={emitChange}
      />
    </div>
  );
}
