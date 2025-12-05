//댓글 수정 서비스로직
export async function updateComment(commentId, updateData) {
  try {
    const updatedComment = await prisma.article_comment.update({
      where: {
        id: parseInt(commentId, 10),
      },
      data: updateData, // { content }만 넘어옴
    });

    return updatedComment;
  } catch (error) {
    throw error;
  }
}

//댓글 삭제 서비스 로직
export async function deleteComment(commentId) {
  try {
    const deletedComment = await prisma.article_comment.delete({
      where: {
        id: parseInt(commentId, 10), // BigInt 타입 변환
      },
    });
    return deletedComment;
  } catch (error) {
    throw error;
  }
}
