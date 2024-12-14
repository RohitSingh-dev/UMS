import Quill from 'quill';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Ensure this CSS is loaded

// Import Embed class from Quill
const Embed = Quill.import('blots/embed');

class MathBlot extends Embed {
    static create(value) {
        let node = super.create();
        node.setAttribute('data-latex', value);
        return node;
    }

    static value(node) {
        return node.getAttribute('data-latex');
    }

    constructor(node) {
        super(node);
        this.render();
    }

    render() {
        const latex = this.domNode.getAttribute('data-latex');
        try {
            const html = katex.renderToString(latex, { displayMode: true });
            this.domNode.innerHTML = html;
        } catch (e) {
            console.error('Error rendering LaTeX:', e);
            this.domNode.innerHTML = 'Error rendering LaTeX';
        }
    }
}

MathBlot.blotName = 'math';
MathBlot.tagName = 'span';

// Register the blot with Quill
Quill.register(MathBlot);

export default MathBlot;
