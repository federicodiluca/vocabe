import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { DailyPage } from '@/features/daily/DailyPage'
import { RecallPage } from '@/features/recall/RecallPage'
import { ExplorePage } from '@/features/explore/ExplorePage'
import { CollectionPage } from '@/features/explore/CollectionPage'
import { ProgressPage } from '@/features/progress/ProgressPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <DailyPage /> },
        { path: 'ripasso', element: <RecallPage /> },
        { path: 'esplora', element: <ExplorePage /> },
        { path: 'esplora/:collectionId', element: <CollectionPage /> },
        { path: 'progressi', element: <ProgressPage /> },
        { path: 'impostazioni', element: <SettingsPage /> },
      ],
    },
  ],
  // Vite's BASE_URL is "/" in dev and "/vocabe/" when built for GitHub Pages.
  { basename: import.meta.env.BASE_URL },
)
