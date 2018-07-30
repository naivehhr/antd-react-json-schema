import React, { Component } from 'react';
import { connect } from 'react-redux';

const styles = {
    change_entity_container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    change_entity_inner: {
        border: '1px solid #e8e8e8',
        width: '100%',
        marginBottom: '20px'
    },
    group_title: {
        boxSizing: 'border-box',
        padding: '10px 20px',
        backgroundColor: '#f6f8fa',
        fontSize: '17px'
    },
    group_inner: {
        display: 'flex',
        boxSizing: 'border-box',
        padding: '15px 20px',
    },
    single_button: {
        fontSize: '14px',
        marginRight: '40px',
        cursor: 'pointer',
        color: '#0af'
    }
}

class ChangeEntity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _list: props.user
        }
    }

    changeEntity(entity) {
        this.props.changeEntity(entity);
    }

    render() {
        const _list = this.state._list.accessList;
        let _resultObj = {};
        _list.map((_v, index) => {
            if (_resultObj[_v.userGroupName]) {
                _resultObj[_v.userGroupName].push(_v);
            } else {
                _resultObj[_v.userGroupName] = [];
                _resultObj[_v.userGroupName].push(_v);
            }
        })
        return (
            <div>
                <div
                    className="title-level"
                    style={{
                        fontSize: '18px',
                        // fontWeight: 'bold',
                        lineHeight: '27px',
                        marginBottom: '10px'
                    }}
                >
                    切换用户
                </div>
                <div
                    className="change-entity-container"
                    style={styles.change_entity_container}
                >
                    {
                        Object.keys(_resultObj).map((_v, index) => {
                            return (
                                <div
                                    className="change-entity-inner"
                                    style={styles.change_entity_inner}
                                >
                                    <div
                                        className="group-title"
                                        style={styles.group_title}
                                    >
                                        {_v}
                                    </div>
                                    <div
                                        className="group-inner"
                                        style={styles.group_inner}
                                    >
                                        {
                                            _resultObj[_v].map((_single, index) => {
                                                return (
                                                    <div
                                                        className="single-button"
                                                        style={styles.single_button}
                                                        onClick={this.changeEntity.bind(this, _single)}
                                                    >
                                                        {
                                                            _single.roleName
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeEntity: (entity) => {
            dispatch({ type: 'CHANGE_ENTITY', entity: entity})
        }
    }
}
ChangeEntity = connect(mapStateToProps, mapDispatchToProps)(ChangeEntity)
export default ChangeEntity;