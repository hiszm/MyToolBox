<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToolLayout from '@/components/layout/ToolLayout.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import { useI18n } from '@/i18n'
import type { ToolMeta } from '@/types/tool'

const route = useRoute()
const tool = route.meta.tool as ToolMeta
const { t } = useI18n()

type Engine = 'hive' | 'spark' | 'trino'
type Mode = 'pk' | 'md5'
const engine = ref<Engine>('hive')
const mode = ref<Mode>('pk')

const engineOptions = [
  { value: 'hive' as const, label: 'Hive SQL' },
  { value: 'spark' as const, label: 'Spark SQL' },
  { value: 'trino' as const, label: 'Trino / Presto SQL' },
]

const modeOptions = computed(() => [
  { value: 'pk' as const, label: t({ zh: '主键模式 (推荐有主键的表)', en: 'Primary-key mode (recommended)' }) },
  { value: 'md5' as const, label: t({ zh: 'MD5 全字段模式 (无主键表)', en: 'Full-field MD5 mode (no primary key)' }) },
])

const table1 = ref('ods.user_d')
const table2 = ref('dw.dw_user_d')
const primaryKey = ref('id')
const fields = ref(`id
name
email
created_at
updated_at`)
const usePartition = ref(false)
const partitionField = ref('dt')
const partitionValue1 = ref('2026-05-16')
const partitionValue2 = ref('2026-05-17')

const error = ref('')
const fieldList = computed(() => fields.value.split('\n').map((l) => l.trim()).filter(Boolean))

function md5Concat(eng: Engine, fields: string[], alias: string): string {
  const concat = fields
    .map((f) => `coalesce(cast(${alias}.${f} as string), '\\\\N')`)
    .join(", '|', ")
  if (eng === 'hive') return `md5(concat_ws('|', ${fields.map((f) => `coalesce(cast(${alias}.${f} as string), '\\\\N')`).join(', ')}))`
  if (eng === 'spark') return `md5(concat_ws('|', ${fields.map((f) => `coalesce(cast(${alias}.${f} as string), '\\\\N')`).join(', ')}))`
  return `to_hex(md5(to_utf8(concat(${concat}))))`
}

const sql = computed(() => {
  if (!table1.value || !table2.value) {
    error.value = t({ zh: '请输入两张表名', en: 'Both tables required' })
    return ''
  }
  if (mode.value === 'pk' && !primaryKey.value) {
    error.value = t({ zh: '请输入主键字段', en: 'Primary key required' })
    return ''
  }
  if (!fieldList.value.length) {
    error.value = t({ zh: '请输入字段列表', en: 'Field list required' })
    return ''
  }
  error.value = ''

  const pk = primaryKey.value
  const f = fieldList.value
  const part1 = usePartition.value ? ` WHERE ${partitionField.value} = '${partitionValue1.value}'` : ''
  const part2 = usePartition.value ? ` WHERE ${partitionField.value} = '${partitionValue2.value}'` : ''

  if (mode.value === 'pk') {
    return `-- ${'='.repeat(76)}
-- ${engine.value.toUpperCase()} 表数据比对 - 主键模式
-- ${table1.value} vs ${table2.value}
-- ${'='.repeat(76)}

WITH
a AS (SELECT * FROM ${table1.value}${part1}),
b AS (SELECT * FROM ${table2.value}${part2}),
left_only AS (
  SELECT a.${pk} AS ${pk}, 'only_in_a' AS status
  FROM a LEFT JOIN b ON a.${pk} = b.${pk}
  WHERE b.${pk} IS NULL
),
right_only AS (
  SELECT b.${pk} AS ${pk}, 'only_in_b' AS status
  FROM b LEFT JOIN a ON a.${pk} = b.${pk}
  WHERE a.${pk} IS NULL
),
diff_rows AS (
  SELECT a.${pk} AS ${pk}, 'value_mismatch' AS status
  FROM a JOIN b ON a.${pk} = b.${pk}
  WHERE ${f.filter((x) => x !== pk).map((x) => `coalesce(cast(a.${x} as string), '') <> coalesce(cast(b.${x} as string), '')`).join('\n     OR ')}
)
SELECT * FROM left_only
UNION ALL
SELECT * FROM right_only
UNION ALL
SELECT * FROM diff_rows;
-- ${'='.repeat(76)}`
  } else {
    return `-- ${'='.repeat(76)}
-- ${engine.value.toUpperCase()} 表数据比对 - MD5 全字段模式
-- ${table1.value} vs ${table2.value}
-- ${'='.repeat(76)}

WITH
a AS (
  SELECT ${md5Concat(engine.value, f, 'x')} AS row_hash
  FROM ${table1.value} x${part1}
),
b AS (
  SELECT ${md5Concat(engine.value, f, 'y')} AS row_hash
  FROM ${table2.value} y${part2}
),
counts AS (
  SELECT
    (SELECT count(*) FROM a) AS rows_a,
    (SELECT count(*) FROM b) AS rows_b,
    (SELECT count(*) FROM a JOIN b ON a.row_hash = b.row_hash) AS rows_same
)
SELECT
  rows_a,
  rows_b,
  rows_same,
  rows_a - rows_same AS only_in_a,
  rows_b - rows_same AS only_in_b
FROM counts;
-- ${'='.repeat(76)}`
  }
})
</script>

<template>
  <ToolLayout :tool="tool" variant="wide">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: 'SQL 方言', en: 'SQL dialect' }) }}</label>
            <UiSelect v-model="engine" :options="engineOptions" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted">{{ t({ zh: '比对模式', en: 'Diff mode' }) }}</label>
            <UiSelect v-model="mode" :options="modeOptions" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '表 1 (db.table)', en: 'Table 1 (db.table)' }) }}</label>
            <UiInput v-model="table1" mono />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '表 2 (db.table)', en: 'Table 2 (db.table)' }) }}</label>
            <UiInput v-model="table2" mono />
          </div>
        </div>

        <div v-if="mode === 'pk'">
          <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '主键字段', en: 'Primary key' }) }}</label>
          <UiInput v-model="primaryKey" mono />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-ink">{{ t({ zh: '字段列表(每行一个)', en: 'Field list (one per line)' }) }}</label>
          <UiTextarea v-model="fields" :rows="8" />
        </div>

        <div>
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <input v-model="usePartition" type="checkbox" class="size-4 rounded border-border text-accent" />
            {{ t({ zh: '使用分区过滤', en: 'Use partition filter' }) }}
          </label>
          <div v-if="usePartition" class="mt-3 grid grid-cols-3 gap-2">
            <UiInput v-model="partitionField" mono :placeholder="t({ zh: '分区字段', en: 'partition field' })" size="sm" />
            <UiInput v-model="partitionValue1" mono :placeholder="t({ zh: '表1 分区值', en: 'table1 partition' })" size="sm" />
            <UiInput v-model="partitionValue2" mono :placeholder="t({ zh: '表2 分区值', en: 'table2 partition' })" size="sm" />
          </div>
        </div>

        <UiAlert :message="error" />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <label class="text-sm font-medium text-ink">{{ t({ zh: '生成的 SQL', en: 'Generated SQL' }) }}</label>
          <CopyButton :text="sql" />
        </div>
        <pre class="max-h-[40rem] overflow-auto rounded-xl border border-border bg-surface-raised p-4 font-mono text-xs leading-relaxed"><code>{{ sql }}</code></pre>
      </div>
    </div>
  </ToolLayout>
</template>
