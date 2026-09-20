import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { buildMockFileListResponse, mockPackageTasks, mockShareList, mockUser } from './fixtures'

// 模拟网络延迟，避免界面出现"瞬间完成"的不真实感
const MOCK_DELAY_MS = 200

interface RouteMatch {
  method: string
  pattern: RegExp
  paramNames: string[]
  handler: (params: Record<string, string>, config: AxiosRequestConfig) => unknown
}

function ok<T>(data: T, message = 'ok') {
  return { code: 0, message, data }
}

function compilePattern(path: string) {
  const paramNames: string[] = []
  const pattern = path.replace(/:([^/]+)/g, (_match, name: string) => {
    paramNames.push(name)
    return '([^/]+)'
  })
  return { regex: new RegExp(`^${pattern}$`), paramNames }
}

function defineRoute(
  method: string,
  path: string,
  handler: RouteMatch['handler']
): RouteMatch {
  const { regex, paramNames } = compilePattern(path)
  return { method, pattern: regex, paramNames, handler }
}

function parseBody(config: AxiosRequestConfig): Record<string, unknown> {
  if (!config.data) return {}
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data)
    } catch {
      return {}
    }
  }
  return config.data as Record<string, unknown>
}

const routes: RouteMatch[] = [
  defineRoute('get', '/api/auth/feishu/url', () => ok({ url: '/mock-login' })),
  defineRoute('get', '/api/auth/me', () => ok(mockUser)),
  defineRoute('post', '/api/auth/logout', () => ok(null)),

  defineRoute('get', '/api/files', (_params, config) => {
    const page = Number(config.params?.page) || 1
    const pageSize = Number(config.params?.page_size) || 20
    const parentId = config.params?.parent_id ? Number(config.params.parent_id) : null
    return ok(buildMockFileListResponse(page, pageSize, parentId))
  }),
  defineRoute('post', '/api/folders', (_params, config) => {
    const body = parseBody(config)
    return ok({
      id: Date.now(),
      folder_name: body.folder_name,
      parent_id: body.parent_id ?? null,
      created_at: new Date().toISOString()
    })
  }),
  defineRoute('post', '/api/files/upload', (_params, config) => {
    let fileName = '上传的文件'
    let fileSize = 0
    const data = config.data

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      const uploaded = data.get('file')
      if (uploaded instanceof File) {
        fileName = uploaded.name
        fileSize = uploaded.size
      }
    }

    return ok({
      id: Date.now(),
      type: 'file',
      file_name: fileName,
      file_size: fileSize,
      file_hash: `mock-upload-${Date.now()}`,
      mime_type: 'application/octet-stream',
      created_at: new Date().toISOString()
    })
  }),
  defineRoute('patch', '/api/files/:id', () => ok(null)),
  defineRoute('patch', '/api/folders/:id', () => ok(null)),
  defineRoute('delete', '/api/files/:id', () => ok(null)),
  defineRoute('delete', '/api/folders/:id', () => ok(null)),
  defineRoute('post', '/api/files/:id/copy', (params) => ok({ new_id: Number(params.id) + 1000 })),
  defineRoute('post', '/api/files/:id/move', () => ok(null)),
  defineRoute('post', '/api/folders/:id/copy', (params) => ok({ new_id: Number(params.id) + 1000 })),
  defineRoute('post', '/api/folders/:id/move', () => ok(null)),
  defineRoute('get', '/api/files/:id/download', () => ok({ mock: true })),

  defineRoute('post', '/api/files/download/package', () => ok(mockPackageTasks[0])),
  defineRoute('get', '/api/files/download/package/:taskId', () => ok(mockPackageTasks[0])),
  defineRoute('delete', '/api/files/download/package/:taskId', () => ok(null)),
  defineRoute('get', '/api/files/download/tasks', () => ok(mockPackageTasks)),

  defineRoute('get', '/api/shares', (_params, config) => {
    const page = Number(config.params?.page) || 1
    const pageSize = Number(config.params?.page_size) || 20
    return ok({ total: mockShareList.length, list: mockShareList, page, page_size: pageSize })
  }),
  defineRoute('post', '/api/shares', (_params, config) => {
    const body = parseBody(config)
    return ok({
      share_id: Date.now(),
      share_code: Math.random().toString(36).slice(2, 8),
      share_url: `https://pan.your-domain.com/s/${Math.random().toString(36).slice(2, 8)}`,
      expire_at: new Date(Date.now() + (Number(body.expire_days) || 7) * 86400000).toISOString(),
      has_password: Boolean(body.password)
    })
  }),
  defineRoute('delete', '/api/shares/:id', () => ok(null))
]

function findRoute(method: string, path: string) {
  const normalizedMethod = method.toLowerCase()
  for (const route of routes) {
    if (route.method !== normalizedMethod) continue
    const match = route.pattern.exec(path)
    if (!match) continue
    const params: Record<string, string> = {}
    route.paramNames.forEach((name, index) => {
      params[name] = match[index + 1]
    })
    return { route, params }
  }
  return null
}

// 自定义 axios 适配器：在没有真实后端时，按配置的规则返回模拟数据
export const mockAdapter: AxiosAdapter = (config: AxiosRequestConfig) => {
  const method = config.method || 'get'
  const path = (config.url || '').split('?')[0]
  const matched = findRoute(method, path)

  return new Promise<AxiosResponse>((resolve, reject) => {
    setTimeout(() => {
      if (!matched) {
        reject({
          message: `[mock] 未找到匹配的模拟接口: ${method.toUpperCase()} ${path}`,
          config,
          isAxiosError: true,
          response: {
            data: { code: -1, message: '接口未在测试配置中定义', data: null },
            status: 404,
            statusText: 'Not Found',
            headers: {},
            config
          }
        })
        return
      }

      const data = matched.route.handler(matched.params, config)
      resolve({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      } as AxiosResponse)
    }, MOCK_DELAY_MS)
  })
}
