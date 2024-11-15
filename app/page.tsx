'use client';
import { useRouter } from 'next/navigation';
import { useSessions } from '../hooks/useSessions';
import Button from './components/Button';
import { Trash } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { sessions, isLoading, startNewSession, deleteSession } = useSessions();

  const handleStartNewSession = async () => {
    try {
      const newSessionId = await startNewSession();
      if (!newSessionId) {
        console.error('Session ID is undefined');
        return;
      }
      router.push(`/session/${newSessionId}`);
    } catch (error) {
      console.error('Failed to start a new session:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-center">
      <main className="w-full max-w-md space-y-8">
        <Button
          onClick={handleStartNewSession}
          color="blue"
          variant="solid"
          fullWidth={true}
          isLoading={isLoading}
        >
          Start New Session
        </Button>

        {sessions.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-lg font-semibold">Previous Sessions</h2>
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li
                  key={session}
                  className="flex justify-between items-center bg-white shadow p-3 rounded-lg"
                >
                  <a
                    href={`/session/${session}`}
                    className="text-blue-500 hover:underline"
                  >
                    Session ID: {session}
                  </a>
                  <button
                    onClick={() => deleteSession(session)}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Delete session"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

