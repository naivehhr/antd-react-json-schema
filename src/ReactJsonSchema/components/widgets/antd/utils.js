import _ from 'lodash';
import {
	message
} from 'antd'
/**
 * 
 * @param {*} errors 
 */
export const getErrorMsg = (errors) => {
	return id => {
		if (!errors) return
		if (!id) return errors
		let newMap = errors.reduce((pre, cur) => {
			return { ...pre, ...cur }
		}, {})
		let key = id.split('.').pop()
		return newMap[key]
	}
}

/**
 * 通过schema得到检验条件
 * @param {*} data 
 * @param {*} schema 
 */
export const valArrLength = (data, schema) => {
	if (!data) {
		console.error('校验Arr数据错误')
		return false
	}
	let l = data.length
	const { minLength, maxLength } = schema
	if (minLength && maxLength) {
		return _.inRange(data.length, minLength, maxLength + 1);
	} else if (minLength) {
		return l >= minLength
	} else {
		return l <= maxLength
	}
}

/**
 * 获取光标位置
 * @param {*} domObj 
 */
export const getCursortPosition = (domObj) => {//获取光标位置函数
	let caretPos = 0;    // IE Support
	if (document.selection) {
		domObj.focus();
		let sel = document.selection.createRange();
		sel.moveStart('character', -domObj.value.length);
		caretPos = sel.text.length;
	}
	// Firefox support
	else if (domObj.selectionStart || domObj.selectionStart == '0')
		caretPos = domObj.selectionStart;
	return (caretPos);
}

/**
 * 设置光标位置
 * @param {*} domObj 
 * @param {*} pos 
 */
export const setCaretPosition = (domObj, pos) => {//设置光标位置函数
	if (domObj.setSelectionRange) {
		domObj.focus();
		domObj.setSelectionRange(pos, pos);
	}
	else if (domObj.createTextRange) {
		let range = domObj.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}