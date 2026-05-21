# Telegram bot setup (send form without leaving the page)

Visitors stay on the site. Messages arrive in **your Telegram app** from your bot.

## 1. Create a bot

1. Open Telegram → search **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g. `Sevinc Picnic Bookings`)
4. Choose a username (e.g. `sevinc_picnic_bot`)
5. Copy the **token** (looks like `7123456789:AAH...`)

## 2. Get your chat ID (demo: @tony_not)

1. Open **your bot** in Telegram (the link BotFather gives you)
2. Press **Start** or send any message, e.g. `hi`
3. In a browser open (replace `TOKEN`):

   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```

4. Find `"chat":{"id":123456789` — that number is **TELEGRAM_CHAT_ID**

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
