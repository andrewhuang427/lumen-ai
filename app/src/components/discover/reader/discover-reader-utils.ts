import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";

export function getPostChapterRange(post: EnrichedBibleStudyPost) {
  return `${post.session.book.name} ${post.session.start_chapter.number}${post.session.end_chapter ? `-${post.session.end_chapter.number}` : ""}`;
}
