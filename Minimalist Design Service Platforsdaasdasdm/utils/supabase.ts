import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jdwylgxmwkzrdbrllixl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd3lsZ3htd2t6cmRicmxsaXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODA5NjcsImV4cCI6MjA2ODA1Njk2N30.nNPgUSebGds9zcJKbD_a6e5D9ZYc22ct4-771ldg_oI'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions with improved error handling
export const authHelpers = {
  // Sign up new user
  signUp: async (email: string, password: string, metadata: { firstName: string; lastName: string; marketingEmails: boolean }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: metadata.firstName,
            last_name: metadata.lastName,
            marketing_emails: metadata.marketingEmails,
            full_name: `${metadata.firstName} ${metadata.lastName}`,
          }
        }
      })
      return { data, error }
    } catch (err) {
      console.error('Signup error:', err)
      return { data: null, error: { message: 'Network error during signup' } }
    }
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      console.error('Sign in error:', err)
      return { data: null, error: { message: 'Network error during sign in' } }
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      console.error('Sign out error:', err)
      return { error: { message: 'Network error during sign out' } }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (err) {
      console.error('Get user error:', err)
      return { user: null, error: { message: 'Network error getting user' } }
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (err) {
      console.error('Get session error:', err)
      return { session: null, error: { message: 'Network error getting session' } }
    }
  },

  // Update user profile
  updateProfile: async (updates: { first_name?: string; last_name?: string; [key: string]: any }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      return { data, error }
    } catch (err) {
      console.error('Update profile error:', err)
      return { data: null, error: { message: 'Network error updating profile' } }
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { data, error }
    } catch (err) {
      console.error('Reset password error:', err)
      return { data: null, error: { message: 'Network error resetting password' } }
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      console.error('Auth state change listener error:', err)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  }
}

// Database helper functions (for future use)
export const dbHelpers = {
  // Create user profile
  createProfile: async (userId: string, profileData: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
      return { data, error }
    } catch (err) {
      console.error('Create profile error:', err)
      return { data: null, error: { message: 'Network error creating profile' } }
    }
  },

  // Get user profile
  getProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    } catch (err) {
      console.error('Get profile error:', err)
      return { data: null, error: { message: 'Network error getting profile' } }
    }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      return { data, error }
    } catch (err) {
      console.error('Update profile error:', err)
      return { data: null, error: { message: 'Network error updating profile' } }
    }
  }
}

// 호환성을 위한 함수 익스포트 (App.tsx에서 사용)
export const signInWithEmail = authHelpers.signIn;
export const signUpWithEmail = (email: string, password: string, metadata: { name: string; role: 'customer' | 'designer' }) => {
  return authHelpers.signUp(email, password, {
    firstName: metadata.name.split(' ')[0] || metadata.name,
    lastName: metadata.name.split(' ')[1] || '',
    marketingEmails: true
  });
};
export const signOut = authHelpers.signOut;

export default supabase