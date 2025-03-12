import { describe, expect, it } from 'vitest';
import request from "supertest";
import { app } from "../index";

describe("API TESTING", () => {
    describe("GET /api/hello", () => {
        it("should return the expected response", async () => {
            const res = await request(app)
                .get("/api/hello")
                .query({ a: 1 });

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({ hello: { "a": "1" } });
            expect(res.body.message).toBe("Hello from server");
        });
    });
})



