import { useAuth } from '../services/auth';

import { ApiError } from '../services/api';

import { type FormEvent, useState } from 'react';

import { Card, GradBtn, Input } from '../components/ui';

import { apiRequest } from '../services/api';



type AuthResponse = {

  id?: number;

  name?: string;

  email?: string;

  role?: string;

  token?: string;

  message?: string;

};



export function AuthPage({ setPage }: { setPage: (page: string) => void }) {

  const { refresh } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);



  async function handleSubmit(event: FormEvent) {

    event.preventDefault();

    if(loading) return;

    setMessage('');

    setError('');

    setLoading(true);



    try {

      const data = await apiRequest<AuthResponse>(

        mode === 'login' ? '/auth/login' : '/auth/register',

        {

          method: 'POST',

          body: JSON.stringify(

            mode === 'login'

              ? { email, password }

              : { name, email, password }

          ),

        }

      );



      if (mode === 'login' && data.token) {

        localStorage.setItem('token', data.token);

        const profile = await refresh();

        setMessage('Login successful');

        setPage(profile?.role === 'ADMIN' ? 'admin' : 'profile');

      } else {

        setMessage('Account created successfully. Now login.');

        setMode('login');

      }

    } catch (err) {

      setError(err instanceof ApiError ? [err.message, ...Object.values(err.fields)].join(' ? ') : err instanceof Error ? err.message : 'Request failed');

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center px-6 py-16">

      <Card className="w-full max-w-md p-8">

        <h1 className="text-3xl font-black mb-2">

          {mode === 'login' ? 'Welcome back' : 'Join Pixel'}

        </h1>



        <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>

          {mode === 'login'

            ? 'Login to access your Pixel account.'

            : 'Create your Pixel Club account.'}

        </p>



        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {mode === 'register' && (

            <Input

              label="Name"

              placeholder="Your name"

              value={name}

              onChange={setName}

            />

          )}



          <Input

            label="Email"

            type="email"

            placeholder="you@example.com"

            value={email}

            onChange={setEmail}

          />



          <Input

            label="Password"

            type="password"

            placeholder="••••••••"

            value={password}

            onChange={setPassword}

          />



          {error && (

            <p className="text-sm" style={{ color: '#f87171' }}>

              {error}

            </p>

          )}



          {message && (

            <p className="text-sm" style={{ color: '#34d399' }}>

              {message}

            </p>

          )}



          <GradBtn className="w-full" type="submit" disabled={loading}>

            {loading

              ? 'Please wait...'

              : mode === 'login'

                ? 'Login'

                : 'Create account'}

          </GradBtn>

        </form>



        {<button

          type="button"

          onClick={() => {

            setMode(mode === 'login' ? 'register' : 'login');

            setError('');

            setMessage('');

          }}

          className="mt-6 text-sm"

          style={{ color: '#f72585' }}

        >

          {mode === 'login'

            ? "Don't have an account? Register"

            : 'Already have an account? Login'}

        </button>}

      </Card>

    </div>

  );

}