'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, deleteSessionById } from '../services/sessionService';
import Button from './components/Button';
import { Trash } from 'lucide-react';

export default function Home() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(savedSessions);
  }, []);

  const startNewSession = async () => {
    setIsLoading(true);
    try {
      const data = await createSession();
      const newSessionId = data.id;
      const updatedSessions = [newSessionId, ...sessions];

      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));

      router.push(`/session/${newSessionId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));

    try {
      await deleteSessionById(sessionId);
    } catch (error) {
      console.error(error);
      setSessions((prev) => [sessionId, ...prev]);
      localStorage.setItem('sessions', JSON.stringify([sessionId, ...updatedSessions]));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-center">
      <main className="w-full max-w-md space-y-8">
        <Button
          onClick={startNewSession}
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

