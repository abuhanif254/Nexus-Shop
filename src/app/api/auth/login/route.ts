import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock validation
    if (email === 'test@besa.com' && password === 'password') {
      const token = await signToken({ userId: 1, email, role: 'admin' });
      
      const response = NextResponse.json({ 
        success: true, 
        token,
        user: { email, name: 'Test User' } 
      });

      // CORS
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
