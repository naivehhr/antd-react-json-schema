

let columns = [
	{
		"title": "用款订单ID",
		"dataIndex": "id"
	},
	{
		"title": "活动ID",
		"dataIndex": "activity_id"
	},
	{
		"title": "融资金额",
		"dataIndex": "loan_amount",
		"format": "amount"
	},
	{
		"title": "融资天数",
		"dataIndex": "financing_days"
	},
	{
		"title": "融资利率",
		"dataIndex": "rate"
	},
	{
		"title": "状态",
		"dataIndex": "status"
	},
	{
		"title": "操作",
		"fixed": "right",
		"width": "80",
		"key": "action"
	}
]

let data = [
	{
		"id": "2018021348460578",
		"activity_id": "jc2018021303",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "还款中"
	},
	{
		"id": "2018021313797705",
		"activity_id": "jc2018021303",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "还款中"
	},
	{
		"id": "2018021305149460",
		"activity_id": "jc2018021303",
		"loan_amount": 500000,
		"financing_days": 30,
		"rate": null,
		"status": "还款中"
	},
	{
		"id": "2018021377165124",
		"activity_id": "jc2018021302",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "申请成功"
	},
	{
		"id": "2018021313797785",
		"activity_id": "jc2018021302",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "申请成功"
	},
	{
		"id": "2018021348460558",
		"activity_id": "jc2018021302",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "申请成功"
	},
	{
		"id": "2018021351494867",
		"activity_id": "jc2018021302",
		"loan_amount": 50000,
		"financing_days": 30,
		"rate": null,
		"status": "申请成功"
	}
]
columns.forEach((item, index) => {
	if (item.format) {
		switch (item.format) {
			case 'amount':
				data.forEach((i, k) => {
						console.log('i', i)
						console.log('item.formati',item.format)
						// data[k][item.dataIndex] = _format.formatValue(item.format, i)
						data[k][item.dataIndex] = '5,000'

				})
				break;
			default:

		}

	}
})

console.log(data)
