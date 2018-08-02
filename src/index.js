import 'babel-polyfill'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import Test from './Page/Test'
import TaskHome from './Pages/Dissociative/TaskHome'
import ConfigureStore from './ConfigureStore'
let store = ConfigureStore()
ReactDOM.render(
    <Provider store={store}>
    <Test />
  </Provider>, document.querySelector('div#app')
)
