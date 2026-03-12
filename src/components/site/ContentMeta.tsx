import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

interface ContentMetaProps {
  date: string;
  tags: string[];
  readingTime?: string;
}

export function ContentMeta({ date, tags, readingTime }: ContentMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span>{formatDate(date)}</span>
      {readingTime ? <span>• {readingTime}</span> : null}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
