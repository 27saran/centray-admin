import { redirect } from 'next/navigation';

export default function LobbyPage() {
  redirect('/session-management/matchmaking');
}
