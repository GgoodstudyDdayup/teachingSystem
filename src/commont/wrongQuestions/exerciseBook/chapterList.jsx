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
            <div className="listT"  >
                <div className="know-name-m" >
                    <MathJax.Html html={res.ques_options ? res.ques_options : res.ques_content + res.ques_options} />
                    <div>
                        <p className="line-shu">答案</p>
                        <MathJax.Html html={res.ques_answer} />

                    </div>
                    <div>
                        <p className="line-shu">解析</p>
                        <MathJax.Html html={res.ques_analysis} />
                    </div>
                </div>
                <Divider />
                <div className="m-bottom m-Pleft">
                    <Button className="z-index" type='primary' onClick={() => props.drawerModal(res,false)}>修改题目</Button>
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
export default ListT