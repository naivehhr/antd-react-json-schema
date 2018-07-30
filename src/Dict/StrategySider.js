
export const StrategySider = {
    path: 'strategy',
    defaultOpenKeys: ['variable', "subdivision", "component"],
    list: [
        {
            title: '流程管理',
            key: 'flow',
            list: 0
        },
        {
            title: '变量管理',
            key: 'variable',
            icon: 'team',
            list: [
                {
                    title: '衍生变量',
                    key: 'derived-variable',
                    icon: 0,
                },
                {
                    title: '全局变量',
                    key: 'global-variable',
                    icon: 0,
                },
            ]
        },
        {
            title: '细分管理',
            key: 'subdivision',
            icon: 'team',
            list: [
                {
                    title: '一维细分',
                    key: 'one-dimension-subdivision',
                    icon: 0,
                },
                {
                    title: '二维细分',
                    key: 'two-dimension-subdivision',
                    icon: 0,
                },
                {
                    title: '自定义细分',
                    key: 'custom-dimension-subdivision',
                    icon: 0,
                },
            ]
        },
        {
            title: '组件管理',
            key: 'component',
            icon: 'bars',
            list: [
                {
                    title: '评分卡',
                    key: 'scorecard',
                    icon: 0,
                },
                {
                    title: '授信策略',
                    key: 'grantcard',
                    icon: 0,
                }
            ]
        },
    
    ]
}



