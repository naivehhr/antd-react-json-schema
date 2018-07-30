import sa from 'superagent'
import { Modal, Button } from 'antd'
import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import ConfigureStore from '../ConfigureStore'
import {updateUserInfo} from 'Action/user'
const store = ConfigureStore()
const goList = [
    200, 
    1000, 
    1500,
    1400,
    1401,
    1402,
    1403,
    1404
]

const urlTrans = url => url
const urlTransGet = url => (params) => {
    let p = params.length ? params : ''
    return url + '/' + p
}

class Dialog {
    static getModal(type, params) {
        if (!this.modal) {
            let onOk = params.onOk
            params.onOk = () => {
                delete this.modal
                if (onOk) return onOk()
            }
            this.modal = Modal[type](params)
        }
    }
    static error(params) {
        this.getModal("error", params)
    }
}

const mid = method => url => async (data = {}) => {
    let result = null
    try {
        // console.log('request url===', url)
        // console.log('request params===', JSON.stringify(data))
        let storeEntity = localStorage.getItem('_USER_ENTITY_');
        if (storeEntity != null) {
            storeEntity = JSON.parse(storeEntity);
            if (data == null) {
                data = {};
            }
            data.userInfo = storeEntity
        }
        result = await method(url)(data)
        result = JSON.parse(result.text)
        // console.log('request result===', result)
    } catch (e) {
        // Dialog.error({
        //     title: '系统错误',
        //     content: '系统错误，请稍后重试',
        // })
        return {code: 110, data: '系统错误，请稍后重试'};
        // throw new Error('')
    }
    switch (result.code) {
        case 200: 
            return result
        case 401:
            return result
        default:
    }
    return result
}

const _get = url => (data = {}) => sa.get(urlTransGet(url)(data))
export const _post = url => (data = {}) => sa.post(urlTrans(url)).send(data)

export const get = mid(_get)
export const post = mid(_post)