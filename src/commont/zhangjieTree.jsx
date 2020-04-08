import React from 'react';
import { Tree, Icon } from 'antd';
const { TreeNode } = Tree;
const TreeMain = (props) => {
    return (
        <div>
            <TreeList tree={props.data} know_lagechangeList={props.know_lagechangeList} ques_knowledge_idList={props.ques_knowledge_idList} funt={props.funt} know_lageId={props.know_lageId} know_lageName={props.know_lageName}></TreeList>
        </div>
    )
}

const TreeList = (props) => {
    const onCheck = (checkedKeys, info) => {
        // console.log('onCheck', checkedKeys, info);
        props.know_lagechangeList(checkedKeys)
    };
    const l1 = props.tree.map((res) =>
        <TreeNode icon={<Icon type="carry-out" />} title={res.title} key={res.aitifen_id} checkable={false}>
            {res.children ? res.children.map((item) =>
                <TreeNode icon={<Icon type="carry-out" />} title={item.title} key={item.aitifen_id} checkable={item.children ? false : true}>
                    {item.children ? item.children.map((item2) =>
                        <TreeNode icon={<Icon type="carry-out" />} title={item2.title} key={item2.aitifen_id} checkable={item2.children ? false : true}>
                            {item2.children ? item2.children.map((item3) =>
                                <TreeNode icon={<Icon type="carry-out" />} title={item3.title} key={item3.aitifen_id} >
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
            checkable
            onCheck={onCheck}
            autoExpandParent={true}
            checkedKeys={props.ques_knowledge_idList.length > 0 ? props.ques_knowledge_idList : []}
            defaultExpandedKeys={props.ques_knowledge_idList.length > 0 ? props.ques_knowledge_idList : []}
        >
            {l1}
        </Tree>
    )
}
export default TreeMain