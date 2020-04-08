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
        new Promise((resolve, reject) => {
            const result = checkedKeys.reduce((item, res, index) => {
                item.push({
                    ques_knowledge_id: res,
                    ques_knowledge_first_id: "",
                    ques_knowledge_second_id: "",
                    ques_knowledge_three_id: ""
                })
                return item
            }, [])
            resolve(result)
        }).then(res => {
            const result = res
            const resultKnowLage = []
            result.forEach((l1, index) => {
                props.tree.forEach((res2) => {
                    if (res2.children !== null) {
                        res2.children.forEach((res3) => {
                            if (res3.children !== null) {
                                res3.children.forEach((res4) => {
                                    if (res4.children !== null && res4.children !== undefined) {
                                        res4.children.forEach(res5 => {
                                            if (res5.aitifen_id === result[index].ques_knowledge_id) {
                                                resultKnowLage.push(res5.title)
                                                result[index].ques_knowledge_three_id = res4.aitifen_id
                                                result[index].ques_knowledge_second_id = res3.aitifen_id
                                                result[index].ques_knowledge_first_id = res2.aitifen_id
                                            }
                                        })
                                    }
                                })
                            } else {
                                if (res3.aitifen_id === result[index].ques_knowledge_id) {
                                    resultKnowLage.push(res3.title)
                                    result[index].ques_knowledge_first_id = res2.aitifen_id
                                }
                            }
                        })
                    }
                })
            })
            const obj = {
                resultKnowLage,
                result
            }
            return obj
        }).then(res => {
            props.know_lageId(res.result)
            props.know_lageName(res.resultKnowLage)
            props.know_lagechangeList(checkedKeys)
        })
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
            autoExpandParent={false}
            checkedKeys={props.ques_knowledge_idList.length > 0 ? props.ques_knowledge_idList : []}
            defaultExpandedKeys={props.ques_knowledge_idList.length > 0 ? props.ques_knowledge_idList : []}
        >
            {l1}
        </Tree>
    )
}
export default TreeMain