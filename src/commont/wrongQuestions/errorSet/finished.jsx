import React from 'react'
import { List, Avatar } from 'antd';
import Zmage from 'react-zmage'
const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

const Finished = () => {
    return (
        <div>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={listData}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                    >
                        <div className='m-flex' style={{flexFlow:'no-wrap'}}>
                            <div>
                                <Zmage
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            </div>
                            <div className='m-left'>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href={item.href}>{item.title}</a>}
                                    description={item.description}
                                />
                                {item.content}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}
export default Finished