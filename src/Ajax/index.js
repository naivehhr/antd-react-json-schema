import { post, get } from './method'

export const addGrantcard = post('/strategy/v1/component/grantCard/add')
export const delGrantcard = post('/strategy/v1/component/grantCard/delete')
export const getGrantcard = post('/strategy/v1/component/grantCard/get')
export const getGrantcardList = post('/strategy/v1/component/grantCard/listAll')
export const updateGrantcard = post('/strategy/v1/component/grantCard/update')

export const addScorecard = post('/strategy/v1/component/scoreCard/add')
export const delScorecard = post('/strategy/v1/component/scoreCard/delete')
export const getScorecard = post('/strategy/v1/component/scoreCard/get')
export const getScorecardList = post('/strategy/v1/component/scoreCard/listAll')
export const updateScorecard = post('/strategy/v1/component/scoreCard/update')

export const getFlowList = post('/strategy/v1/flow/listAll')
export const addFlow = post('/strategy/v1/flow/add')
export const delFlow = post('/strategy/v1/flow/delete')
export const getFlow = post('/strategy/v1/flow/get')
export const updateFlow = post('/strategy/v1/flow/update')

export const addSubdivision = post('/strategy/v1/subdivision/add')
export const delSubdivision = post('/strategy/v1/subdivision/delete')
export const getSubdivisionList = post('/strategy/v1/subdivision/listAll')
export const getSubdivision = post('/strategy/v1/subdivision/get')
export const updateSubdivision = post('/strategy/v1/subdivision/update')
export const converToRangesFrom2D = post('/strategy/v1/subdivision/converToSegmentsFrom2D')

export const addVariable = post('/strategy/v1/variable/add')
export const getVariableList = post('/strategy/v1/variable/listAll')
export const listForScenario = post('/strategy/v1/variable/listForScenario')

export const getCreditUpdate = get('/core-user/v1/credit/update')
export const getCreditView = get('/core-user/v1/credit/view')
export const getCreditRecommend = get('/core-user/v1/credit/view/recommend')
export const updateCredit = post('/core-user/v1/credit/updatePost')



export const getCreactCustomerSchema = get('/core-user/v1/customer/create')
export const addCustomer = post('/core-user/v1/customer/createPost')
export const getCustomer = get('/core-user/v1/customer/view')
export const getCustomerUpdate = get('/core-user/v1/customer/update')
export const updateCustomer = post('/core-user/v1/customer/updatePost')



export const reviewLoanRequest = get('/core-user/v1/loanRequest/review')
export const reviewQueryLoanRequest = get('/core-user/v1/loanRequest/review/query')
export const queryLoanRequest = post('/core-ugetCreditRecommendser/v1/loanRequest/query')
export const queryTrackLoanRequest = post('/core-user/v1/loanRequest/queryTrack')
export const addReviewLoanRequest = post('/core-user/v1/loanRequest/reviewPost')
export const getLonRequestCoreUser = get('/core-user/v1/loanRequest/view')
export const getLonRequestFundRequestCoreUser = get('/core-user/v1/loanRequest/fundRequest/view')
export const queryTrackLoanRequestUser = post('/user/v1/loanRequest/queryTrack')

export const getFundSchemaCoreUser = get('/core-user/v1/fund/create')
export const addFundCoreUser = post('/core-user/v1/fund/createPost')
export const getFundUpdateCoreUser = get('/core-user/v1/fund/update')
export const getFundCoreUser = get('/core-user/v1/fund/view')
export const updateFundCoreUser = post('/core-user/v1/fund/updatePost')
export const getFundListCoreUser = get('/core-user/v1/fund/query')

export const customSchema = {
    customer: {
        get: get('/core-user/v1/schema/schemaCreatorGet/USER_ADD'),
        save: post('/core-user/v1/schema/schemaSave'),
        preview: post('/core-user/v1/schema/preview'),
    }
}


export const getCreactLoanRequestSchema = get('/user/v1/loanRequest/create')
export const addLoanRequest = post('/user/v1/loanRequest/createPost')
export const addLoanRequestQuerySelectable = post('/user/v1/loanRequest/querySelectable')
export const getLoanRequest = get('/user/v1/loanRequest/view')
export const getLoanRequestUpdate = get('/user/v1/loanRequest/update')
export const updateLoanRequest = post('/user/v1/loanRequest/updatePost')
export const reviewQueryLoanRequestUser = get('/user/v1/loanRequest/review/query')
export const getLonRequestFundRequestUser = get('/user/v1/loanRequest/fundRequest/view')

export const getCreditViewUser = get('/user/v1/credit/view')
export const getCreditRecommendUser = get('/user/v1/credit/view/recommend')




export const getFundSchema = get('/user/v1/fund/create')
export const addFund = post('/user/v1/fund/createPost')
export const getFund = get('/user/v1/fund/view')
export const userFundQuery = post('/user/v1/fund/query')
export const updateFund = post('/user/v1/fund/updatePost')
export const userView = get('/user/v1/customer/view')

export const queryMeta = {
    user: post('/user/v1/loanRequest/queryMeta'),
    loan: post('/core-user/v1/loanRequest/queryMeta'),
    coreUserCustomer: get('/core-user/v1/customer/queryMeta')
}
export const query = {
    user: post('/user/v1/loanRequest/query'),
    loan: post('/core-user/v1/loanRequest/query'),
    coreUserCustomer: post('/core-user/v1/customer/query')
}
export const viewTableHeader = {
    user: get('/user/v1/loanRequest/viewTableHeader'),
    loan: get('/core-user/v1/loanRequest/viewTableHeader'),
    coreUserCustomer: get('/core-user/v1/customer/viewTableHeader')
}
export const setTableHeaderPost = {
    user: post('/user/v1/loanRequest/setTableHeaderPost'),
    loan: post('/core-user/v1/loanRequest/setTableHeaderPost'),
    coreUserCustomer: post('/core-user/v1/customer/setTableHeader')
}

export const sendCodeCoreUser = post('/user/v1/session/sendCode')
export const loginCoreUser = post('/user/v1/session/login')
export const logoutCoreUser = post('/user/v1/session/logout')


export const getCreactCustomerUserSchema = get('/user/v1/customer/create')
export const addCustomerUser = post('/user/v1/customer/createPost')


export const getCoreUserQixinInfo = get('/core-user/v1/thirdparty/view/')


export const fetch = async (url, method, data) => {
    url = url.replace('/scmserver', '');
    let fetchfun = null;
    if (method != null && method.toUpperCase() == 'POST') {
        fetchfun = post(url);
    } else {
        fetchfun = get(url);
    }
    return await fetchfun(data);
}
