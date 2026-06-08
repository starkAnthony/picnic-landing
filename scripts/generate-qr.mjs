import { writeFileSync } from 'node:fs'
import QRCode from 'qrcode'

const url = process.env.SITE_URL?.trim() || 'https://picnic-landing.vercel.app'
const outPath = 'public/qr-website.png'

const png = await QRCode.toBuffer(url, {
  type: 'png',
  width: 1024,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: {
    dark: '#3d5240',
    light: '#faf8f4',
  },
})

writeFileSync(outPath, png)
console.log(`QR code saved: ${outPath}`)
console.log(`Links to: ${url}`)
