import { useRef, useState } from 'react'
import { useProgressState } from '@/state/hooks'
import { updateSettings, replaceProgress, resetProgress } from '@/state/store'
import { exportState, parseImported } from '@/core/storage/store'
import type { ReadingFont, TextSize, ThemeSetting } from '@/core/types'
import { Button } from '@/ui/Button'
import { cn } from '@/ui/cn'

const THEMES: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Chiaro' },
  { value: 'dark', label: 'Scuro' },
]

const FONTS: { value: ReadingFont; label: string }[] = [
  { value: 'serif', label: 'Classico' },
  { value: 'sans', label: 'Moderno' },
]

const SIZES: { value: TextSize; label: string }[] = [
  { value: 'normale', label: 'Normale' },
  { value: 'grande', label: 'Grande' },
]

/** Segmented control shared by the three appearance settings. */
function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-2xl border py-2.5 text-sm font-medium transition',
            value === o.value ? 'border-brand bg-brand-soft text-brand' : 'border-line text-ink-soft',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const state = useProgressState()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(null), 3000)
  }

  function onExport() {
    const blob = new Blob([exportState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vocabe-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File) {
    try {
      replaceProgress(parseImported(await file.text()))
      flash('Progressi importati')
    } catch {
      flash('File non valido')
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-soft">Tema</h2>
          <Choice
            options={THEMES}
            value={state.settings.theme}
            onChange={(theme) => updateSettings({ theme })}
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-soft">Carattere delle parole</h2>
          <Choice
            options={FONTS}
            value={state.settings.readingFont}
            onChange={(readingFont) => updateSettings({ readingFont })}
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-soft">Dimensione del testo</h2>
          <Choice
            options={SIZES}
            value={state.settings.textSize}
            onChange={(textSize) => updateSettings({ textSize })}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Dati</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={onExport}>
            Esporta progressi (backup)
          </Button>
          <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
            Importa da file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
          <Button
            variant="ghost"
            className="w-full text-bad"
            onClick={() => {
              if (confirm('Cancellare tutti i progressi? Non si può annullare.')) {
                resetProgress()
                flash('Tutto azzerato')
              }
            }}
          >
            Azzera tutto
          </Button>
        </div>
        {msg && <p className="mt-2 text-center text-sm text-ink-soft">{msg}</p>}
      </section>

      <p className="pt-4 text-center text-xs text-ink-soft">
        <a href={`${import.meta.env.BASE_URL}parole/`} className="underline">
          Glossario
        </a>
        <span className="mx-2">·</span>
        <a href={`${import.meta.env.BASE_URL}privacy/`} className="underline">
          Privacy
        </a>
        <span className="mx-2">·</span>i tuoi dati restano su questo dispositivo
      </p>

      <p className="text-center text-xs text-ink-soft">
        Un progetto di{' '}
        <a
          href="https://federicodiluca.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Federico Di Luca
        </a>
      </p>
    </div>
  )
}
