#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sql = postgres({
  host: process.env.AAXLO_FUNNEL_DB_HOST,
  port: Number(process.env.AAXLO_FUNNEL_DB_PORT || 5432),
  database: process.env.AAXLO_FUNNEL_DB_NAME,
  user: process.env.AAXLO_FUNNEL_DB_USER,
  password: process.env.AAXLO_FUNNEL_DB_PASSWORD,
  ssl: false,
})

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  const applied = await sql`SELECT name FROM _migrations`
  const appliedSet = new Set(applied.map(r => r.name))

  const dir = join(__dirname, 'migrations')
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort()

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`✓ ${file} (already applied)`)
      continue
    }
    console.log(`→ applying ${file}`)
    const content = readFileSync(join(dir, file), 'utf8')
    await sql.unsafe(content)
    await sql`INSERT INTO _migrations (name) VALUES (${file})`
    console.log(`✓ ${file}`)
  }

  await sql.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
