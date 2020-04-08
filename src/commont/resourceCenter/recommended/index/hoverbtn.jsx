import React from 'react';
const Search = (props) => {
    const leave = () => {
        props.funtL()
    }
    const enter = () => {
        props.funtE()
    }
    return (
        <div>
            {
                props.funtL || props.funtE ?
                    <div className="search_condition hover-container" onMouseLeave={props.funtL ? leave : ''} onMouseEnter={props.funtE ? enter : ''}>
                        <Tixing list={props.list} funt={props.funt}></Tixing>
                    </div> :
                    <div className="search_condition hover-container" >
                        <Tixing list={props.list} funt={props.funt}></Tixing>
                    </div>}
        </div>
    )
}
const Tixing = (props) => {
    const l1 = props.list
    return (
        <div >
            {
                l1.map((ele, index) =>
                    <div key={index}>
                        <div className="title">{ele.name}</div>
                        <ul className="item_wrapper">
                            {ele.list.map((res) =>
                                <li className={ele.h === res.id ? 'item active' : 'item'} key={res.id} onClick={() => props.funt(res.id, index, ele.name, res.title)}>
                                    {res.title}
                                </li>
                            )}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}
export default Search