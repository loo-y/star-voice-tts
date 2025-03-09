import { getCloudflareContext } from '@opennextjs/cloudflare'

export const getEnv = async () => {
    const cfContext = await getCloudflareContext({ async: true })
    const env = cfContext.env
    return env
}
