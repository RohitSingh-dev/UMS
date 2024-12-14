import './TreeNode.css';
import PropTypes from "prop-types";

const TreeNode = ({node}) => {

    const dataString = node.data ? String(node.data) : ''; // Ensure data is a string
    const isIgnored = dataString.startsWith('ignored-'); // Check if data starts with "ignored-"
    const ignoredMarks = isIgnored ? dataString.substring(8) : null; // Extract marks if it starts with "ignored-"
    const isAnswered = node.data === 'Not Answered' && (!node.children || node.children.length === 0);
    return (
        <div className="node">
            <div className={`node-content ${isAnswered ? 'not-answered-node' : ''} ${isIgnored ? 'ignored-node' : ''}`}>
                <div className="bold-text">{node.label}</div>
                <div className='dot'>:</div>
                <div>{isIgnored ? `${ignoredMarks} - Ignored` : dataString}</div>
            </div>
            {node.children && node.children.length > 0 && (
                <div className="node-children">
                    {node.children.map(child => (
                        <TreeNode key={child.key} node={child}/>
                    ))}
                </div>
            )}
        </div>
    );
};

TreeNode.propTypes = {
    node: PropTypes.object.isRequired,
}

const MyTree = ({data}) => {
    console.log("My data",data)
    return (
        <div className="tree">
            {data.map(node => (
                <TreeNode key={node.key} node={node}/>
            ))}
        </div>
    );
};
MyTree.propTypes = {
    data: PropTypes.object.isRequired,
}
export default MyTree;
