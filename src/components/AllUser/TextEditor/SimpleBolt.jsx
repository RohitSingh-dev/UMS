import 'katex/dist/katex.min.css';
import Quill from "quill"; // Ensure this CSS is loaded

// Import Embed class from Quill
const Embed = Quill.import('blots/embed');

class SimpleBlot extends Embed {
    static create(value) {
        let node = super.create();
        node.textContent = value;
        return node;
    }

    static value(node) {
        return node.textContent;
    }
}

SimpleBlot.blotName = 'simple';
SimpleBlot.tagName = 'span';

export default SimpleBlot
