/**
 * Single API client for the whole frontend.
 *
 * - Always sends cookies (credentials: 'include') so the httpOnly JWT flow works.
 * - On a 401, transparently tries POST /auth/refresh once, then retries the
 *   original request. Prevents spurious logouts when the short-lived access
 *   token expires mid-session.
 * - Normalises the backend's { success, data, error } envelope: resolves to
 *   `data` on success, throws an ApiError with message/code/details on failure.
 */

export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api'

export class ApiError extends Error {
    constructor(message, { status, code, details } = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.details = details
    }
}

let refreshing = null

async function rawRequest(path, { method = 'GET', body, headers = {}, signal } = {}) {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        credentials: 'include',
        signal,
        headers: {
            ...(isForm ? {} : body ? { 'Content-Type': 'application/json' } : {}),
            ...headers,
        },
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
    })
    return res
}

async function parse(res) {
    const text = await res.text()
    let json = null
    try {
        json = text ? JSON.parse(text) : null
    } catch {
        // non-JSON response (shouldn't happen, but don't crash)
    }

    if (!res.ok) {
        const err = json?.error || {}
        throw new ApiError(err.message || `Request failed (${res.status})`, {
            status: res.status,
            code: err.code,
            details: err.details,
        })
    }
    // 204 No Content (analytics beacon) → null
    if (res.status === 204) return null
    return json?.data !== undefined ? json.data : json
}

export async function request(path, opts = {}) {
    let res = await rawRequest(path, opts)

    // Try a one-shot refresh on 401 (but never for the auth endpoints themselves).
    if (res.status === 401 && !path.startsWith('/auth/')) {
        try {
            refreshing = refreshing || rawRequest('/auth/refresh', { method: 'POST' })
            const refreshRes = await refreshing
            refreshing = null
            if (refreshRes.ok) {
                res = await rawRequest(path, opts) // retry original
            }
        } catch {
            refreshing = null
        }
    }

    return parse(res)
}

// Convenience verbs
export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    del: (path, body, opts) => request(path, { ...opts, method: 'DELETE', body }),
}

// ---- Domain helpers (thin, so callers read nicely) ----------------------

export const contentApi = {
    listProjects: (params) => api.get(`/projects${qs(params)}`),
    getProject: (slug) => api.get(`/projects/${slug}`),

    listPosts: (params) => api.get(`/blog${qs(params)}`),
    getPost: (slug) => api.get(`/blog/${slug}`),
    likePost: (slug) => api.post(`/blog/${slug}/like`),

    listHobbies: (params) => api.get(`/hobbies${qs(params)}`),
    getHobby: (slug) => api.get(`/hobbies/${slug}`),

    listCertificates: (params) => api.get(`/certificates${qs(params)}`),

    search: (q, limit = 10) => api.get(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),
}

export const contactApi = {
    submit: (payload) => api.post('/contact', payload),
}

export const newsletterApi = {
    subscribe: (payload) => api.post('/newsletter/subscribe', payload),
    confirm: (token) => api.get(`/newsletter/confirm?token=${encodeURIComponent(token)}`),
    unsubscribe: (token) => api.get(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`),
}

export const commentsApi = {
    list: (slug) => api.get(`/comments/posts/${slug}`),
    create: (slug, payload) => api.post(`/comments/posts/${slug}`, payload),
}

export const analyticsApi = {
    track: (path, referrer) =>
        api.post('/analytics/track', { path, referrer }).catch(() => {}), // never throw
}

export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    changePassword: (currentPassword, newPassword) =>
        api.post('/auth/change-password', { currentPassword, newPassword }),
}

export const adminApi = {
    dashboard: () => api.get('/admin/dashboard'),

    // content
    projects: {
        list: (params) => api.get(`/projects/admin/all${qs(params)}`),
        create: (b) => api.post('/projects', b),
        update: (id, b) => api.patch(`/projects/${id}`, b),
        remove: (id) => api.del(`/projects/${id}`),
    },
    blog: {
        list: (params) => api.get(`/blog/admin/all${qs(params)}`),
        get: (id) => api.get(`/blog/admin/${id}`),
        create: (b) => api.post('/blog', b),
        update: (id, b) => api.patch(`/blog/${id}`, b),
        remove: (id) => api.del(`/blog/${id}`),
    },
    hobbies: {
        list: () => api.get('/hobbies/admin/all'),
        create: (b) => api.post('/hobbies', b),
        update: (id, b) => api.patch(`/hobbies/${id}`, b),
        remove: (id) => api.del(`/hobbies/${id}`),
    },
    certificates: {
        list: () => api.get('/certificates/admin/all'),
        create: (b) => api.post('/certificates', b),
        update: (id, b) => api.patch(`/certificates/${id}`, b),
        remove: (id) => api.del(`/certificates/${id}`),
    },
    messages: {
        list: (params) => api.get(`/contact/admin/all${qs(params)}`),
        setStatus: (id, status, adminNotes) => api.patch(`/contact/admin/${id}`, { status, adminNotes }),
        remove: (id) => api.del(`/contact/admin/${id}`),
    },
    comments: {
        list: (params) => api.get(`/comments/admin/all${qs(params)}`),
        moderate: (id, status) => api.patch(`/comments/admin/${id}`, { status }),
        remove: (id) => api.del(`/comments/admin/${id}`),
    },
    subscribers: {
        list: (params) => api.get(`/newsletter/admin/all${qs(params)}`),
        remove: (id) => api.del(`/newsletter/admin/${id}`),
    },
    analytics: () => api.get('/analytics/stats'),

    uploads: {
        single: (file) => {
            const fd = new FormData()
            fd.append('file', file)
            return api.post('/uploads', fd)
        },
        remove: (publicId) => api.del('/uploads', { publicId }),
    },
}

function qs(params) {
    if (!params) return ''
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    if (!entries.length) return ''
    return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
}
