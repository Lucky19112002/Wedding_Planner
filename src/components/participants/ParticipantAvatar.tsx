import { Avatar } from '@/components/ui/Avatar';

export function ParticipantAvatar({ name }: { name: string }) {
  return <Avatar className="size-12 bg-violet-100 text-violet-700" name={name} />;
}
