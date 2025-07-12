// app/api/login/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { LoginRequest } from '@/type/login'
import { $fetch } from 'ofetch'

export async function POST(request: NextRequest) {
  const body: LoginRequest = await request.json()
  try {
    const res = await $fetch('http://94.74.86.174:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })

    const response = NextResponse.json({ data: res.data })

    return response
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }
}
