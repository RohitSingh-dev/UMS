import {useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MathBlot from "./MathBlot.jsx";
import SimpleBlot from "./SimpleBolt.jsx";
import Quill from "quill";


Quill.register('formats/simple', SimpleBlot);
Quill.register('formats/math', MathBlot);
const TextEditor = () => {
    // Ensure MathBlot is registered with Quill


    const [editorHtml, setEditorHtml] = useState('');
    const [latexInput, setLatexInput] = useState('');
    const quillRef = useRef();

    const handleLatexInsert = () => {
        const quill = quillRef.current.getEditor();
        console.log('Quill instance:', quill);
        console.log('MathBlot registered:', Quill.import('formats/math'));
        console.log('SimpleBlot registered:', Quill.import('formats/simple'));
        quill.focus();

        const range = quill.getSelection();
        if (range) {
            const {index} = range;
            console.log("Index", index)
            const latex = latexInput.trim();

            if (latex) {
                // Clear input field
                try {
                    // quill.insertEmbed(index, 'math', latex);
                    quill.insertEmbed(index, 'simple', latex);
                    console.log('No error:');
                    quill.setSelection(index + 1); // Move cursor after the inserted embed
                    setLatexInput('');
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.warn('LaTeX input is empty.');
            }
        } else {
            console.warn('No selection found.');
        }
    };


    const handleSave = () => {
        const quill = quillRef.current.getEditor();
        const html = quill.root.innerHTML;
        console.log('Editor HTML:', html);
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block', 'image', 'link'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            ['math', 'simple']
        ],
    };

    return (
        <div>
            <ReactQuill
                ref={quillRef}
                value={editorHtml}
                onChange={setEditorHtml}
                modules={modules}
            />
            <button onClick={() => document.getElementById('latex-modal').style.display = 'block'}>
                Insert LaTeX
            </button>
            <button onClick={handleSave}>
                Save Content
            </button>
            <div id="latex-modal" style={{display: 'none'}}>
                <input
                    type="text"
                    value={latexInput}
                    onChange={(e) => setLatexInput(e.target.value)}
                    placeholder="Enter LaTeX expression"
                />
                <button onClick={handleLatexInsert}>OK</button>
                <button onClick={() => document.getElementById('latex-modal').style.display = 'none'}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TextEditor;
