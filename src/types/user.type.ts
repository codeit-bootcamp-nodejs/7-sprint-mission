export interface UpdateUserDto {
  nickname?: string;
  image?: string;
}

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};
