import {Hono} from 'hono';
import {zValidator} from "@hono/zod-validator";
import {loginSchema, registerSchema} from "../schemas";
import {createAdminClient} from "@/lib/appwrite";
import {ID} from "node-appwrite";
import {deleteCookie, getCookie, setCookie} from "hono/cookie";
import {AUTH_COOKIE} from "@/features/auth/constants";
import {sessionMiddleware} from "@/lib/session-middlware";

const app = new Hono()
    .get("/current",
        sessionMiddleware,
        (c) => {
            const user = c.get("user");
            return c.json({data: user});
        })
    .post(
        "/login",
        zValidator("json", loginSchema),
        async (c) => {
            const {email, password} = c.req.valid("json");

            const {account} = await createAdminClient();
            const session = await account.createEmailPasswordSession(
                email,
                password
            );

            const value = getCookie(c);
            console.log(value);
            setCookie(c, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });
            return c.json({success: true});
            console.log(value);
        }
    )
    .post("/register",
        zValidator("json", registerSchema),
        async (c) => {
            const {name, email, password} = c.req.valid("json");
            const {account} = await createAdminClient();
            await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            const session = await account.createEmailPasswordSession(
                email,
                password
            );

            setCookie(c, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });
            return c.json({success: true});
        }
    )
    .post("/logout", sessionMiddleware, async (c) => {
        const account = c.get("account");
        deleteCookie(c, AUTH_COOKIE);
        await account.deleteSession("current");
        return c.json({success: true})
    })

export default app;