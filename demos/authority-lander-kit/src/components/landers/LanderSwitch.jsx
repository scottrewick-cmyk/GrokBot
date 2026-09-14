import { AuthorityLander } from "./AuthorityLander.jsx";
import { ComparisonLander } from "./ComparisonLander.jsx";
import { ListicleLander } from "./ListicleLander.jsx";
import { NewsMimicLander } from "./NewsMimicLander.jsx";
import { QuizLander } from "./QuizLander.jsx";
import { StoryLander } from "./StoryLander.jsx";

const MAP = {
  authority: AuthorityLander,
  listicle: ListicleLander,
  story: StoryLander,
  news: NewsMimicLander,
  quiz: QuizLander,
  comparison: ComparisonLander,
};

export function LanderSwitch({ familyId, brief, onCta }) {
  const View = MAP[familyId] || AuthorityLander;
  return <View brief={brief} onCta={onCta} />;
}
