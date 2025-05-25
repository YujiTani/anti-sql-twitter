import { expect, test } from 'bun:test'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Head from './head'

test('適切なページタイトルとメタディスクリプションが設定されていること', async () => {
  const testTitle = 'テストタイトル'
  const testDescription = 'テスト用の内容'

  render(
    <HelmetProvider>
      <Head title={testTitle} description={testDescription} />
    </HelmetProvider>,
  )
  await waitFor(() => expect(document.title).toEqual(testTitle))
  const metaDescription = document.querySelector('meta[name="description"]')
  expect(metaDescription?.getAttribute('content')).toEqual(testDescription)
})
