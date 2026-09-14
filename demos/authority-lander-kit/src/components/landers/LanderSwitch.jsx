import { AuthorityLander } from "./landers/AuthorityLander.jsx";
import { ComparisonLander } from "./landers/ComparisonLander.jsx";
import { ListicleLander } from "./landers/ListicleLander.jsx";
import { NewsMimicLander } from "./landers/NewsMimicLander.jsx";
import { QuizLander } from "./landers/QuizLander.jsx";
import { StoryLander } from "./landers/StoryLander.jsx";

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
