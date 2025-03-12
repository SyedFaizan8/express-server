import { app } from "../index";
import request from 'supertest';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { prisma, ApiResponse } from '../utils/index';

describe('API TESTING for /api/check-username', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should return available true when no user is found", async () => {
        vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

        const res = await request(app)
            .get("/api/check-username")
            .query({ username: 'kailash' });

        expect(res.status).toBe(200);
        const expected = new ApiResponse(
            200,
            { available: true },
            "Username availability check successful",
        );
        expect(res.body).toEqual(expected);
    });


    it("should return available false when a user is found", async () => {

        const fakeUser = {
            user_id: '1',
            fullname: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            bio: null,
            password: 'password',
            refreshToken: null,
            website: null,
            imageId: null,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            created_at: new Date()
        };

        vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUser);

        const res = await request(app)
            .get("/api/check-username")
            .query({ username: 'testuser' });

        expect(res.status).toBe(200);
        const expected = new ApiResponse(
            200,
            { available: false },
            "Username availability check successful",
        );
        expect(res.body).toEqual(expected);
    });

    it("should return error 400 when validation fails", async () => {
        const res = await request(app)
            .get("/api/check-username")
            .query({});

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation failed");
    });

    it("should return error 500 when prisma query fails", async () => {
        vi.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error("Database error"));

        const res = await request(app)
            .get("/api/check-username")
            .query({ username: 'testuser' });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error while checking username");
    });
})