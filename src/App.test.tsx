// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  sessionStorage.clear()
  vi.stubGlobal('scrollTo', vi.fn())
})

afterEach(() => cleanup())

describe('診断フロー', () => {
  it('未回答では進めず、戻ったときに回答が復元される', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /診断を始める/ }))
    const next = screen.getByRole('button', { name: /次へ/ })
    expect((next as HTMLButtonElement).disabled).toBe(true)

    await user.click(screen.getByRole('radio', { name: /ほとんど整理されていない/ }))
    expect((next as HTMLButtonElement).disabled).toBe(false)
    await user.click(next)
    expect(screen.getByText(/業務に必要な知識やノウハウ/)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /戻る/ }))
    expect(screen.getByRole('radio', { name: /ほとんど整理されていない/ }).getAttribute('aria-checked')).toBe('true')
  })

  it('12問すべてに回答すると結果を順序どおり表示する', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /診断を始める/ }))

    for (let index = 0; index < 12; index += 1) {
      const choices = screen.getAllByRole('radio')
      await user.click(choices[0])
      const button = screen.getByRole('button', { name: index === 11 ? /診断結果を見る/ : /次へ/ })
      await user.click(button)
    }

    expect(screen.getByText('属人型')).toBeTruthy()
    expect(screen.getByText('教育資産化の4つの状態')).toBeTruthy()
    expect(screen.getByText('まず取り組む3つ')).toBeTruthy()
    expect(screen.getByText('今の御社におすすめの記事')).toBeTruthy()
    expect(screen.getByText(/次は、実際の社内資料で/)).toBeTruthy()

    const content = document.body.textContent ?? ''
    expect(content.indexOf('教育資産化の4つの状態')).toBeLessThan(content.indexOf('まず取り組む3つ'))
    expect(content.indexOf('まず取り組む3つ')).toBeLessThan(content.indexOf('今の御社におすすめの記事'))
    expect(content.indexOf('今の御社におすすめの記事')).toBeLessThan(content.indexOf('次は、実際の社内資料で'))
  })
})
