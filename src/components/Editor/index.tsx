import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

type MyEditorProps = {
    content: string;
    onChange: (newContent: string) => void;
};

const MyEditor = ({ content, onChange }: MyEditorProps) => {
    const [editor, setEditor] = useState<IDomEditor | null>(null);
    const [html, setHtml] = useState(content);

    const toolbarConfig: Partial<IToolbarConfig> = {};
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
    };

    // useEffect(() => {
    //     return () => {
    //         if (editor) {
    //             editor.destroy();
    //             setEditor(null);
    //         }
    //     };
    // }, [editor]);

    useEffect(() => {
        if (editor) {
            editor.setHtml(content);
            setHtml(content);
        }
        console.log('content:', content);
    }, [content, editor]);

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => {
                        const newHtml = editor.getHtml();
                        setHtml(newHtml);
                        onChange(newHtml);
                    }}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
            <div style={{ marginTop: '15px' }}>
                {html}
            </div>
        </>
    );
};

export default MyEditor;
