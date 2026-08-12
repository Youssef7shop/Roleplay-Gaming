export function getFriendlyAuthErrorMessage(err: any): string {
  if (!err) return 'An unknown error occurred.';
  
  const code = err.code || '';
  const message = err.message || '';

  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is disabled in your Firebase project. To enable it, open Firebase Console > Authentication > Sign-in method > Email/Password, click Enable, and save.';
  }

  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (code === 'auth/email-already-in-use') {
    return 'An account with this email address already exists. Please sign in instead.';
  }

  if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters long.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in popup was closed before completion. Please try again.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  }

  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }

  return message || 'Authentication failed. Please try again.';
}
