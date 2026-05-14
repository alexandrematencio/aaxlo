<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Leads · AAXLO Admin' })

const filters = reactive({
  status: '',
  hot_lead: '',
  on_hold: '',
})

const STATUSES = ['', 'queued', 'running', 'teaser_ready', 'pdf_ready', 'on_hold', 'delivered', 'hot_lead', 'converted', 'dormant']

const { data, refresh, pending } = await useFetch('/api/admin/leads', {
  query: filters,
  watch: [filters],
})

const leads = computed(() => data.value?.leads ?? [])

async function toggleOnHold(lead) {
  await $fetch(`/api/admin/leads/${lead.id}`, {
    method: 'PATCH',
    body: { on_hold: !lead.on_hold },
  })
  await refresh()
}

async function markReplied(lead) {
  await $fetch(`/api/admin/leads/${lead.id}`, {
    method: 'PATCH',
    body: { nurture_halted_reason: 'replied' },
  })
  await refresh()
}

async function markConverted(lead) {
  if (!confirm(`Mark "${lead.business_name}" as converted?`)) return
  await $fetch(`/api/admin/leads/${lead.id}`, {
    method: 'PATCH',
    body: { mark_converted: true },
  })
  await refresh()
}

function fmtDate(s) {
  if (!s) return '—'
  const d = new Date(s)
  return d.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
}

function safeHref(url) {
  if (!url) return null
  return /^https?:\/\//i.test(url) ? url : null
}
</script>

<template>
  <div>
    <h1 class="page-title">Leads</h1>

    <div class="filters">
      <label>
        Status:
        <select v-model="filters.status">
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s || '(all)' }}</option>
        </select>
      </label>
      <label>
        Hot lead:
        <select v-model="filters.hot_lead">
          <option value="">(any)</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <label>
        On hold:
        <select v-model="filters.on_hold">
          <option value="">(any)</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <span v-if="pending" class="filter-pending">loading…</span>
    </div>

    <div class="leads-table">
      <div class="leads-header">
        <span>Created</span>
        <span>Business</span>
        <span>Email</span>
        <span>Locale</span>
        <span>Status</span>
        <span>Score</span>
        <span>Flags</span>
        <span>Actions</span>
      </div>
      <div v-for="lead in leads" :key="lead.id" class="leads-row" :class="{ 'is-hot': lead.hot_lead }">
        <span class="cell-mono">{{ fmtDate(lead.created_at) }}</span>
        <span>
          <strong>{{ lead.business_name }}</strong>
          <br>
          <a v-if="safeHref(lead.website_url)" :href="safeHref(lead.website_url)" target="_blank" rel="noopener" class="row-link">{{ lead.website_url }}</a>
        </span>
        <span class="cell-mono">{{ lead.email }}</span>
        <span>{{ lead.locale }}</span>
        <span class="cell-status">{{ lead.status }}</span>
        <span>{{ lead.score_overall ?? '—' }}</span>
        <span class="cell-flags">
          <span v-if="lead.hot_lead" class="flag flag-hot">HOT</span>
          <span v-if="lead.on_hold" class="flag flag-hold">HOLD</span>
        </span>
        <span class="cell-actions">
          <a v-if="lead.drive_doc_url" :href="lead.drive_doc_url" target="_blank" rel="noopener" class="action-link">Doc</a>
          <a v-if="lead.drive_pdf_url" :href="lead.drive_pdf_url" target="_blank" rel="noopener" class="action-link">PDF</a>
          <button class="action-btn" @click="toggleOnHold(lead)">{{ lead.on_hold ? 'Release' : 'Hold' }}</button>
          <button class="action-btn" @click="markReplied(lead)">Replied</button>
          <button class="action-btn" @click="markConverted(lead)">Converted</button>
        </span>
      </div>
      <div v-if="leads.length === 0 && !pending" class="leads-empty">No leads match these filters.</div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-family: var(--font); font-size: 28px; font-weight: 600; color: var(--color-dark); margin: 0 0 24px 0; }
.filters { display: flex; gap: 16px; align-items: center; padding: 16px; background: var(--color-white); border: 0.5px solid var(--color-border); margin-bottom: 16px; font-family: var(--font); font-size: 13px; }
.filters label { display: flex; gap: 8px; align-items: center; color: var(--color-muted); }
.filters select { font-family: var(--font); font-size: 13px; padding: 4px 8px; border: 0.5px solid var(--color-border); background: var(--color-cream); }
.filter-pending { color: var(--color-accent); font-family: monospace; font-size: 12px; }
.leads-table { background: var(--color-white); border: 0.5px solid var(--color-border); font-family: var(--font); font-size: 13px; }
.leads-header, .leads-row { display: grid; grid-template-columns: 130px 1fr 200px 50px 110px 60px 90px 1fr; gap: 16px; padding: 12px 16px; align-items: center; }
.leads-header { background: var(--color-cream); font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-muted); }
.leads-row { border-top: 0.5px solid var(--color-border); }
.leads-row.is-hot { background: var(--color-peach); }
.cell-mono { font-family: monospace; font-size: 12px; color: var(--color-muted); }
.cell-status { font-family: monospace; font-size: 12px; }
.cell-flags { display: flex; gap: 4px; }
.flag { font-family: monospace; font-size: 10px; padding: 2px 6px; letter-spacing: 0.1em; }
.flag-hot { background: var(--color-accent); color: var(--color-cream); }
.flag-hold { background: var(--color-dark); color: var(--color-cream); }
.cell-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.action-link, .action-btn { font-family: var(--font); font-size: 11px; padding: 4px 8px; border: 0.5px solid var(--color-dark); background: transparent; color: var(--color-dark); cursor: pointer; text-decoration: none; }
.action-link:hover, .action-btn:hover { background: var(--color-dark); color: var(--color-cream); }
.row-link { font-family: monospace; font-size: 11px; color: var(--color-muted); }
.leads-empty { padding: 32px; text-align: center; color: var(--color-muted); font-family: var(--font); }
</style>
