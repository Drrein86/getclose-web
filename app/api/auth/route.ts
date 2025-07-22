import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // בדיקת טוקן אימות - לעת עתה נחזיר משתמש דמה
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No authorization header' },
        { status: 401 }
      )
    }

    // לעת עתה נחזיר משתמש דמה
    const mockUser = {
      id: '1',
      name: 'משתמש דמה',
      email: 'user@example.com',
      userType: 'CUSTOMER',
      avatar: null,
      phone: '0501234567',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: mockUser
    })
  } catch (error) {
    console.error('Error in auth:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // בדיקת פרטי התחברות - לעת עתה נקבל כל דבר
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // לעת עתה נחזיר הצלחה עם טוקן דמה
    const mockAuthResponse = {
      user: {
        id: '1',
        name: 'משתמש דמה',
        email: email,
        userType: 'CUSTOMER',
        avatar: null,
        phone: '0501234567',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'fake-jwt-token-' + Date.now(),
      refreshToken: 'fake-refresh-token-' + Date.now(),
      expiresIn: 86400 // 24 hours
    }

    return NextResponse.json({
      success: true,
      data: mockAuthResponse
    })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
} 