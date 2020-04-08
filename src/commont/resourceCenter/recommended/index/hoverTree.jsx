import React from 'react';
import {  Tree, Icon } from 'antd';
const { TreeNode } = Tree;
const TreeMain = () => {
    return (
        <div>
            <TreeList></TreeList>
        </div>
    )
}

const TreeList = (props) => {
    return (
        <Tree
            showLine={true}
            defaultExpandedKeys={['7', '1', '5']}
            onSelect={(value, res) => { console.log(value, res) }}
        >
            <TreeNode icon={<Icon type="carry-out" />} title="数与代数" key="0" selectable={false}>
                <TreeNode icon={<Icon type="carry-out" />} title="整数计算与应用" selectable={false} key="1">
                    <TreeNode icon={<Icon type="carry-out" />} title="有理数计算" key="2" />
                    <TreeNode icon={<Icon type="carry-out" />} title="代数计算" key="3" />
                    <TreeNode icon={<Icon type="carry-out" />} title="函数计算" key="4" />
                </TreeNode>
                <TreeNode icon={<Icon type="carry-out" />} title="图形与几何" selectable={false} key="5">
                    <TreeNode icon={<Icon type="carry-out" />} title="测量" key="6" />
                </TreeNode>
                <TreeNode icon={<Icon type="carry-out" />} title="综合与实践" selectable={false} key="7">
                    <TreeNode icon={<Icon type="carry-out" />} title="实践与日期" key="8" />
                    <TreeNode icon={<Icon type="carry-out" />} title="综合应用" key="9" />
                </TreeNode>
            </TreeNode>
        </Tree>
    )
}
export default TreeMain