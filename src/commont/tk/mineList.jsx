import React from 'react';
import { Divider, Button } from 'antd';
// import MathJax from 'simple-react-mathjax'
import MathJax from 'react-mathjax3'
const ListT = (props) => {
    const total = props.data.map((res, index) =>
        <MathJax.Context
            key={index}
            input='tex'
            onError={(MathJax, error) => {
                console.warn(error);
                console.log("Encountered a MathJax error, re-attempting a typeset!");
                MathJax.Hub.Queue(
                    MathJax.Hub.Typeset()
                );
            }}
            script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"
            options={{
                messageStyle: 'none',
                extensions: ['tex2jax.js'],
                jax: ['input/TeX', 'output/HTML-CSS'],
                tex2jax: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']],
                    processEscapes: true,
                },
                TeX: {
                    extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
                }
            }}>
            <div className="listT" onClick={() => { props.fun(res.ques_id) }} >
                <div className="know-name-m" >
                    {/* <span className="know-name">{ res.paper_name}</span> */}
                    <MathJax.Html html={res.ques_content + res.ques_options} />
                </div>
                <Divider dashed />
                <Knowlage moveOrAdd={props.moveOrAdd} ques_subject_name={res.ques_subject_name} ques_subject_id = {res.ques_subject_id} edit={props.edit} del_question={props.del_question} id={res.ques_id} ques_number={res.ques_number} ques_difficulty_text={res.ques_difficulty_text} index={index} ques_knowledge_name={res.ques_knowledge_name} btn={props.addQuestoin} btn2={props.deleteQuestoin}></Knowlage>
                <div className={props.appear === res.ques_id ? '' : 'question-active'} >
                    <Divider dashed />
                    <div>
                        <p className="line-shu">答案</p>
                        <MathJax.Html html={res.ques_answer} />

                    </div>
                    <div>
                        <p className="line-shu">解析</p>
                        <MathJax.Html html={res.ques_analysis} />
                    </div>
                </div>
            </div>
        </MathJax.Context>
    )
    return (
        <div>
            {total ? total : ''}
        </div>
    )
}
const Knowlage = (props) => {
    return (
        <div className="shop-btn">
            <div className="know-title-div" style={{ width: '50%' }}>
                <p className="know-title">
                    知识点:
                <span>{props.ques_knowledge_name}</span>
                </p>
                <p className="know-title">
                    难度:
                <span>{props.ques_difficulty_text}</span>
                </p>
                <p className="know-title">
                    组卷:
                <span>{props.ques_number}次</span>
                </p>
            </div>
            <div className="m-flex" style={{ width: '50%', justifyContent: 'flex-end' }} >
                <Button size='small' className="z-index" type='danger' onClick={(e) => props.del_question(e, props.id)}>删除</Button>
                <div className="m-left">
                    <Button size='small' className="z-index" type='primary' onClick={(e) => props.edit(e, props.id,[props.ques_subject_name,props.ques_subject_id])}>修改</Button>
                </div>
                <div className="m-left">
                    <Button size='small' className="z-index" type={props.moveOrAdd(props.id) ? 'danger' : 'primary'} onClick={props.moveOrAdd(props.id) ? (e) => props.btn2(e, props.id) : (e) => props.btn(e, props.id)}>{props.moveOrAdd(props.id) ? '移除试题篮' : '加入试题篮'}</Button>
                </div>
            </div>
        </div>
    )
}
export default ListT