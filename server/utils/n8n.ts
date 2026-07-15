import { createHmac } from 'node:crypto'

type AuditWebhookPayload = {
  audit_id: string
  business_name: string
  website_url?: string
  email: string
  phone?: string
  name?: string
  locale: 'en' | 'fr'
}

function sign(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

export async function triggerAuditPipeline(payload: AuditWebhookPayload): Promise<void> {
  const config = useRuntimeConfig()
  const body = JSON.stringify(payload)
  const signature = sign(body, config.n8nAuditWebhookSecret)

  try {
    await $fetch(config.n8nAuditWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AAXLO-Signature': signature,
      },
      body,
      timeout: 5000,
    })
  } catch (err) {
    console.error('[audit] n8n webhook dispatch failed', err)
  }
}
