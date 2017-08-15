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

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const {node, onToggle} = this.props;
        const {toggled} = node;

        if (onToggle) {
            onToggle(node, !toggled);
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
        const {style, connectDragSource, connectDropTarget} = this.props;
        const decorators = this.decorators();
        const animations = this.animations();

        return connectDropTarget(connectDragSource(
            <li ref={ref => this.topLevelRef = ref}
                style={style.base}>
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
                        onClick={this.onClick}
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
        const {onToggle} = this.props;

        return {
            onToggle
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
    onToggle: PropTypes.func
};

const source = {
    beginDrag(_props, monitor, component) {
        const { decoratedComponentInstance: { props } } = component;
        console.log(`beginDrag id:${props.id} key:${props.key}`);
        return {
            props,
            // id: props.id,
            // // originalIndex: props.findTab(props.id).index,
            // key: props.tabKey,
            // originalIndex: props.tabIndex,
        };
    },

    endDrag(props, monitor, component) {
        // const { decoratedComponentInstance: { props } } = component;
        // const { id: droppedId, originalIndex, key } = monitor.getItem();
        const didDrop = monitor.didDrop();
        const item = monitor.getItem();

        // console.log('endDrag');

        if (props.endDrag) {
            props.endDrag(didDrop, props, item);
        }
    }
};

const target = {
    canDrop() {
        console.log('canDrop');
        return false;
    },

    drop(props, monitor) {
        // const { tabKey } = monitor.getItem().props;
        // props.drop && props.drop(props.tabsKey, tabKey);
    },

    hover(props, monitor) {
        // const { tabKey } = monitor.getItem().props;
        // if (tabKey !== props.tabKey) {
        //   props.hover && props.hover(tabKey, props.tabKey);
        // }
    }
};

TreeNode = DropTarget(ItemTypes.TREE, target, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(TreeNode);

TreeNode = DragSource(ItemTypes.TREE, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(TreeNode);

export default TreeNode;
