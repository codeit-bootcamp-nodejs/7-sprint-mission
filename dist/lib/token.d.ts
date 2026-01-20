import 'dotenv/config';
export declare function generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
};
export declare function verifyAccessToken(token: string): {
    userId: string;
};
export declare function verifyRefreshToken(token: string): {
    userId: string;
};
//# sourceMappingURL=token.d.ts.map