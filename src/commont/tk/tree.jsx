import React from 'react';
import {  Tree, Icon } from 'antd';
// Input,
// const { Search } = Input;
const { TreeNode } = Tree;
const TreeMain = (props) => {
    return (
        <div>
            {/* <Search
                placeholder="搜索知识点"
                onSearch={value => props.search(value)}
                style={{ width: 200 }}
                value={props.knowLageValue}
                onChange={props.knowLageValueChange}
            /> */}
            <TreeList tree={props.data} funt={props.funt}></TreeList>
        </div>
    )
}
const TreeList = (props) => {
    const l1 = props.tree.map((res) =>
        <TreeNode icon={<Icon type="carry-out" />} title={res.title} key={res.aitifen_id} >
            {res.children ? res.children.map((item) =>
                <TreeNode icon={<Icon type="carry-out" />} title={item.title}  key={item.aitifen_id}>
                    {item.children ? item.children.map((item2) =>
                        <TreeNode icon={<Icon type="carry-out" />} title={item2.title}  key={item2.aitifen_id}>
                            {item2.children ? item2.children.map((item3) =>
                                <TreeNode icon={<Icon type="carry-out" />} title={item3.title} key={item3.aitifen_id}>
                                </TreeNode>
                            ) : ''}
                        </TreeNode>
                    ) : ''}
                </TreeNode>
            ) : ''}

        </TreeNode>
    )
    return (
        <Tree
            showLine={true}
            onSelect={(value) => props.funt(value)}
            autoExpandParent={false}
        >
            {l1}
        </Tree>
    )
}
export default TreeMain