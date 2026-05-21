// 그룹 crud 만들고 지우고 수정하고 조회하는 api
// 만들어야할것  post , get get , patch , delete
// 유져 id , name , description , photoUrl , discordWebhookUrl, likeCount , tags
// , createdAt, updatedAt,
// 오너  owner id , nickname , createdAt , updatedAt
//  participants id, nickname, createdAt, updatedAt
// 이미지 멀터 만들기
//헬퍼 사용 api 명세를 도저히 복잡해서 여기서는 못따라감
//클래스 사용, 유효성 검사,  완료 스키마 변경요청 .. 안된다면 내꺼 변경 가능성 높은것들 주석표시
//헬퍼js 사용시 api test 잘나오느것 확인
//

import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { formatGroupResponse } from "../../utils/helpers.js";
const prisma = new PrismaClient();

// 이미지
export const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export class GroupCRUD {
  constructor() {
    this.prisma = prisma;
  }
  createGroup = async (req, res) => {
    try {
      const {
        owner_id, /////////////// ////////////////////////////////////////////////////////////
        ownerNickname, ///////////////////////////////////////////////////////////////////////////
        name, ///////////////////////////////////////////////////////////////////////////
        tags,
        goalRep,
        photoUrl,
        password,
        description,
        discordWebhookUrl,
        discordInviteUrl,
      } = req.body;

      if (!owner_id)
        return res.status(400).send({ message: "아이디를 입력하세요" });
      if (!password)
        return res.status(400).send({ message: "비밀번호를 입력하세요" });
      if (!name)
        return res.status(400).send({ message: "그룹명을 입력하세요" });
      if (!ownerNickname)
        return res.status(400).send({ message: "닉네임을 입력하세요" });

      const newGroup = await this.prisma.group.create({
        data: {
          owner_id, ////////////////////////////////////////////////////////////
          ownerNickname, /////////////////////////////////////////////
          name, ////////////////////////////////////////////////////////////
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
      const response = {
        ...formatGroupResponse(newGroup),
        owner: {
          id: owner_id, /////////////////////////////////////////////
          nickname: ownerNickname, /////////////////////////////////////////////
          createdAt: Date.now(), /////////////////////////////////////////////
          updatedAt: Date.now(), /////////////////////////////////////////////
        },
        participants: [],
        badges: [],
      };

      res.status(201).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "그룹생성중 오류가 발생했습니다." });
    }
  };

  uploadimage = (file) => {
    const imagePath = file.path.replace(/\\/g, "/");
    return { url: `https://localhost:3000/${imagePath}` };
  };

  getGroup = async (req, res) => {
    try {
      const { page = 1, pageSize = 10, sortBy, keyword } = req.query;
      let orderBy;
      switch (sortBy) {
        case "mostlike":
          orderBy = { like_count: "desc" };
          break;
        case "mostBadges":
          orderBy = { participantCount: "desc" };
          break;
        case "latest":
        default:
          orderBy = { createdAt: "desc" };
      }
      const where = keyword ? { name: { contains: keyword } } : {};
      const [total, groups] = await Promise.all([
        this.prisma.group.count({ where }),
        this.prisma.group.findMany({
          skip: (Number(page) - 1) * Number(pageSize),
          take: Number(pageSize),
          where,
          orderBy,
          include: {
            owner: true,
            participants: true,
          },
        }),
      ]);
      const formattedData = groups.map((group) => formatGroupResponse(group));
      res.status(200).send({
        data: formattedData,
        total: total,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "그룹조회 실패" });
    }
  };

  getGroupDetail = async (req, res) => {
    try {
      const { groupId } = req.params;
      const group = await this.prisma.group.findUnique({
        where: { id: Number(groupId) }, /////////////////////////////////////////////
        include: {
          owner: true,
          participants: true,
        },
      });

      if (!group) {
        return res.status(404).send({ message: "그룹을 찾을 수 없습니다." });
      }

      const response = formatGroupResponse(group);
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "상세 조회 실패." });
    }
  };

  patchGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const { password, ...dataToUpdate } = req.body;

      const group = await this.prisma.group.findUnique({
        where: { id: Number(groupId) }, ///////////////
      });

      if (!group) return res.status(404).send({ message: "그룹이 없습니다." });
      if (group.password !== password) {
        return res.status(403).send({ message: "비밀번호가 틀립니다" });
      }
      const updatedGroup = await this.prisma.group.update({
        where: { id: Number(groupId) }, /////////////////////////////////////////////
        data: dataToUpdate,
        include: {
          owner: true,
          participants: true,
        },
      });

      const response = formatGroupResponse(updatedGroup);
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "그룹 수정에 실패했습니다." });
    }
  };

  deleteGroup = async (req, res) => {
    try {
      const { groupId } = req.params;
      const { ownerPassword } = req.body;
      const group = await this.prisma.group.findUnique({
        where: { id: Number(groupId) }, /////////////////////////////////////////////
      });
      if (!group) {
        return res.status(404).send({ message: "그룹이 없습니다." });
      }
      if (group.password !== ownerPassword) {
        return res.status(403).send({ message: "비밀번호가 틀립니다" });
      }
      await this.prisma.group.delete({
        where: { id: Number(groupId) }, /////////////////////////////////////////////
      });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "그룹 삭제 중 오류가 발생했습니다." });
    }
  };
}
