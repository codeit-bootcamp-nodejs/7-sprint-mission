const fakeGroupDB = [];

const mockPrisma = {
  group: {
    create: async ({ data }) => {
      const newEntry = {
        id: fakeGroupDB.length + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: {
          id: data.owner_id,
          nickname: data.ownerNickname,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        participants: [],
      };
      fakeGroupDB.push(newEntry);
      return newEntry;
    },
    findMany: async (args) => {
      return fakeGroupDB;
    },
    findUnique: async ({ where }) => {
      return fakeGroupDB.find((g) => g.id === where.id) || null;
    },
    update: async ({ where, data }) => {
      const idx = fakeGroupDB.findIndex((g) => g.id === where.id);
      if (idx === -1) throw new Error("Not Found");
      fakeGroupDB[idx] = {
        ...fakeGroupDB[idx],
        ...data,
        updatedAt: new Date(),
      };
      return fakeGroupDB[idx];
    },
    delete: async ({ where }) => {
      const idx = fakeGroupDB.findIndex((g) => g.id === where.id);
      if (idx !== -1) fakeGroupDB.splice(idx, 1);
      return true;
    },
  },
};

class GroupCRUD {
  constructor() {
    this.prisma = mockPrisma;
  }

  formatResponse(group) {
    const badges = [];
    if (group.participantCount >= 10) badges.push("회원 10명 이상");
    if (group.like_count >= 100) badges.push("추천 100개 이상");
    if (group.goalRep >= 100) badges.push("운동수 100개 이상");

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      photoUrl: group.photoUrl,
      goalRep: group.goalRep,
      discordWebhookUrl: group.discordWebhookUrl,
      discordInviteUrl: group.discordInviteUrl,
      likeCount: group.like_count,
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
  }

  createGroup = async (req, res) => {
    try {
      const {
        owner_id,
        ownerNickname,
        name,
        tags,
        goalRep,
        photoUrl,
        password,
        description,
        discordWebhookUrl,
        discordInviteUrl,
      } = req.body;

      const newGroup = await this.prisma.group.create({
        data: {
          owner_id,
          ownerNickname,
          name,
          tags,
          goalRep,
          photoUrl,
          password,
          description,
          discordWebhookUrl,
          discordInviteUrl,
          like_count: 0,
          participantCount: 1,
        },
      });

      const response = this.formatResponse(newGroup);
      res.status(201).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "에러남" });
    }
  };

  getGroupDetail = async (req, res) => {
    try {
      const { groupId } = req.params;
      const group = await this.prisma.group.findUnique({
        where: { id: Number(groupId) },
      });
      if (!group) return res.status(404).send({ message: "없음" });
      const response = this.formatResponse(group);
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
    }
  };
}

const controller = new GroupCRUD();

const mockRes = (label) => ({
  status: (code) => ({
    send: (data) => {
      console.log(`\n--- [${label}] 결과 (Status: ${code}) ---`);
      console.log(JSON.stringify(data, null, 2)); // 보기 좋게 출력
    },
  }),
});

async function runTest() {
  console.log("시작");

  const reqCreate = {
    body: {
      owner_id: 1,
      ownerNickname: "Jemi",
      name: "새벽 러닝 크루",
      password: "1234",
      description: "새벽에 뜁니다",
      tags: ["러닝", "오운완"],
      goalRep: 50,
      photoUrl: "img.jpg",
      discordWebhookUrl: "url",
      discordInviteUrl: "invite",
    },
  };
  await controller.createGroup(reqCreate, mockRes("그룹 생성 API"));

  const reqGet = {
    params: { groupId: 1 },
  };
  await controller.getGroupDetail(reqGet, mockRes("그룹 상세 조회 API"));
}

runTest();
