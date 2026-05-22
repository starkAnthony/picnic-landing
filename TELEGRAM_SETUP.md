# Telegram bot setup (send form without leaving the page)

Visitors stay on the site. Messages arrive in **your Telegram app** from your bot.

## 1. Create a bot

1. Open Telegram → search **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g. `Sevinc Picnic Bookings`)
4. Choose a username (e.g. `sevinc_picnic_bot`)
5. Copy the **token** (looks like `7123456789:AAH...`)

## 2. Get `TELEGRAM_CHAT_ID`

### Option A — Private chat (messages only to you)

1. Open **your bot** in Telegram (BotFather link)
2. Press **Start** or send `hi`
3. Browser (replace `TOKEN`):

   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```

4. Find `"chat":{"id":8175279023` — positive number → **TELEGRAM_CHAT_ID**

### Option B — Telegram group (team sees bookings)

1. Create a group → **Add members** → add your **bot** (as member; admin is fine)
2. In the **group**, send any message, e.g. `test` (so Telegram registers the chat)
3. Open the same URL:

   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```

4. Find the latest message where `"chat":{"id":-1001234567890` — use that **full number including minus**

   - Supergroup IDs almost always start with **`-100`**
   - Do **not** use a person’s user ID (positive number like `5191230976`) — that is not the group ID

5. **TELEGRAM_CHAT_ID** on Vercel = exactly that value, e.g. `-1002876543210`

**“Start” in the bot is only for private chat (Option A).** For groups you do not press Start — you only need the correct **group** `chat.id`.

### Group upgraded to supergroup?

If the site shows `group chat was upgraded to a supergroup chat`, Telegram changed the group id (e.g. from `-5191230976` to `-100...`). Send a new message in **Picnic** group, open `getUpdates` again, copy the new `"chat":{"id":-100...}`, update Vercel, and **Redeploy**.

## 3. Add secrets on Vercel

Project → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `TELEGRAM_BOT_TOKEN` | token from BotFather |
| `TELEGRAM_CHAT_ID` | your chat id number |

Apply to **Production** (and Preview if you want).

## 4. Redeploy

**Deployments** → latest → **Redeploy**.

## 5. Test

Submit the form on the live site. You should see **Rahmat!** on the page and a new message from your bot in Telegram.

---

**Note:** `npm run dev` does not run `/api/telegram`. Use the deployed Vercel URL, or run `npx vercel dev` locally with the same env vars.

**Local `.env` for `vercel dev`:** create `.env` in project root with the two variables (do not commit `.env`).
