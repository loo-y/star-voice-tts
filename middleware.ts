import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCloudflareContext } from "@opennextjs/cloudflare";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const cfContext = await getCloudflareContext({ async: true });
    const env = cfContext.env
    // 克隆原始请求
    const requestHeaders = new Headers(request.headers);
    // 遍历 process.env，将所有环境变量添加到请求头
    for (const key in env) {
        if (env.hasOwnProperty(key)) {
            // @ts-expect-error
            const value = env[key]
            if (value && typeof value === 'string') { // 确保 value 不为 undefined 或 null
                requestHeaders.set(`x-${key}`, value);
            }
        }
    }

    // 创建新的响应对象
    const response = NextResponse.next({
        request: {
        // 使用修改后的 headers
        headers: requestHeaders,
        },
    });

    return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/api/:path*', '/dashboard/:path*'],
}