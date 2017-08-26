'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {VelocityTransitionGroup} from 'velocity-react';
import {DragSource, DropTarget} from 'react-dnd';

import Tree from './tree';
import NodeHeader from './header';
import ItemTypes from './ItemTypes';

class TreeNode extends React.Component {
    constructor() {
        super();

        this.onToggle = this.onToggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    onToggle() {
        const {node, onToggle} = this.props;
        const {toggled} = node;

        if (onToggle) {
            onToggle(node, !toggled);
        }
    }

    onSelect() {
        const {node, onSelect} = this.props;

        if (onSelect) {
            onSelect(node);
        }
    }

    animations() {
        const {animations, node} = this.props;

        if (animations === false) {
            return false;
        }

        const anim = Object.assign({}, animations, node.animations);
        return {
            toggle: anim.toggle(this.props),
            drawer: anim.drawer(this.props)
        };
    }

    decorators() {
        // Merge Any Node Based Decorators Into The Pack
        const {decorators, node} = this.props;
        let nodeDecorators = node.decorators || {};

        return Object.assign({}, decorators, nodeDecorators);
    }

    render() {
        const {style, connectDragSource, connectDropTarget, canDrop} = this.props;
        const decorators = this.decorators();
        const animations = this.animations();

        return connectDropTarget(connectDragSource(
            <li ref={ref => this.topLevelRef = ref}
                style={Object.assign({}, style.base, canDrop && style.canDrop)}>
                {this.renderHeader(decorators, animations)}

                {this.renderDrawer(decorators, animations)}
            </li>
        ));
    }

    renderDrawer(decorators, animations) {
        const {node: {toggled}} = this.props;

        if (!animations && !toggled) {
            return null;
        } else if (!animations && toggled) {
            return this.renderChildren(decorators, animations);
        }

        const {animation, duration, ...restAnimationInfo} = animations.drawer;
        return (
            <VelocityTransitionGroup {...restAnimationInfo}
                                     ref={ref => this.velocityRef = ref}>
                {toggled ? this.renderChildren(decorators, animations) : null}
            </VelocityTransitionGroup>
        );
    }

    renderHeader(decorators, animations) {
        const {node, style} = this.props;

        return (
            <NodeHeader animations={animations}
                        decorators={decorators}
                        node={Object.assign({}, node)}
                        onToggle={this.onToggle}
                        onSelect={this.onSelect}
                        style={style}/>
        );
    }

    renderChildren(decorators) {
        const {node, ...props} = this.props;

        if (node.loading) {
            return this.renderLoading(decorators);
        }

        let children = node.children;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }

        return (
            <Tree {...props}
                  event={this._eventBubbles()}
                  treeRef={ref => this.subtreeRef = ref}
                  data={children}/>
        );
    }

    renderLoading(decorators) {
        const {style} = this.props;

        return (
            <ul style={style.subtree}>
                <li>
                    <decorators.Loading style={style.loading}/>
                </li>
            </ul>
        );
    }

    _eventBubbles() {
        const {onSelect} = this.props;

        return {
            onSelect
        };
    }
}

TreeNode.propTypes = {
    style: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    onToggle: PropTypes.func,
    onSelect: PropTypes.func,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    canDrop: PropTypes.bool,
    onDrop: PropTypes.func
};

const source = {
    canDrag(props) {
        return props.node.active;
    },

    beginDrag(props) {
        return {props};
    }

    // endDrag(props, monitor, component) {
    //     // const { decoratedComponentInstance: { props } } = component;
    //     // const { id: droppedId, originalIndex, key } = monitor.getItem();
    //     const didDrop = monitor.didDrop();
    //     const item = monitor.getItem();
    //
    //     console.log('endDrag');
    //     console.log(props);
    //
    //     if (props.endDrag) {
    //         props.endDrag(didDrop, props, item);
    //     }
    // }
};

// Check path.
const startsWith = (_a, _b) => {
    let a = (_a || '') + '/';
    let b = (_b || '') + '/';
    return a.startsWith(b);
};

// Check name.
const findNode = (node, name) => node.children.reduce(
    (found, n) => found || (n.name === name && n), null);

// Check canDrop.
const checkDrop = (a, b) => !startsWith(a.id, b.id) && !findNode(a, b.name);

const target = {
    canDrop(props, monitor) {
        const children = props.node.children !== undefined;
        const isOver = monitor.isOver({shallow: true});
        const {node} = monitor.getItem().props;
        return children && isOver && checkDrop(props.node, node);
    },

    drop(props, monitor) {
        console.log('drop');
        console.log(props);
        const {node} = monitor.getItem().props;
        props.onDrop && props.onDrop(props.node, node);
    }

    // hover(props, monitor) {
    //     // const { tabKey } = monitor.getItem().props;
    //     // if (tabKey !== props.tabKey) {
    //     //   props.hover && props.hover(tabKey, props.tabKey);
    //     // }
    // }
};

TreeNode = DropTarget(ItemTypes.TREE, target, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop()
}))(TreeNode);

TreeNode = DragSource(ItemTypes.TREE, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(TreeNode);

export default TreeNode;
