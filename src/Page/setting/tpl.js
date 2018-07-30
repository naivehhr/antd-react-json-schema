renderSchemaForm = () => {
		const { jsonSchema } = this.state
		if (!jsonSchema) return
		let a = jsonSchema.properties
		const fields = { collapseField: CollapseField };
		const uiSchema = {
			"group1": {
				"ui:field": "collapseField",
			},
			"group2": {
				"ui:field": "collapseField",
			},
		}
		const formData = {
			// "group1": {
			// 	"field2": "1",
			// 	"field1": "2"
			// },
			// "group2": {
			// 	"field22": "2",
			// 	"field11": "3"
			// }
		}
		return (
			<div>
				<Form
					className={"form"}
					schema={jsonSchema}
					uiSchema={uiSchema}
					formData={formData}
					fields={fields}
					noHtml5Validate={true}
				>
					<div className="btn">
						<Button type="primary" onClick={this.submit} >保存并退出</Button>
					</div>
				</Form>
			</div>

		)
	}
