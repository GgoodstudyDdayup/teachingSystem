import React, { useState } from 'react';
import { Button } from 'antd'
import { DeleteTwoTone, EditTwoTone, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const SetMain = (props) => {
    const newData = props.data
    const [inputAppear, setInput] = useState('')
    //通过id来判断出现哪一个input
    const editTlei = (id) => {
        setInput(id)
        props.suerEditInput(id)
    }
    //取消修改的时候返回默认的状态
    const deleteInputDefault = () => {
        setInput('')
    }
    //确认修改的时候触发父组件的方法并且让修改框消失
    const sureEdit = (ques_type_id) => {
        props.sureInputDefault(ques_type_id)
        setInput('')
    }
    const postSort = () => {
        props.tixinSet(0)
    }
    //拖拽过后的钩子
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newItems = reorder(
            newData,
            result.source.index,
            result.destination.index
        );
        props.setItem(newItems)
    }
    return (
        < div >
            <div className="g-testpaper-module-setting">
                <div className="mt-panel">
                    <div className="mt-panel-hd">拖拽进行排序</div>
                    <div className="mt-panel-bd">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <center>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div
                                            //provided.droppableProps应用的相同元素.
                                            {...provided.droppableProps}
                                            // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                                            ref={provided.innerRef}
                                        >
                                            {newData.map((res, index) =>
                                                <Draggable key={res.id} draggableId={res.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {inputAppear === res.id ?
                                                                <div className="module-list" >
                                                                    <div className="module-item">
                                                                        <div className="preview-state">
                                                                            <input className="ivu-input" value={props.editInput} onChange={(e) => props.changeInputDefault(e, res.id)}></input>
                                                                            <div className="btn-ctrl">
                                                                                <CheckCircleTwoTone onClick={() => sureEdit(res.ques_type_id)} />
                                                                                <CloseCircleTwoTone twoToneColor="#f40" onClick={deleteInputDefault} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="module-list" >
                                                                    <div className="module-item">
                                                                        <div className="preview-state">
                                                                            <span>{res.show_type_name}</span>
                                                                            <div className="btn-ctrl">
                                                                                <EditTwoTone onClick={() => editTlei(res.id)} />
                                                                                <DeleteTwoTone twoToneColor="#f40" onClick={() => props.deleteTlei(res.ques_type_id)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </center>
                        </DragDropContext>
                    </div>
                </div>
                <div className="mt-panel-ft">
                    <Button type='primary' onClick={postSort}>确认</Button>
                </div>
            </div>
        </div>
    )
}

export default SetMain

