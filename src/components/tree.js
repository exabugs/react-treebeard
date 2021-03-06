'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import TreeNode from './node';

class Tree extends React.Component {
    render() {
        const {animations, decorators, data, onToggle, onSelect, style, event, treeRef, onDrop} = this.props;
        const {tree} = style;

        return (
            <ul style={tree ? tree.base : style.subtree}
                ref={treeRef}>
                {data.map((node, index) =>
                    <TreeNode {...event}
                              animations={animations}
                              decorators={decorators}
                              key={node.id || index}
                              node={node}
                              onToggle={onToggle}
                              onSelect={onSelect}
                              onDrop={onDrop}
                              style={tree ? tree.node : style}/>
                )}
            </ul>
        );
    }
}

Tree.propTypes = {
    style: PropTypes.object.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    onToggle: PropTypes.func,
    onSelect: PropTypes.func,
    event: PropTypes.object,
    treeRef: PropTypes.func.isRequired,
    onDrop: PropTypes.func
};

export default Tree;
