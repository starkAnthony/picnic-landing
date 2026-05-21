# Site images

Instagram does not allow automatic download of post photos. To use **your real work**:

1. Open [@sevinc_picnic](https://www.instagram.com/sevinc_picnic/) on your phone or computer.
2. Save 4–6 of your best photos (photo zones, birthdays, decorations).
3. Put files in `gallery/` and **update `src/data/gallery.ts`** if names or extensions differ.

| File | Used for |
|------|----------|
| `gallery/03.jpg` (see `gallery.ts`) | Main image on the home page (not shown in gallery) |
| `gallery/01.PNG`, `02.PNG`, … | Gallery section |

**Important:** The site uses the **exact filename** (e.g. `01.PNG` ≠ `01.jpg`). After adding images, hard-refresh the browser (`Ctrl+Shift+R`).

You can add or reorder images by editing `src/data/gallery.ts`.
