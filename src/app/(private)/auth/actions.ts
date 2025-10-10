'use server';

const CORRECT_PASSWORD = '8431';

export async function verifyDeviceGroupPassword(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (password === CORRECT_PASSWORD) {
    return { success: true };
  }

  return {
    success: false,
    error: 'パスワードが正しくありません',
  };
}

