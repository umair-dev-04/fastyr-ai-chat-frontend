import { http, HttpResponse } from "msw"
import { config } from "@/lib/config"

export const handlers = [
  // Auth endpoints
  http.post(`${config.API_BASE_URL}/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === "test@example.com" && body.password === "password") {
      return HttpResponse.json({
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        user: {
          id: "1",
          full_name: "Test User",
          email: "test@example.com",
          avatar_url: null,
        },
      })
    }

    return HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 })
  }),

  http.post(`${config.API_BASE_URL}/signup`, async ({ request }) => {
    const body = (await request.json()) as { full_name: string; email: string; password: string }

    return HttpResponse.json({
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      user: {
        id: "2",
        full_name: body.full_name,
        email: body.email,
        avatar_url: null,
      },
    })
  }),

  http.get(`${config.API_BASE_URL}/me`, () => {
    return HttpResponse.json({
      id: "1",
      full_name: "Test User",
      email: "test@example.com",
      avatar_url: null,
    })
  }),

  // Chat endpoints
  http.post(`${config.API_BASE_URL}/chat`, async ({ request }) => {
    const body = (await request.json()) as { message: string; session_id?: string }

    return HttpResponse.json({
      message: `Echo: ${body.message}`,
      session_id: body.session_id || "new-session-id",
      assistant_message_created_at: new Date().toISOString(),
    })
  }),

  http.get(`${config.API_BASE_URL}/chat/sessions`, () => {
    return HttpResponse.json([
      {
        id: "session-1",
        session_id: "session-1",
        title: "Test Session",
        created_at: new Date().toISOString(),
        messages: [
          {
            id: "msg-1",
            role: "user",
            content: "Hello",
            created_at: new Date().toISOString(),
          },
        ],
      },
    ])
  }),

  // Error simulation
  http.get(`${config.API_BASE_URL}/error`, () => {
    return HttpResponse.json({ detail: "Simulated server error" }, { status: 500 })
  }),
]
