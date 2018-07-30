onSubmit = (e, callback) => {
  console.log("submit", e);
  let formError = {
  	'jibenitem': {
  		'maximum': {
  			'__errors': [
  				{
  					'maximum': [
  						'已经注册过了',
  						'123123'
  					]
  				}
  			]
  		},
  		'licence_code': {
  			'__errors': [
  				{ 'licence_code': '不合适啊' }
  			]
  		}
  	}
  }
  let data = { formError }
  callback(data)
};