import LC from 'leanengine';
import { getReviewCycleBySlug } from './review-cycle';

const SelfReview = LC.Object.extend('SelfReview');

export async function getSelfReview(userId, reviewCycleSlug) {
  const reviewer = LC.Object.createWithoutData('_User', userId);
  const cycle = await getReviewCycleBySlug(reviewCycleSlug);
  if (!cycle) {
    throw new Error(`Review cycle ${reviewCycleSlug} doesn't exist.`);
  }
  const query = new LC.Query(SelfReview);
  query.equalTo('reviewer', reviewer);
  query.equalTo('reviewCycle', cycle);
  const review = await query.first();
  if (review) {
    return review.toJSON();
  } else {
    return null;
  }
}

export async function saveSelfReview(userId, reviewCycleSlug, selfReviewData) {
  const cycle = await getReviewCycleBySlug(reviewCycleSlug);
  if (!cycle) {
    throw new Error(`Review cycle ${reviewCycleSlug} doesn't exist.`);
  }
  let query = new LC.Query(LC.User);
  const reviewer = await query.get(userId);
  if (!reviewer) {
    throw new Error(`User ID ${userId} doesn't exist!`);
  }
  const {
    summary,
    cultureScore,
    cultureText,
    analyticalSkillScore,
    analyticalSkillText,
    executionScore,
    executionText,
    impactScore,
    impactText,
    strength,
    weakness,
    feedbackManager,
    feedbackCompany,
    finalized,
  } = selfReviewData;
  query = new LC.Query(SelfReview);
  query.equalTo('reviewer', reviewer);
  query.equalTo('reviewCycle', cycle);
  let selfReview = await query.first();
  if (!selfReview) {
    selfReview = new SelfReview({ reviewer, reviewCycle: cycle });
  }
  await selfReview.save(
    {
      summary,
      cultureScore,
      cultureText,
      analyticalSkillScore,
      analyticalSkillText,
      executionScore,
      executionText,
      impactScore,
      impactText,
      strength,
      weakness,
      feedbackManager,
      feedbackCompany,
      finalized,
    },
    { useMasterKey: true },
  );
  return selfReview.toJSON();
}
