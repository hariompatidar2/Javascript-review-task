// const BASE_URL = "http://localhost:4000"
const BASE_URL = process.env.NODE_ENV === 'production' ? `https://rapid-page-builder.onrender.com` : "http://localhost:4000"

export const userEndPoints={
    LOGIN_API: `${BASE_URL}/api/v1/login`,
    SIGNUP_API: `${BASE_URL}/api/v1/register`,
    GET_ALL_USERS_API: `${BASE_URL}/api/v1/getAllUsers`,
}


export const pageEndPoints={
    CREATE_PAGE_API: `${BASE_URL}/api/v1/page`,
    UPDATE_PAGE_API: `${BASE_URL}/api/v1/page`,
    DELETE_PAGE_API: `${BASE_URL}/api/v1/page`,

    GET_PAGE_API: `${BASE_URL}/api/v1/page`,
    GET_ALL_PAGES_API: `${BASE_URL}/api/v1/pages`,


    SCHEDULE_PUBLISH_API: `${BASE_URL}/api/v1/publication`,
    UPDATE_PUBLISH_API: `${BASE_URL}/api/v1/publication`,
    CANCEL_PUBLISH_API: `${BASE_URL}/api/v1/publication`,
}
