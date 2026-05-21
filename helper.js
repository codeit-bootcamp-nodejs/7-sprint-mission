export const formatGroupResponse = (group) => {
  const badges = [];

  if (group.participantCount >= 10) badges.push("참여자 10명 이상");
  if (group.like_count >= 100) badges.push("추천수 100 이상");

  const recordCount = group.recordCount || 0;

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    photoUrl: group.photoUrl,
    goalRep: group.goalRep,
    discordWebhookUrl: group.discordWebhookUrl,
    discordInviteUrl: group.discordInviteUrl,
    likeCount: group.like_count,
    recordCount: recordCount,
    tags: group.tags || [],
    owner: group.owner
      ? {
          id: group.owner.id,
          nickname: group.owner.nickname,
          createdAt: new Date(group.owner.createdAt).getTime(),
          updatedAt: new Date(group.owner.updatedAt).getTime(),
        }
      : null,

    participants: group.participants
      ? group.participants.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          createdAt: new Date(p.createdAt).getTime(),
          updatedAt: new Date(p.updatedAt).getTime(),
        }))
      : [],

    createdAt: new Date(group.createdAt).getTime(),
    updatedAt: new Date(group.updatedAt).getTime(),

    badges: badges,
  };
};
