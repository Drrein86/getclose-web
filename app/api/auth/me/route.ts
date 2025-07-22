import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // בדיקת טוכן אימות
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No valid authorization token' },
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
      address: 'תל אביב, ישראל',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: mockUser
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user info' },
      { status: 500 }
    )
  }
} 