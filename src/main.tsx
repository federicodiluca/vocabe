import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { initProgress } from '@/state/store'
import { AppearanceEffect } from '@/app/AppearanceEffect'
import { ReminderEffect } from '@/app/ReminderEffect'
import { router } from '@/app/router'
import { setStorageAdapter } from '@/core/storage/store'
import { createNativeAdapter, preloadNativeValue } from '@/core/storage/nativeAdapter'
import './index.css'

async function bootstrap() {
  if (Capacitor.isNativePlatform()) {
    setStorageAdapter(createNativeAdapter(await preloadNativeValue()))
  }

  // Load persisted progress only after the native storage adapter is in place.
  initProgress()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppearanceEffect />
      <ReminderEffect />
      <RouterProvider router={router} />
    </StrictMode>,
  )

  if (Capacitor.isNativePlatform()) {
    // The splash stays up until the web view is ready (launchAutoHide: false).
    import('@capacitor/splash-screen')
      .then(({ SplashScreen }) => SplashScreen.hide())
      .catch(() => {})
  }
}

bootstrap()
